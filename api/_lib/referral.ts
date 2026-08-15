/**
 * /api/_lib/referral.ts — shared Referral Engine logic.
 *
 * Flow:
 *  1. Visitor lands with ?ref=CODE → frontend stores it → sent with checkout.
 *  2. create-checkout validates the code, tags session metadata, and gives
 *     the REFERRED subscriber their first month free (100% off, 1 cycle).
 *  3. Stripe webhook (checkout.session.completed) calls
 *     recordReferralConversion():
 *       - inserts referral_conversions (idempotent per referred email)
 *       - rewards the REFERRER: 1 free month per referral (customer balance
 *         credit equal to one billing cycle), free-for-life coupon at 3+.
 *       - emails the referrer.
 *
 * Coupons are created lazily and idempotently by fixed ID — no manual
 * dashboard step required.
 */
import type Stripe from "stripe";
import crypto from "crypto";
import { query, queryOne } from "./db";

export const REFERRAL_COUPON_FIRST_MONTH = "REFERRAL_FREE_MONTH";
export const REFERRAL_COUPON_FREE_LIFE = "REFERRAL_FREE_LIFE";
export const FREE_FOR_LIFE_THRESHOLD = 3;

const CODE_RE = /^[a-z0-9-]{3,32}$/;

export function isValidCodeFormat(code: unknown): code is string {
  return typeof code === "string" && CODE_RE.test(code);
}

/** Look up the referrer for a code. Returns null when the code is unknown. */
export async function findReferrer(code: string): Promise<{ email: string } | null> {
  if (!isValidCodeFormat(code)) return null;
  const row = await queryOne<{ referrer_email: string }>(
    `SELECT referrer_email FROM referrals WHERE referrer_code = $1 LIMIT 1`,
    [code],
  );
  return row?.referrer_email ? { email: row.referrer_email.toLowerCase() } : null;
}

/** Idempotently make sure a coupon exists (fixed id). */
export async function ensureCoupon(
  stripe: Stripe,
  id: string,
  params: Stripe.CouponCreateParams,
): Promise<boolean> {
  try {
    await stripe.coupons.retrieve(id);
    return true;
  } catch {
    try {
      await stripe.coupons.create({ id, ...params });
      return true;
    } catch (err) {
      console.error(`ensureCoupon(${id}) failed:`, err);
      return false;
    }
  }
}

export async function ensureReferredFirstMonthCoupon(stripe: Stripe): Promise<boolean> {
  return ensureCoupon(stripe, REFERRAL_COUPON_FIRST_MONTH, {
    percent_off: 100,
    duration: "repeating",
    duration_in_months: 1,
    name: "Referral — first month free",
  });
}

/**
 * Called from the Stripe webhook on checkout.session.completed.
 * Never throws — referral failures must not fail the webhook.
 */
export async function recordReferralConversion(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<void> {
  try {
    const code = session.metadata?.referral_code;
    const referredEmail = session.customer_details?.email?.toLowerCase();
    if (!code || !isValidCodeFormat(code) || !referredEmail) return;

    const referrer = await findReferrer(code);
    if (!referrer) return;
    // No self-referrals.
    if (referrer.email === referredEmail) return;

    // ── 1. Record conversion (idempotent: referred_email is UNIQUE) ──
    try {
      await query(
        `INSERT INTO referral_conversions
           (id, referrer_code, referrer_email, referred_email, stripe_customer_id, tier)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          crypto.randomUUID(),
          code,
          referrer.email,
          referredEmail,
          (session.customer as string) ?? null,
          session.metadata?.product ?? null,
        ],
      );
    } catch {
      // Already recorded (duplicate referred_email) — do not double-reward.
      return;
    }

    // Mark legacy referrals row as converted (best effort).
    try {
      await query(
        `UPDATE referrals SET status = 'completed', referred_email = $1
         WHERE referrer_code = $2 AND referred_email IS NULL`,
        [referredEmail, code],
      );
    } catch { /* non-fatal */ }

    const countRow = await queryOne<{ n: number }>(
      `SELECT COUNT(*) AS n FROM referral_conversions WHERE referrer_email = $1`,
      [referrer.email],
    );
    const conversions = Number(countRow?.n ?? 0);

    // ── 2. Reward the referrer ──
    const referrerUser = await queryOne<{ stripe_customer_id: string | null }>(
      `SELECT stripe_customer_id FROM app_users WHERE email = $1`,
      [referrer.email],
    );
    const referrerCustomerId = referrerUser?.stripe_customer_id ?? null;

    let rewardApplied = "none";

    if (referrerCustomerId) {
      try {
        const subs = await stripe.subscriptions.list({
          customer: referrerCustomerId,
          status: "active",
          limit: 1,
        });
        const sub = subs.data[0];

        if (sub) {
          if (conversions >= FREE_FOR_LIFE_THRESHOLD) {
            // Free for life — 100% off forever on their subscription.
            const ok = await ensureCoupon(stripe, REFERRAL_COUPON_FREE_LIFE, {
              percent_off: 100,
              duration: "forever",
              name: "Referral — free for life (3 referrals)",
            });
            if (ok) {
              try {
                await stripe.subscriptions.update(sub.id, {
                  discounts: [{ coupon: REFERRAL_COUPON_FREE_LIFE }],
                });
                rewardApplied = "free_for_life";
              } catch (err) {
                console.error("free-for-life discount failed:", err);
              }
            }
          } else {
            // 1 free month — credit one billing cycle to the customer balance.
            const item = sub.items.data[0];
            const amount = item?.price?.unit_amount ?? 0;
            const currency = item?.price?.currency ?? "usd";
            if (amount > 0) {
              await stripe.customers.createBalanceTransaction(referrerCustomerId, {
                amount: -amount,
                currency,
                description: `Referral reward — 1 free month (referral #${conversions})`,
              });
              rewardApplied = "free_month";
            }
          }
        }
      } catch (err) {
        console.error("Referrer reward failed:", err);
      }
    }

    // ── 3. Notify the referrer ──
    try {
      const { sendEmail } = await import("../email-sequence");
      const remaining = Math.max(0, FREE_FOR_LIFE_THRESHOLD - conversions);
      const rewardLine =
        rewardApplied === "free_for_life"
          ? `That was referral #${conversions} — <strong>your membership is now free for life.</strong> No more charges, ever.`
          : rewardApplied === "free_month"
            ? `That's referral #${conversions} — <strong>one free month</strong> has been credited to your account automatically.${remaining > 0 ? ` ${remaining} more referral${remaining === 1 ? "" : "s"} and your membership is free for life.` : ""}`
            : `That's referral #${conversions}. Subscribe to start collecting your free months — your referrals are banked and waiting.`;
      const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0B1D3A;">
  <p style="color: #60A5FA; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-bottom: 24px;">INVISIBLE EXIT</p>
  <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; line-height: 1.3;">Someone just joined through your link.</h1>
  <p style="font-size: 16px; line-height: 1.6; color: #4A5568; margin-bottom: 24px;">${rewardLine}</p>
  <a href="https://invisibleexit.com/dashboard" style="display: inline-block; padding: 14px 28px; background: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">See your referral stats</a>
  <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />
  <p style="font-size: 12px; color: #8A95A8;">You received this because someone subscribed with your Invisible Exit referral link.</p>
</div>`;
      await sendEmail(referrer.email, "Your referral just converted 🎉", html);
    } catch (emailErr) {
      console.error("Referral notification email failed:", emailErr);
    }

    console.log(
      `Referral conversion: ${code} → ${referredEmail} (referrer ${referrer.email}, total ${conversions}, reward ${rewardApplied})`,
    );
  } catch (err) {
    console.error("recordReferralConversion error:", err);
  }
}

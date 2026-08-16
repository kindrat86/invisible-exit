import type { VercelRequest, VercelResponse } from "./_lib/types";
import Stripe from "stripe";
import {
  findReferrer,
  ensureReferredFirstMonthCoupon,
  ensureCoupon,
  isValidCodeFormat,
  REFERRAL_COUPON_FIRST_MONTH,
} from "./_lib/referral";

// ── Win-back promo: COMEBACK50 = 50% off, 3 months (repeating). ──
// Created idempotently (fixed ID); a malformed/unknown code is ignored.
const WINBACK_COUPON_ID = "COMEBACK50";
const WINBACK_COUPON_PARAMS: Stripe.CouponCreateParams = {
  percent_off: 50,
  duration: "repeating",
  duration_in_months: 3,
  name: "Win-back: 50% off for 3 months",
};

interface TierConfig {
  priceId: string;
  product: string;
}

/**
 * Sanitize a client-supplied return/cancel URL so Stripe can only ever
 * redirect back to our own site (blocks open-redirect / phishing after
 * payment). Accepts relative paths or absolute URLs on the site host;
 * anything else falls back to `fallback`.
 */
function safeSiteUrl(input: unknown, siteUrl: string, fallback: string): string {
  if (typeof input !== "string" || input.length === 0) return fallback;
  if (input.startsWith("/") && !input.startsWith("//")) return `${siteUrl}${input}`;
  try {
    const target = new URL(input);
    const site = new URL(siteUrl);
    if ((target.protocol === "https:" || target.protocol === "http:") && target.host === site.host) {
      return `${site.origin}${target.pathname}${target.search}`;
    }
  } catch {
    // not a parseable absolute URL, fall through
  }
  return fallback;
}

/** Append the Stripe session id placeholder, respecting an existing query string. */
function withSessionId(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const { tier, returnUrl, cancelUrl, referralCode, coupon } = req.body;
    const siteUrl =
      process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? "https://invisibleexit.com";

    // ── Win-back promo (COMEBACK50): validate against the whitelist, ensure
    //    the coupon exists, and pre-apply it to the checkout session. ──
    let winbackDiscount: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (typeof coupon === "string" && coupon.trim().toUpperCase() === WINBACK_COUPON_ID) {
      if (await ensureCoupon(stripe, WINBACK_COUPON_ID, WINBACK_COUPON_PARAMS)) {
        winbackDiscount = [{ coupon: WINBACK_COUPON_ID }];
      }
    }

    // ── Referral Engine: validate the code and prep the referred-user reward.
    //    A valid code (a) is stamped into session metadata so the webhook can
    //    credit the referrer, and (b) gives the referred subscriber their
    //    first month free (100% off, 1 cycle) on subscription checkouts.
    let referralMeta: Record<string, string> = {};
    let referralDiscount: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (isValidCodeFormat(referralCode)) {
      try {
        const referrer = await findReferrer(referralCode);
        if (referrer) {
          referralMeta = { referral_code: referralCode };
          if (await ensureReferredFirstMonthCoupon(stripe)) {
            referralDiscount = [{ coupon: REFERRAL_COUPON_FIRST_MONTH }];
          }
        }
      } catch (refErr) {
        // Referral lookup must never block checkout.
        console.error("referral lookup failed:", refErr);
      }
    }

    // Map tier names to Stripe price IDs
    // Subscriptions: starter ($9/mo Founder), founder_annual ($79/yr), founding (legacy), standard ($29/mo Stealth Pro)
    // One-time: tripwire, workshop, book
    // Combo: tripwire_bump = starter sub ($9/mo) + tripwire one-time ($7)
    const SUBSCRIPTION_TIERS: Record<string, TierConfig> = {
      starter: {
        priceId: process.env.STRIPE_STARTER_PRICE_ID!,
        product: "starter",
      },
      founder_annual: {
        priceId: process.env.STRIPE_FOUNDER_ANNUAL_PRICE_ID!,
        product: "founder_annual",
      },
      founding: {
        priceId: process.env.STRIPE_FOUNDING_PRICE_ID!,
        product: "founding",
      },
      standard: {
        priceId: process.env.STRIPE_STANDARD_PRICE_ID!,
        product: "standard",
      },
    };

    const ONETIME_TIERS: Record<string, TierConfig> = {
      tripwire: {
        priceId:
          process.env.STRIPE_TRIPWIRE_PRICE_ID ?? "price_tripwire_stealth_blueprint",
        product: "tripwire",
      },
      workshop: {
        priceId:
          process.env.STRIPE_WORKSHOP_PRICE_ID ?? "price_weekend_workshop",
        product: "weekend_workshop",
      },
      book: {
        priceId: process.env.STRIPE_BOOK_PRICE_ID ?? "price_free_book_shipping",
        product: "book",
      },
      book_audiobook: {
        priceId:
          process.env.STRIPE_BOOK_AUDIOBOOK_PRICE_ID ?? "price_book_audiobook",
        product: "book_audiobook",
      },
    };

    // tripwire_bump = combo: starter subscription + tripwire one-time
    // This creates a checkout session with BOTH line items (Ch 14 Order Bump pattern)
    // First: resolve customer email (same logic as below)
    let customerEmail: string | undefined;
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const jwt = (await import("jsonwebtoken")).default;
        const token = authHeader.replace("Bearer ", "");
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
          email?: string;
        };
        customerEmail = payload.email;
      } catch {
        // Ignore auth failures, allow guest checkout
      }
    }

    // ── Order Bump (DotCom Secrets Ch 14): Always include the tripwire
    //    as a Stripe-side line item when subscribing to Starter.
    //    The user sees BOTH items in Stripe Checkout, no page-level toggle.
    //    This avoids the conversion-killing price change on the CTA button
    //    while still getting the $7 bump on every new subscription.
    const starterPrice = process.env.STRIPE_STARTER_PRICE_ID!;
    const tripwirePrice = process.env.STRIPE_TRIPWIRE_PRICE_ID!;

    if (tier === "starter" || tier === "tripwire_bump") {
      const bumpSuccessUrl = withSessionId(
        safeSiteUrl(returnUrl, siteUrl, `${siteUrl}/oto/founding`)
      );

      const bumpSessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "subscription",
        line_items: [
          { price: starterPrice, quantity: 1 },
          { price: tripwirePrice, quantity: 1 },
        ],
        success_url: bumpSuccessUrl,
        cancel_url: safeSiteUrl(cancelUrl, siteUrl, `${siteUrl}/`),
        allow_promotion_codes: false,
        metadata: { product: "starter", order_bump: "tripwire", ...referralMeta },
      };
      const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [
        ...(referralDiscount ?? []),
        ...(winbackDiscount ?? []),
      ];
      if (discounts.length) {
        bumpSessionParams.discounts = discounts;
      }

      if (customerEmail) {
        bumpSessionParams.customer_email = customerEmail;
      }

      const session = await stripe.checkout.sessions.create(bumpSessionParams);
      return res.status(200).json({ url: session.url });
    }

    const isOneTime = tier in ONETIME_TIERS;
    const tierConfig = isOneTime
      ? ONETIME_TIERS[tier as keyof typeof ONETIME_TIERS]
      : SUBSCRIPTION_TIERS[tier];

    if (!tierConfig) {
      return res.status(400).json({ error: "Invalid tier" });
    }

    const successUrl = withSessionId(
      safeSiteUrl(returnUrl, siteUrl, `${siteUrl}/oto/founding`)
    );

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isOneTime ? "payment" : "subscription",
      line_items: [{ price: tierConfig.priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: safeSiteUrl(cancelUrl, siteUrl, `${siteUrl}/`),
      allow_promotion_codes: false,
      metadata: { product: tierConfig.product, ...referralMeta },
    };
    // Referred-user first-month-free and win-back coupons apply to
    // subscriptions only (a "repeating" coupon can't attach to one-time).
    if (!isOneTime) {
      const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [
        ...(referralDiscount ?? []),
        ...(winbackDiscount ?? []),
      ];
      if (discounts.length) {
        sessionParams.discounts = discounts;
      }
    }

    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("create-checkout error:", error);
    return res.status(400).json({
      error: "An unexpected error occurred. Please try again.",
    });
  }
}

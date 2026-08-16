/**
 * /api/referral.ts, Referral Engine backend.
 *
 * POST (auth required):
 *   { action: "get_or_create" } →
 *     { code, link, conversions, freeMonthsEarned, freeForLife }
 *
 * The code is stable per user (stored in `referrals`, one row per referrer).
 * Conversions are counted from `referral_conversions`, written by the Stripe
 * webhook when a checkout that carried this code completes.
 *
 * Rewards (applied automatically by the webhook, documented here):
 *   - each referral → referrer gets 1 free month (100% off coupon, 1 cycle)
 *   - 3+ referrals → referrer's subscription is free for life
 *   - the referred subscriber also gets their first month free
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import crypto from "crypto";
import { query, queryOne } from "./_lib/db";
import { requirePost, verifyBearer } from "./_lib/auth";

const CODE_RE = /^[a-z0-9-]{3,32}$/;

function makeCode(email: string): string {
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10) || "exit";
  return `${base}-${crypto.randomBytes(2).toString("hex")}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;

  const claims = verifyBearer(req);
  if (!claims?.email) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const email = claims.email.toLowerCase();

  try {
    // ── Stable code per referrer ──
    let row = await queryOne<{ referrer_code: string }>(
      `SELECT referrer_code FROM referrals WHERE referrer_email = $1 ORDER BY created_at ASC LIMIT 1`,
      [email],
    );

    if (!row) {
      // Create with collision retry
      for (let i = 0; i < 5 && !row; i++) {
        const code = makeCode(email);
        if (!CODE_RE.test(code)) continue;
        try {
          await query(
            `INSERT INTO referrals (id, referrer_email, referrer_code, status)
             VALUES ($1, $2, $3, 'active')`,
            [crypto.randomUUID(), email, code],
          );
          row = { referrer_code: code };
        } catch {
          // UNIQUE collision on referrer_code, retry with a new suffix
        }
      }
    }

    if (!row) {
      return res.status(500).json({ error: "Could not allocate referral code" });
    }

    const countRow = await queryOne<{ n: number }>(
      `SELECT COUNT(*) AS n FROM referral_conversions WHERE referrer_email = $1`,
      [email],
    );
    const conversions = Number(countRow?.n ?? 0);

    const siteUrl = process.env.SITE_URL ?? "https://invisibleexit.com";

    return res.status(200).json({
      code: row.referrer_code,
      link: `${siteUrl}/?ref=${row.referrer_code}`,
      conversions,
      freeMonthsEarned: conversions,
      freeForLife: conversions >= 3,
    });
  } catch (err) {
    console.error("referral endpoint error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}

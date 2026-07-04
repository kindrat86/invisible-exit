import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "../../src/lib/neon/server";
import { requirePost, generateToken } from "../_lib/auth";

interface MagicLinkBody {
  email?: string;
}

const APP_URL = process.env.APP_URL || "https://invisibleexit.com";

/**
 * Lazily import Resend so the route still boots if the dependency is missing
 * (returns success without sending — token is still stored for dev/testing).
 */
async function sendMagicLinkEmail(email: string, token: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[magic-link] RESEND_API_KEY not set — skipping email send");
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const link = `${APP_URL}/auth/callback?token=${token}`;
  await resend.emails.send({
    from: "escape@invisibleexit.com",
    to: email,
    subject: "Your InvisibleExit sign-in link",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Sign in to InvisibleExit</h2>
        <p>Click the button below to sign in. This link expires in 24 hours.</p>
        <p style="margin: 24px 0;">
          <a href="${link}" style="background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Sign in</a>
        </p>
        <p style="color: #6b7280; font-size: 13px;">
          Or paste this link into your browser:<br>
          <a href="${link}">${link}</a>
        </p>
      </div>
    `,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;

  const { email } = (req.body ?? {}) as MagicLinkBody;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const token = generateToken();

  // Upsert: create user if not exists (passwordless), set magic link token
  const rows = await query<{ id: string }>(
    `
    INSERT INTO app_users (email, magic_link_token, magic_link_expires)
    VALUES ($1, $2, NOW() + INTERVAL '24 hours')
    ON CONFLICT (email) DO UPDATE
      SET magic_link_token = $2,
          magic_link_expires = NOW() + INTERVAL '24 hours',
          updated_at = NOW()
    RETURNING id
    `,
    [normalizedEmail, token]
  );

  // Ensure profile row exists
  if (rows[0]) {
    await query(
      `INSERT INTO profiles (id, email) VALUES ($1, $2)
       ON CONFLICT (id) DO NOTHING`,
      [rows[0].id, normalizedEmail]
    );
  }

  try {
    await sendMagicLinkEmail(normalizedEmail, token);
  } catch (err) {
    console.error("[magic-link] email send failed:", err);
    // don't leak — return success so we don't reveal which emails exist
  }

  return res.status(200).json({ success: true });
}

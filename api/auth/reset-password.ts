import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "../../src/lib/neon/server";
import { requirePost, generateToken } from "../_lib/auth";

interface ResetBody {
  email?: string;
}

const APP_URL = process.env.APP_URL || "https://invisibleexit.com";

async function sendResetEmail(email: string, token: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[reset-password] RESEND_API_KEY not set — skipping email send");
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const link = `${APP_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: "escape@invisibleexit.com",
    to: email,
    subject: "Reset your InvisibleExit password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Click the button below to choose a new password. This link expires in 1 hour.</p>
        <p style="margin: 24px 0;">
          <a href="${link}" style="background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Reset password</a>
        </p>
        <p style="color: #6b7280; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;

  const { email } = (req.body ?? {}) as ResetBody;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const token = generateToken();

  // Only set a reset token if the user exists. Reuse magic_link_token column
  // for password resets too (1h expiry) to avoid schema changes.
  await query(
    `
    UPDATE app_users
    SET magic_link_token = $2,
        magic_link_expires = NOW() + INTERVAL '1 hour',
        updated_at = NOW()
    WHERE email = $1
    `,
    [normalizedEmail, token]
  );

  try {
    await sendResetEmail(normalizedEmail, token);
  } catch (err) {
    console.error("[reset-password] email send failed:", err);
  }

  // Always return success to avoid user enumeration.
  return res.status(200).json({ success: true });
}

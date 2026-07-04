/**
 * /api/newsletter-welcome.ts
 *
 * Vercel serverless route — converted from
 * supabase/functions/newsletter-welcome/index.ts
 *
 * POST { email, source? }
 *  1. Upserts email into subscribers table
 *  2. Sends welcome email via Resend (HTML preserved from original)
 *  3. Creates email_sequence_schedule entry for soap_opera sequence
 *  4. Returns { success: true }
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { query } from "./_lib/db";
import { sendEmail } from "./email-sequence";

const NEWSLETTER_EMAIL_HTML = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0B1D3A;">
  <p style="color: #60A5FA; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-bottom: 24px;">INVISIBLE EXIT</p>

  <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; line-height: 1.3;">You just did something 97% of executives won't.</h1>

  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 20px;">You raised your hand.</p>

  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 20px;">Most people in your position think about building something on the side. They bookmark articles. Save podcast episodes. Tell themselves "next quarter."</p>

  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 20px;">You just opted in. That's the difference between people who escape and people who keep waiting.</p>

  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 20px;">I'm Adrian. I'm a Managing Director by day, and I build invisible recurring revenue on the side. Not theory. Not "someday." Right now, while employed.</p>

  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 24px;">Every week, I'll send you one insight from the trenches:</p>

  <ul style="font-size: 15px; line-height: 2; color: #4A5568; padding-left: 20px; margin-bottom: 28px;">
    <li>What's actually generating MRR (real numbers)</li>
    <li>Stealth strategies that don't jeopardize your career</li>
    <li>Micro-SaaS lessons I learned the hard way</li>
    <li>The mental shifts that make the exit feel inevitable</li>
  </ul>

  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 28px;">No fluff. No motivational quotes. Just what's working for someone who's doing exactly what you're thinking about.</p>

  <div style="background: #F0F4FF; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
    <p style="font-size: 14px; line-height: 1.6; color: #4A5568; margin: 0 0 12px 0;">If you don't want to wait for the first email, you can access all 5 tools right now for $0.97/month. Calculate your runway. See how close you really are.</p>
    <a href="https://invisibleexit.com/?checkout=starter" style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Start for $0.97/month</a>
  </div>

  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 4px;">Talk soon,</p>
  <p style="font-size: 16px; line-height: 1.7; color: #0B1D3A; font-weight: 600; margin-bottom: 0;">Adrian</p>

  <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />
  <p style="font-size: 12px; color: #8A95A8;">You signed up for weekly insights at invisibleexit.com. Unsubscribe anytime by replying "unsubscribe."</p>
</div>`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { email, source } = req.body ?? {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    // ── 1. Upsert into subscribers ──
    await query(
      `INSERT INTO subscribers (email, source)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE
       SET source = excluded.source, created_at = subscribers.created_at`,
      [email, source ?? "newsletter"],
    );

    // ── 2. Send welcome email via Resend ──
    const result = await sendEmail(
      email,
      "You just did something 97% of executives won't",
      NEWSLETTER_EMAIL_HTML,
    );

    if (!result.success) {
      console.error("Newsletter welcome email failed:", result.error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    // ── 3. Create email_sequence_schedule entry for soap_opera ──
    // Day 0 is the welcome email (sent above), so days_sent starts at [0]
    try {
      const ts = new Date().toISOString();
      await query(
        `INSERT INTO email_sequence_schedule (email, sequence, started_at, days_sent)
         VALUES ($1, 'soap_opera', $2, '[0]')`,
        [email, ts],
      );
    } catch (scheduleErr) {
      console.error("Email sequence schedule error:", scheduleErr);
      // Don't fail the whole request if scheduling fails
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Newsletter welcome error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}

/**
 * /api/winback-sequence.ts
 *
 * Vercel serverless route — converted from
 * supabase/functions/winback-sequence/index.ts
 *
 * POST { email }
 *  1. Sends Day 0 win-back email immediately via Resend
 *  2. Creates email_sequence_schedule entry for winback sequence (days 3 & 7)
 *  3. Returns { success: true, sent, scheduled }
 *
 * Also exports triggerWinback() so /api/stripe-webhook can call it directly
 * without an HTTP round-trip to itself.
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { checkRateLimit, getClientIP } from "./_lib/rate-limit";
import { query } from "./_lib/db";
import { sendEmail } from "./email-sequence";

// ═══ WIN-BACK SEQUENCE — 3 emails over 7 days ═══
// (Day 0 sent immediately; Days 3 & 7 scheduled via email_sequence_schedule)
function wrap(day: string, title: string, bodyHtml: string, cta = true) {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#0B1D3A;">
<p style="color:#60A5FA;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:24px;">INVISIBLE EXIT — ${day}</p>
<h1 style="font-size:24px;font-weight:700;margin-bottom:16px;line-height:1.3;">${title}</h1>
${bodyHtml}
${cta ? `<div style="background:#F0F4FF;border-radius:8px;padding:20px;margin-bottom:24px;text-align:center;">
<p style="font-size:14px;line-height:1.6;color:#4A5568;margin:0 0 12px 0;"><strong>5 Tools. $0.97/month. Cancel anytime. 30-day money-back guarantee.</strong></p>
<a href="https://invisibleexit.com/freedom" style="display:inline-block;padding:12px 24px;background:#3B82F6;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Come Back for $0.97/month</a>
</div>` : ""}
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:4px;">Talk soon,</p>
<p style="font-size:16px;font-weight:600;margin-bottom:0;">Adrian</p>
<hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0;"/>
<p style="font-size:12px;color:#8A95A8;">Invisible Exit — Build a side business while employed, invisibly. Unsubscribe anytime.</p>
</div>`;
}

function winbackDay0() {
  return wrap("WIN-BACK · DAY 1", "Can I ask you something?",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I noticed you cancelled your Invisible Exit subscription. I'm not going to try to change your mind — at least not yet.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">But I do want to understand why. If you have 30 seconds, just reply to this email with one of these numbers:</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:8px;"><strong>1.</strong> The tools didn't work for my situation</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:8px;"><strong>2.</strong> I didn't have time to use them</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:8px;"><strong>3.</strong> I already started building without them</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:8px;"><strong>4.</strong> Too expensive for where I am right now</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:8px;"><strong>5.</strong> Something else (just tell me)</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Every reply helps me make this better. And who knows — maybe this isn't the end.</p>`,
    false,
  );
}

function winbackDay3() {
  return wrap("WIN-BACK · DAY 4", "Month 4. I almost hit delete.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">When I first started building on the side, I almost quit too. Month 4. Zero customers. Cursor hovering over "Cancel Subscription."</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">The voice in my head was clear: <em>"You're not a founder. Go back to managing."</em></p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Then I opened my Freedom Number calculation. The math hadn't changed because I had a bad week. $4,000/month MRR = optionality. The math doesn't care about your feelings.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I pivoted. Two weeks later: first customer. $9/month.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If you're in Month 4 right now, I want you to know: the wall is real, but it's not permanent. The system works. It just needs consistency.</p>`,
  );
}

function winbackDay7() {
  return wrap("WIN-BACK · DAY 8", "50% off — but only because I mean it",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">This is my last email. If you've read this far, I know you're not done with this. Something about it stuck.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">So here's what I'll do. Come back at <strong>50% off for 3 months</strong>. That's $0.48/month for the starter plan. Less than a coffee. If you don't have your first customer by the end of those 3 months, we part ways for real.</p>
<div style="background:#FEF3C7;border-radius:8px;padding:20px;margin-bottom:24px;text-align:center;border:1px solid #FDE68A;">
<p style="font-size:18px;color:#92400E;font-weight:700;margin-bottom:8px;">50% Off — 3 Months</p>
<p style="font-size:14px;color:#78350F;margin-bottom:12px;">Use code: <strong>COMEBACK50</strong></p>
<a href="https://invisibleexit.com/freedom" style="display:inline-block;padding:12px 24px;background:#92400E;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Claim 50% Off and Come Back</a>
</div>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">No catch. No auto-renewal trick. Just a genuine "I want you back" offer because the system works better when you're in it.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If not, I understand. I'll stop emailing. But the freedom number concept — that's yours forever. Calculate it. Track it. Build toward it, with or without me.</p>`,
  );
}

const WINBACK_EMAILS = [
  { day: 0, subject: "Wait — before you go, can I ask you one thing?", html: winbackDay0() },
  { day: 3, subject: "The month I almost deleted everything (and what changed my mind)", html: winbackDay3() },
  { day: 7, subject: "I'll make this worth your while (50% off, no catch)", html: winbackDay7() },
];

/**
 * Trigger the win-back sequence for a cancelled subscriber.
 * Sends Day 0 immediately and schedules Days 3 & 7.
 * Exported so /api/stripe-webhook can call it directly (no HTTP round-trip).
 */
export async function triggerWinback(email: string): Promise<{
  success: boolean;
  sent?: string;
  scheduled?: number;
  error?: string;
}> {
  const firstEmail = WINBACK_EMAILS[0];

  // 1. Send Day 0 email immediately
  const sendResult = await sendEmail(email, firstEmail.subject, firstEmail.html);
  if (!sendResult.success) {
    return { success: false, error: sendResult.error ?? "Failed to send win-back email" };
  }

  // 2. Create email_sequence_schedule entry for winback sequence
  //    (Days 3 & 7 — the scheduler will pick them up via sendEmail import)
  const now = new Date().toISOString();
  try {
    await query(
      `INSERT INTO email_sequence_schedule (email, sequence, started_at, days_sent)
       VALUES ($1, 'winback', $2, '{0}')`,
      [email, now],
    );
  } catch (schedErr) {
    console.error("Winback schedule insert failed:", schedErr);
    // Email was already sent — don't fail the whole thing
  }

  // 3. Update subscriber status (best-effort — column may not exist)
  try {
    await query(
      `UPDATE subscribers SET source = 'cancelled_winback' WHERE email = $1`,
      [email],
    );
  } catch (subErr) {
    // Non-fatal
  }

  return {
    success: true,
    sent: firstEmail.subject,
    scheduled: WINBACK_EMAILS.length - 1,
  };
}

// ═══ HANDLER ═══
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Rate limiting: 3/hour per IP ──
  const ip = getClientIP(req);
  const rl = checkRateLimit(`winback:${ip}`, { max: 3, windowMs: 3600000 });
  if (!rl.allowed) {
    return res.status(429).json({ error: "Too many requests" });
  }

  try {
    const { email } = req.body ?? {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const result = await triggerWinback(email);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Win-back function error:", err);
    return res.status(500).json({ error: "Internal error", detail: String(err) });
  }
}

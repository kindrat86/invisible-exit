import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * TRAFFIC SECRETS: Secret #5 + DOTCOM SECRETS: Ch 12 — Win-Back Sequence
 *
 * When a subscriber cancels their subscription, this function:
 *   1. Sends an immediate "we're sorry to see you go" email (Day 0)
 *   2. Schedules a 3-email win-back sequence over 7 days
 *   3. Offers a 50% discount on the 3rd email (the "we want you back" offer)
 *
 * This is Russell's "never let them leave" pattern. Most cancellations
 * are emotional decisions that can be reversed with the right sequence.
 *
 * Trigger: Called from the Stripe webhook when a subscription is cancelled.
 */

// ═══ WIN-BACK SEQUENCE — 3 Emails over 7 Days ═══
const WINBACK_EMAILS = [
  {
    day: 0,
    subject: "Wait — before you go, can I ask you one thing?",
    html: winbackDay0(),
  },
  {
    day: 3,
    subject: "The month I almost deleted everything (and what changed my mind)",
    html: winbackDay3(),
  },
  {
    day: 7,
    subject: "I'll make this worth your while (50% off, no catch)",
    html: winbackDay7(),
  },
];

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
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>5.</strong> Something else (just tell me)</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Every reply helps me make this better. And who knows — maybe this isn't the end.</p>`,
    false
  );
}

function winbackDay3() {
  return wrap("WIN-BACK · DAY 4", "Month 4. I almost hit delete.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">When I first started building on the side, I almost quit too. Month 4. Zero customers. Cursor hovering over "Cancel Subscription."</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">The voice in my head was clear: <em>"You're not a founder. Go back to managing."</em></p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Then I opened my Freedom Number calculation. The math hadn't changed because I had a bad week. $4,000/month MRR = optionality. The math doesn't care about your feelings.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I pivoted. Two weeks later: first customer. $9/month.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If you're in Month 4 right now, I want you to know: the wall is real, but it's not permanent. The system works. It just needs consistency.</p>`);
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
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If not, I understand. I'll stop emailing. But the freedom number concept — that's yours forever. Calculate it. Track it. Build toward it, with or without me.</p>`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    if (!resendKey) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not set" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // 1. Send Day 0 email immediately
    const firstEmail = WINBACK_EMAILS[0];
    const sendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Adrian <escape@invisibleexit.com>",
        to: [email],
        subject: firstEmail.subject,
        html: firstEmail.html,
      }),
    });

    if (!sendRes.ok) {
      const errText = await sendRes.text();
      console.error("Resend error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to send win-back email", detail: errText }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // 2. Schedule Day 3 and Day 7 emails via email_sequence_schedule table
    const now = new Date();
    const schedules = WINBACK_EMAILS.slice(1).map((email_data) => {
      const sendAt = new Date(now.getTime() + email_data.day * 24 * 60 * 60 * 1000);
      return {
        email,
        sequence: "winback",
        email_index: WINBACK_EMAILS.indexOf(email_data),
        scheduled_for: sendAt.toISOString(),
        subject: email_data.subject,
        html_body: email_data.html,
        completed_at: null,
      };
    });

    if (schedules.length > 0) {
      await supabase.from("email_sequence_schedule").insert(schedules);
    }

    // 3. Update subscriber status
    await supabase
      .from("subscribers")
      .update({ status: "cancelled_winback", updated_at: now.toISOString() })
      .eq("email", email);

    return new Response(
      JSON.stringify({
        success: true,
        sent: firstEmail.subject,
        scheduled: schedules.length,
      }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Win-back function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error", detail: String(err) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});

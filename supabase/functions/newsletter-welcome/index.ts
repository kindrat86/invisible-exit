import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
    <a href="https://invisibleexit.com" style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Start for $0.97/month</a>
  </div>

  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 4px;">Talk soon,</p>
  <p style="font-size: 16px; line-height: 1.7; color: #0B1D3A; font-weight: 600; margin-bottom: 0;">Adrian</p>

  <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />
  <p style="font-size: 12px; color: #8A95A8;">You signed up for weekly insights at invisibleexit.com. Unsubscribe anytime by replying "unsubscribe."</p>
</div>`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Adrian <escape@invisibleexit.com>",
        to: [email],
        subject: "You just did something 97% of executives won't",
        html: NEWSLETTER_EMAIL_HTML,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", res.status, body);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Newsletter welcome error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});

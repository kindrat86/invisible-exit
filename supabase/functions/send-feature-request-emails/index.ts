import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function adminNotificationHtml(
  title: string,
  description: string,
  email: string,
  timestamp: string
): string {
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0B1D3A;">
  <p style="color: #60A5FA; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-bottom: 24px;">INVISIBLE EXIT</p>
  <h1 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">New Feature Request</h1>
  <p style="font-size: 15px; line-height: 1.7; color: #4A5568; margin-bottom: 8px;"><strong>Title:</strong> ${title}</p>
  <p style="font-size: 15px; line-height: 1.7; color: #4A5568; margin-bottom: 8px;"><strong>Description:</strong> ${description}</p>
  <p style="font-size: 15px; line-height: 1.7; color: #4A5568; margin-bottom: 8px;"><strong>Submitted by:</strong> ${email}</p>
  <p style="font-size: 15px; line-height: 1.7; color: #4A5568; margin-bottom: 24px;"><strong>Submitted at:</strong> ${timestamp}</p>
  <a href="https://invisibleexit.com/admin/feature-requests" style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Review in Admin Panel</a>
</div>`;
}

function userConfirmationHtml(title: string): string {
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0B1D3A;">
  <p style="color: #60A5FA; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-bottom: 24px;">INVISIBLE EXIT</p>
  <h1 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Your feature request has been received</h1>
  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 20px;">Your feature request has been received and is under review.</p>
  <div style="background: #F0F4FF; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
    <p style="font-size: 15px; line-height: 1.6; color: #4A5568; margin: 0;"><strong>Title:</strong> ${title}</p>
  </div>
  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 20px;">We review all requests weekly and prioritize based on community votes. Once approved, it will appear on the Feature Board where other members can vote on it.</p>
  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 20px;">Thank you for helping shape Invisible Exit.</p>
  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 4px;">Adrian</p>
  <p style="font-size: 14px; color: #8A95A8;">Invisible Exit</p>
</div>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { feature_title, feature_description, user_email } = await req.json();

    if (!feature_title || !feature_description || !user_email) {
      return new Response(
        JSON.stringify({ error: "feature_title, feature_description, and user_email are required" }),
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

    const timestamp = new Date().toUTCString();

    // 1. Send admin notification
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Invisible Exit <updates@invisibleexit.com>",
        to: ["sales@sipiteno.com"],
        subject: `New Feature Request: ${feature_title}`,
        html: adminNotificationHtml(feature_title, feature_description, user_email, timestamp),
      }),
    });

    if (!adminRes.ok) {
      const body = await adminRes.text();
      console.error("Resend admin email error:", adminRes.status, body);
    }

    // 2. Send user confirmation
    const userRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Invisible Exit <updates@invisibleexit.com>",
        to: [user_email],
        reply_to: "escape@invisibleexit.com",
        subject: "Your feature request has been received",
        html: userConfirmationHtml(feature_title),
      }),
    });

    if (!userRes.ok) {
      const body = await userRes.text();
      console.error("Resend user email error:", userRes.status, body);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-feature-request-emails error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});

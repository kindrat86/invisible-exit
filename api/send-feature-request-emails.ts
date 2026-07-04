import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { feature_title, feature_description, user_email } = req.body;

    if (!feature_title || !feature_description || !user_email) {
      return res.status(400).json({
        error:
          "feature_title, feature_description, and user_email are required",
      });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return res.status(500).json({ error: "Email service not configured" });
    }

    const resend = new Resend(resendKey);
    const timestamp = new Date().toUTCString();

    // 1. Send admin notification
    try {
      await resend.emails.send({
        from: "Invisible Exit <escape@invisibleexit.com>",
        to: ["escape@invisibleexit.com"],
        subject: `New Feature Request: ${feature_title}`,
        html: adminNotificationHtml(
          feature_title,
          feature_description,
          user_email,
          timestamp
        ),
      });
    } catch (adminErr) {
      console.error("Resend admin email error:", adminErr);
    }

    // 2. Send user confirmation
    try {
      await resend.emails.send({
        from: "Invisible Exit <escape@invisibleexit.com>",
        to: [user_email],
        replyTo: "escape@invisibleexit.com",
        subject: "Your feature request has been received",
        html: userConfirmationHtml(feature_title),
      });
    } catch (userErr) {
      console.error("Resend user email error:", userErr);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("send-feature-request-emails error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}

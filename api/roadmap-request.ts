import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { queryOne } from "../src/lib/neon/server";

interface JwtPayload {
  sub: string;
  email?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify JWT from Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.replace("Bearer ", "");

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = payload.sub;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, description } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required" });
    }

    // Save to database
    try {
      await queryOne(
        `INSERT INTO roadmap_requests (user_id, title, description)
         VALUES ($1, $2, $3)`,
        [userId, title, description || ""]
      );
    } catch (dbErr) {
      console.error("roadmap-request insert error:", dbErr);
      // Continue — still try to send email
    }

    // Send email notification via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "Invisible Exit <escape@invisibleexit.com>",
          to: ["escape@invisibleexit.com"],
          subject: `Feature Request: ${title}`,
          html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0B1D3A;">
  <p style="color: #60A5FA; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-bottom: 24px;">INVISIBLE EXIT — FEATURE REQUEST</p>
  <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">${title}</h1>
  <p style="font-size: 16px; line-height: 1.7; color: #4A5568; margin-bottom: 24px;">${description || "No description provided."}</p>
  <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
  <p style="font-size: 13px; color: #8A95A8;">Submitted by: ${payload.email ?? "unknown"}</p>
  <p style="font-size: 13px; color: #8A95A8;">User ID: ${userId}</p>
</div>`,
        });
      } catch (emailErr) {
        console.error("Resend error:", emailErr);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Roadmap request error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}

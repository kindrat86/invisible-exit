import type { VercelRequest, VercelResponse } from "./_lib/types";
import Stripe from "stripe";
import { checkRateLimit, getClientIP } from "./_lib/rate-limit";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Rate limiting: 20/min per IP ──
  const ip = getClientIP(req);
  const rl = checkRateLimit(`verify-session:${ip}`, { max: 20, windowMs: 60000 });
  if (!rl.allowed) {
    return res.status(429).json({ error: "Too many requests" });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const { session_id } = req.body;
    // ── Input validation ──
    if (!session_id || typeof session_id !== "string" || session_id.length > 500) {
      return res.status(200).json({ status: "failed" });
    }
    if (!/^cs_(test_)?[a-zA-Z0-9]+$/.test(session_id)) {
      return res.status(200).json({ status: "failed" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return res.status(200).json({
      status: session.payment_status,
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    console.error("verify-session error:", error);
    // Match original: return 200 with failed status on error
    return res.status(200).json({ status: "failed" });
  }
}

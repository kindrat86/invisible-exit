import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { execute, queryOne } from "../src/lib/neon/server";

interface AppUser {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  subscription_status: string;
  subscription_tier: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const { session_id } = req.body;
    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id" });
    }

    // Verify the checkout session with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const email = session.customer_details?.email;
    if (!email) {
      return res
        .status(400)
        .json({ error: "No email found in checkout session" });
    }

    const stripeCustomerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? null;

    // Determine subscription tier from session metadata/line items
    const product = session.metadata?.product ?? "starter";
    const tier = ["starter", "founding", "standard"].includes(product)
      ? product
      : "starter";

    // Upsert user into app_users with the Stripe customer ID.
    // Generate a random temp password (user authenticates via checkout flow).
    const randomPassword = crypto.randomUUID() + crypto.randomUUID();
    const passwordHash = await bcrypt.hash(randomPassword, 10);

    // Generate UUID in JS; SQLite supports UPSERT (excluded.col) but no RETURNING.
    const newUserId = crypto.randomUUID();

    await execute(
      `INSERT INTO app_users (id, email, password_hash, stripe_customer_id, subscription_status, subscription_tier)
       VALUES ($1, $2, $3, $4, 'active', $5)
       ON CONFLICT (email)
       DO UPDATE SET
         stripe_customer_id = COALESCE(excluded.stripe_customer_id, app_users.stripe_customer_id),
         subscription_status = 'active',
         updated_at = datetime('now')`,
      [newUserId, email, passwordHash, stripeCustomerId, tier]
    );

    // SQLite has no RETURNING — fetch the upserted row
    const user = await queryOne<AppUser>(
      `SELECT id, email, stripe_customer_id, subscription_status, subscription_tier
       FROM app_users WHERE email = $1`,
      [email]
    );

    if (!user) {
      return res.status(500).json({ error: "Could not create user record" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email, tier: user.subscription_tier },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        stripe_customer_id: user.stripe_customer_id,
        subscription_status: user.subscription_status,
        subscription_tier: user.subscription_tier,
      },
    });
  } catch (error) {
    console.error("checkout-login error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

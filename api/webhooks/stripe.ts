import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { query, queryOne } from "../../src/lib/neon/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = { api: { bodyParser: false } };

function buffer(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send("Webhook Error");
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.customer || !session.client_reference_id) break;
      const tier = (session.metadata?.tier as string) ?? "starter";
      const customerId = String(session.customer);
      const userId = session.client_reference_id;

      // Update user_subscriptions
      await query(
        `INSERT INTO user_subscriptions (user_id, stripe_customer_id, subscription_status, tier, current_period_end)
         VALUES ($1, $2, 'active', $3, NOW() + INTERVAL '30 days')
         ON CONFLICT (user_id) DO UPDATE SET
           stripe_customer_id = $2, subscription_status = 'active', tier = $3,
           current_period_end = NOW() + INTERVAL '30 days'`,
        [userId, customerId, tier]
      );

      // Update profiles
      await query(
        `UPDATE profiles SET subscription_status = 'active', subscription_tier = $2 WHERE id = $1`,
        [userId, tier]
      );

      // Update app_users
      await query(
        `UPDATE app_users SET subscription_status = 'active', subscription_tier = $2, stripe_customer_id = $3 WHERE id = $1`,
        [userId, tier, customerId]
      );

      // Mark email sequence as converted
      if (session.customer_details?.email) {
        await query(
          `UPDATE email_sequence_schedule SET converted_at = NOW() WHERE email = $1`,
          [session.customer_details.email]
        );
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = String(sub.customer);
      await query(
        `UPDATE user_subscriptions SET subscription_status = $2, current_period_end = $3
         WHERE stripe_customer_id = $1`,
        [customerId, sub.status === "active" ? "active" : sub.status, new Date(Number((sub as Record<string, unknown>).current_period_end) * 1000).toISOString()]
      );
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = String(sub.customer);

      await query(
        `UPDATE user_subscriptions SET subscription_status = 'canceled', tier = 'free' WHERE stripe_customer_id = $1`,
        [customerId]
      );

      // Also update profiles/app_users
      const userRow = await queryOne<{ user_id: string }>(
        `SELECT user_id FROM user_subscriptions WHERE stripe_customer_id = $1`,
        [customerId]
      );
      if (userRow) {
        await query(
          `UPDATE profiles SET subscription_status = 'canceled', subscription_tier = 'starter' WHERE id = $1`,
          [userRow.user_id]
        );
        await query(
          `UPDATE app_users SET subscription_status = 'canceled' WHERE id = $1`,
          [userRow.user_id]
        );

        // Trigger win-back sequence
        const userEmail = await queryOne<{ email: string }>(
          `SELECT email FROM app_users WHERE id = $1`,
          [userRow.user_id]
        );
        if (userEmail) {
          try {
            await fetch("https://invisibleexit.com/api/winback-sequence", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: userEmail.email }),
            });
          } catch (e) {
            console.error("Failed to trigger win-back:", e);
          }
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.customer) {
        await query(
          `UPDATE user_subscriptions SET subscription_status = 'past_due' WHERE stripe_customer_id = $1`,
          [String(invoice.customer)]
        );
      }
      break;
    }

    default:
      break;
  }

  res.status(200).json({ received: true });
}

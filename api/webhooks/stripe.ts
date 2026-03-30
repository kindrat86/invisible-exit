import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function supabaseAdmin() {
    return createClient(
          process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
          process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
      { auth: { persistSession: false } },
        );
}

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

  const sb = supabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            if (!session.customer || !session.client_reference_id) break;
            const tier = (session.metadata?.tier as string) ?? "starter";
            await sb.from("user_subscriptions").upsert({
                      user_id: session.client_reference_id,
                      stripe_customer_id: String(session.customer),
                      subscription_status: "active",
                      tier,
                      current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
            }, { onConflict: "user_id" });
            break;
    }
    case "customer.subscription.updated": {
            const sub = event.data.object as Stripe.Subscription;
            const customerId = String(sub.customer);
            await sb.from("user_subscriptions")
              .update({
                          subscription_status: sub.status === "active" ? "active" : sub.status,
                          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
              })
              .eq("stripe_customer_id", customerId);
            break;
    }
    case "customer.subscription.deleted": {
            const sub = event.data.object as Stripe.Subscription;
            await sb.from("user_subscriptions")
              .update({ subscription_status: "canceled", tier: "free" })
              .eq("stripe_customer_id", String(sub.customer));
            break;
    }
    case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            if (invoice.customer) {
                      await sb.from("user_subscriptions")
                        .update({ subscription_status: "past_due" })
                        .eq("stripe_customer_id", String(invoice.customer));
            }
            break;
    }
    default:
            break;
  }

  res.status(200).json({ received: true });
}

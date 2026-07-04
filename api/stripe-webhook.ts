/**
 * /api/stripe-webhook.ts
 *
 * Vercel serverless route — converted from
 * supabase/functions/stripe-webhook/index.ts
 *
 * Receives Stripe webhook events. Verifies signature, then handles:
 *   - checkout.session.completed → upsert user, send welcome email, magic link
 *   - customer.subscription.updated → update status
 *   - customer.subscription.deleted → mark canceled, trigger winback
 *   - invoice.payment_failed → mark past_due
 *
 * Uses the `stripe` npm package and Neon Postgres (no Supabase).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import crypto from "crypto";
import { query, queryOne } from "../src/lib/neon/server";
import { sendEmail } from "./email-sequence";
import { triggerWinback } from "./winback-sequence";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export const config = { api: { bodyParser: false } };

// ── Welcome email HTML (preserved exactly from original) ──
const WELCOME_EMAIL_HTML = (magicLinkUrl: string) => `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0B1D3A;">
  <p style="color: #60A5FA; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-bottom: 24px;">INVISIBLE EXIT</p>
  <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; line-height: 1.3;">Your FYM Dashboard is ready.</h1>
  <p style="font-size: 16px; line-height: 1.6; color: #4A5568; margin-bottom: 24px;">Welcome to Invisible Exit. You just made the decision most executives only think about.</p>
  <p style="font-size: 16px; line-height: 1.6; color: #4A5568; margin-bottom: 24px;">Click the button below to access your dashboard.</p>
  <a href="${magicLinkUrl}" style="display: inline-block; padding: 14px 28px; background: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin-bottom: 32px;">Access Your Dashboard</a>
  <p style="font-size: 14px; line-height: 1.6; color: #8A95A8; margin-bottom: 8px;">Here is what to do first:</p>
  <ol style="font-size: 14px; line-height: 1.8; color: #4A5568; padding-left: 20px; margin-bottom: 32px;">
    <li>Click the button above</li>
    <li>Enter your runway, burn, and revenue</li>
    <li>See your FYM number</li>
    <li>Share your badge (optional, anonymous, just a number)</li>
  </ol>
  <p style="font-size: 14px; color: #8A95A8;">This link expires in 24 hours. If expired, go to invisibleexit.com/login and use "Sign in with magic link."</p>
  <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />
  <p style="font-size: 12px; color: #8A95A8;">You received this because you subscribed to FYM Dashboard ($0.97/month). Cancel anytime from your Stripe billing portal.</p>
</div>`;

const FOUNDING_WELCOME_EMAIL_HTML = (magicLinkUrl: string) => `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0B1D3A;">
  <p style="color: #60A5FA; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-bottom: 24px;">INVISIBLE EXIT</p>
  <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px; line-height: 1.3;">You're in. Founding Member.</h1>
  <p style="font-size: 18px; line-height: 1.6; color: #3B82F6; font-weight: 600; margin-bottom: 24px;">One of the first 100. This can't be undone.</p>
  <p style="font-size: 16px; line-height: 1.6; color: #4A5568; margin-bottom: 24px;">Most executives talk about building an exit. You just locked in the tools, the access, and the price that the next 10,000 members will wish they had.</p>
  <p style="font-size: 16px; line-height: 1.6; color: #4A5568; margin-bottom: 28px;">Your dashboard is ready. Click below to get started.</p>
  <a href="${magicLinkUrl}" style="display: inline-block; padding: 14px 28px; background: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin-bottom: 36px;">Access Your Founding Dashboard</a>
  <p style="font-size: 15px; font-weight: 600; color: #0B1D3A; margin-bottom: 16px;">Here is what you just unlocked:</p>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0B1D3A;">Price Locked at $17.99/mo For Life</p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #8A95A8;">Public price goes to $97.99/mo. You save $960/year.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0B1D3A;">Shape What Gets Built Next</p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #8A95A8;">Vote on the roadmap. Your feature requests go to the top of the queue.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0B1D3A;">See Everything First</p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #8A95A8;">Every new tool, integration, and feature weeks before anyone else.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0B1D3A;">Your Name on the Founding Wall</p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #8A95A8;">Permanently listed as an original member. Cannot be purchased later.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0B1D3A;">Unlimited Access to Every Tool</p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #8A95A8;">No caps on scenarios, audits, automations, or content calendars. Ever.</p>
      </td>
    </tr>
  </table>
  <p style="font-size: 14px; line-height: 1.6; color: #8A95A8; margin-bottom: 8px;">Here is what to do first:</p>
  <ol style="font-size: 14px; line-height: 1.8; color: #4A5568; padding-left: 20px; margin-bottom: 28px;">
    <li>Click the button above</li>
    <li>Enter your runway, burn, and revenue</li>
    <li>See your FYM number</li>
    <li>Explore your unlimited tools</li>
  </ol>
  <p style="font-size: 13px; color: #8A95A8; margin-bottom: 8px; padding: 12px 16px; background: #F7FAFC; border-radius: 6px;">30-day money-back guarantee. Not for you? Email the word "refund" and you're out. No questions.</p>
  <p style="font-size: 14px; color: #8A95A8;">This link expires in 24 hours. If expired, go to invisibleexit.com/login and use "Sign in with magic link."</p>
  <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />
  <p style="font-size: 12px; color: #8A95A8;">You received this because you joined as a Founding Member ($17.99/month, locked for life). Cancel anytime from your Stripe billing portal.</p>
</div>`;

// ── Helpers ──

async function sendWelcomeEmail(email: string, magicLinkUrl: string, tier: string) {
  const isFounding = tier === "founding";
  const subject = isFounding ? "You're a Founding Member" : "Your FYM Dashboard is ready";
  const html = isFounding
    ? FOUNDING_WELCOME_EMAIL_HTML(magicLinkUrl)
    : WELCOME_EMAIL_HTML(magicLinkUrl);
  const result = await sendEmail(email, subject, html);
  if (!result.success) console.error("Welcome email failed:", result.error);
}

function generateMagicLinkToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const stripeCustomerId = session.customer as string;
  if (!email) {
    console.error("No email in checkout session");
    return;
  }

  // Map product metadata to tier
  const productToTier: Record<string, string> = {
    starter: "starter",
    founding: "founding",
    standard: "standard",
    fym_dashboard: "starter",
    founding_member: "founding",
  };
  const tier = productToTier[session.metadata?.product ?? ""] ?? "starter";

  // ── Upsert into app_users ──
  const existingUser = await queryOne<{ id: string }>(
    `SELECT id FROM app_users WHERE email = $1`,
    [email],
  );

  let userId: string;
  const now = new Date().toISOString();

  if (existingUser) {
    userId = existingUser.id;
    await query(
      `UPDATE app_users
       SET stripe_customer_id = $1, subscription_status = 'active',
           subscription_tier = $2, updated_at = $3
       WHERE id = $4`,
      [stripeCustomerId, tier, now, userId],
    );
  } else {
    const newUser = await queryOne<{ id: string }>(
      `INSERT INTO app_users (email, stripe_customer_id, subscription_status, subscription_tier)
       VALUES ($1, $2, 'active', $3)
       RETURNING id`,
      [email, stripeCustomerId, tier],
    );
    userId = newUser?.id ?? crypto.randomUUID();
  }

  // ── Upsert profile (mirrors app_users) ──
  await query(
    `INSERT INTO profiles (id, email, stripe_customer_id, subscription_status, subscription_tier)
     VALUES ($1, $2, $3, 'active', $4)
     ON CONFLICT (id) DO UPDATE
     SET email = EXCLUDED.email,
         stripe_customer_id = EXCLUDED.stripe_customer_id,
         subscription_status = 'active',
         subscription_tier = EXCLUDED.subscription_tier`,
    [userId, email, stripeCustomerId, tier],
  );

  // ── Generate magic link token ──
  const token = generateMagicLinkToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h
  await query(
    `UPDATE app_users SET magic_link_token = $1, magic_link_expires = $2 WHERE id = $3`,
    [token, expiresAt, userId],
  );

  const siteUrl = process.env.SITE_URL ?? "https://invisibleexit.com";
  const magicLinkUrl = `${siteUrl}/login?token=${token}`;

  // ── Send welcome email ──
  await sendWelcomeEmail(email, magicLinkUrl, tier);

  // ── Mark the subscriber's soap_opera / seinfeld sequence as converted ──
  try {
    await query(
      `UPDATE email_sequence_schedule
       SET converted_at = $1, updated_at = $1
       WHERE email = $2 AND converted_at IS NULL`,
      [now, email],
    );
  } catch (convErr) {
    console.error("Mark converted failed:", convErr);
  }
}

async function updateSubscriptionStatus(stripeCustomerId: string, status: string) {
  try {
    await query(
      `UPDATE profiles SET subscription_status = $1 WHERE stripe_customer_id = $2`,
      [status, stripeCustomerId],
    );
    await query(
      `UPDATE app_users SET subscription_status = $1 WHERE stripe_customer_id = $2`,
      [status, stripeCustomerId],
    );
  } catch (err) {
    console.error("Subscription status update error:", err);
  }
}

async function buffer(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// ── Handler ──
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message ?? err);
    return res.status(400).send("Webhook Error");
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const statusMap: Record<string, string> = {
          active: "active",
          past_due: "past_due",
          canceled: "canceled",
          unpaid: "past_due",
          trialing: "trialing",
        };
        await updateSubscriptionStatus(
          sub.customer as string,
          statusMap[sub.status] ?? "inactive",
        );
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await updateSubscriptionStatus(sub.customer as string, "canceled");

        // ── Trigger win-back sequence ──
        try {
          const customer = await stripe.customers.retrieve(sub.customer as string);
          if (customer && !("deleted" in customer) && customer.email) {
            await triggerWinback(customer.email);
            console.log(`Win-back sequence triggered for ${customer.email}`);
          }
        } catch (winbackErr) {
          console.error("Win-back trigger failed:", winbackErr);
          // Don't fail the webhook if win-back fails
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await updateSubscriptionStatus(invoice.customer as string, "past_due");
        break;
      }
      default:
        break;
    }
  } catch (err: any) {
    console.error(`Error handling ${event.type}:`, err);
    return res.status(500).json({ error: "Webhook handler error" });
  }

  return res.status(200).json({ received: true });
}

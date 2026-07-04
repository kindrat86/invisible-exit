import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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

async function sendWelcomeEmail(email: string, magicLinkUrl: string, tier: string) {
  const isFounding = tier === "founding";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Adrian <escape@invisibleexit.com>",
      to: [email],
      subject: isFounding ? "You're a Founding Member" : "Your FYM Dashboard is ready",
      html: isFounding ? FOUNDING_WELCOME_EMAIL_HTML(magicLinkUrl) : WELCOME_EMAIL_HTML(magicLinkUrl),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("Resend error:", res.status, body);
  }
}

async function findUserByEmail(email: string) {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  return data.users.find((u) => u.email === email);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const stripeCustomerId = session.customer as string;

  if (!email) {
    console.error("No email in checkout session");
    return;
  }

  // Create or find user
  let userId: string;
  const { data: createData, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { stripe_customer_id: stripeCustomerId },
    });

  if (createError) {
    if (
      createError.message.includes("already been registered") ||
      createError.message.includes("already exists")
    ) {
      const existing = await findUserByEmail(email);
      if (!existing) throw new Error(`User with email ${email} not found`);
      userId = existing.id;
    } else {
      throw createError;
    }
  } else {
    userId = createData.user.id;
  }

  // Upsert profile — map product metadata to subscription tier
  const productToTier: Record<string, string> = {
    starter: "starter",
    founding: "founding",
    standard: "standard",
    // Legacy mappings
    fym_dashboard: "starter",
    founding_member: "founding",
  };
  const tier = productToTier[session.metadata?.product ?? ""] ?? "starter";
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email,
      stripe_customer_id: stripeCustomerId,
      subscription_status: "active",
      subscription_tier: tier,
    },
    { onConflict: "id" }
  );
  if (profileError) console.error("Profile upsert error:", profileError);

  // Generate magic link and send welcome email
  const siteUrl = Deno.env.get("SITE_URL") ?? "https://invisibleexit.com";
  const { data: linkData, error: linkError } =
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${siteUrl}/dashboard` },
    });

  if (linkError) {
    console.error("Magic link error:", linkError);
    return;
  }

  const magicLinkUrl = linkData.properties.action_link;
  await sendWelcomeEmail(email, magicLinkUrl, tier);
}

async function updateSubscriptionStatus(
  stripeCustomerId: string,
  status: string
) {
  const { error } = await supabase
    .from("profiles")
    .update({ subscription_status: status })
    .eq("stripe_customer_id", stripeCustomerId);
  if (error) console.error("Subscription status update error:", error);
}

serve(async (req) => {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!;

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
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
          statusMap[sub.status] ?? "inactive"
        );
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await updateSubscriptionStatus(sub.customer as string, "inactive");

        // TRIGGER WIN-BACK SEQUENCE (Dotcom Secrets Ch 12)
        // The winback-sequence function sends 3 emails over 7 days:
        // Day 0: "Why did you leave?" survey
        // Day 3: "Month 4, I almost quit too" story
        // Day 7: 50% off comeback offer
        try {
          // Get the customer's email from Stripe
          const customer = await stripe.customers.retrieve(sub.customer as string);
          if (customer && !("deleted" in customer) && customer.email) {
            await fetch(
              `${Deno.env.get("SUPABASE_URL")}/functions/v1/winback-sequence`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                },
                body: JSON.stringify({ email: customer.email }),
              }
            );
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
        await updateSubscriptionStatus(
          invoice.customer as string,
          "past_due"
        );
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await updateSubscriptionStatus(invoice.customer as string, "active");
        break;
      }
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    return new Response(JSON.stringify({ error: "Webhook handler error" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});

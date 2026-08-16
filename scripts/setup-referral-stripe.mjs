// Setup: inspect webhook endpoints + create referral reward coupons.
// Prints NO secrets, only ids/urls/config.
import { readFileSync } from "fs";
import Stripe from "stripe";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (m) env[m[1]] = m[2];
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// 1. Webhook endpoints
const eps = await stripe.webhookEndpoints.list({ limit: 20 });
for (const ep of eps.data) {
  console.log("WEBHOOK:", ep.url, "|", ep.status, "|", ep.enabled_events.slice(0, 6).join(","));
}

// 2. Coupons, idempotent create by fixed id
async function ensureCoupon(id, params) {
  try {
    const c = await stripe.coupons.retrieve(id);
    console.log("COUPON exists:", c.id, c.percent_off + "%", c.duration);
    return c;
  } catch {
    const c = await stripe.coupons.create({ id, ...params });
    console.log("COUPON created:", c.id, c.percent_off + "%", c.duration);
    return c;
  }
}

await ensureCoupon("REFERRAL_FREE_MONTH", {
  percent_off: 100,
  duration: "repeating",
  duration_in_months: 1,
  name: "Referral reward, 1 month free",
});

await ensureCoupon("REFERRAL_FREE_LIFE", {
  percent_off: 100,
  duration: "forever",
  name: "Referral reward, free for life (3 referrals)",
});

console.log("DONE");

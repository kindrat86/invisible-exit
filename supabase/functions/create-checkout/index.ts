import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const ALLOWED_ORIGINS = [
  "https://invisibleexit.com",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    const { priceId, cancelPath } = await req.json();
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://invisibleexit.com";

    // Whitelist allowed price IDs to prevent injection
    const STRIPE_FYM_PRICE_ID = Deno.env.get("STRIPE_FYM_PRICE_ID")!;
    const STRIPE_FOUNDING_PRICE_ID = Deno.env.get("STRIPE_FOUNDING_PRICE_ID")!;
    const ALLOWED_PRICES = new Set([
      "founding",
      STRIPE_FYM_PRICE_ID,
      STRIPE_FOUNDING_PRICE_ID,
    ]);

    if (priceId !== undefined && priceId !== null && !ALLOWED_PRICES.has(priceId)) {
      return new Response(JSON.stringify({ error: "Invalid price" }), {
        status: 400,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const isFounding = priceId === "founding";
    const finalPriceId = isFounding
      ? STRIPE_FOUNDING_PRICE_ID
      : priceId || STRIPE_FYM_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: finalPriceId, quantity: 1 }],
      success_url: isFounding
        ? `${siteUrl}/fym/oto/founding?session_id={CHECKOUT_SESSION_ID}`
        : `${siteUrl}/fym/oto/founding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelPath ? `${siteUrl}${cancelPath}` : (isFounding ? `${siteUrl}/fym/oto/founding` : `${siteUrl}/fym`),
      allow_promotion_codes: false,
      metadata: { product: isFounding ? "founding_member" : "fym_dashboard" },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("create-checkout error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred. Please try again." }), {
      status: 400,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});

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

    const { priceId } = await req.json();
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://invisibleexit.com";
    const finalPriceId = priceId || Deno.env.get("STRIPE_FYM_PRICE_ID")!;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: finalPriceId, quantity: 1 }],
      success_url: `${siteUrl}/oto/founding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/fym`,
      allow_promotion_codes: false,
      metadata: { product: "fym_dashboard" },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("create-checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});

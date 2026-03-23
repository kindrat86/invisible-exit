import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const ALLOWED_ORIGINS = [
  "https://invisibleexit.com",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) ||
    /^https:\/\/.*\.vercel\.app$/.test(origin);
  const allowedOrigin = isAllowed ? origin : ALLOWED_ORIGINS[0];
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

    const { tier, returnUrl, cancelUrl } = await req.json();
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://invisibleexit.com";

    // Map tier names to Stripe price IDs
    const TIER_MAP: Record<string, { priceId: string; product: string }> = {
      starter: {
        priceId: Deno.env.get("STRIPE_STARTER_PRICE_ID")!,
        product: "starter",
      },
      founding: {
        priceId: Deno.env.get("STRIPE_FOUNDING_PRICE_ID")!,
        product: "founding",
      },
      standard: {
        priceId: Deno.env.get("STRIPE_STANDARD_PRICE_ID")!,
        product: "standard",
      },
    };

    const tierConfig = TIER_MAP[tier];
    if (!tierConfig) {
      return new Response(JSON.stringify({ error: "Invalid tier" }), {
        status: 400,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const successUrl = returnUrl
      ? `${returnUrl.startsWith("http") ? "" : siteUrl}${returnUrl}?session_id={CHECKOUT_SESSION_ID}`
      : `${siteUrl}/oto/founding?session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: tierConfig.priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl
        ? `${cancelUrl.startsWith("http") ? "" : siteUrl}${cancelUrl}`
        : `${siteUrl}/`,
      allow_promotion_codes: false,
      metadata: { product: tierConfig.product },
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

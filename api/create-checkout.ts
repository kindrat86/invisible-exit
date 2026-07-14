import type { VercelRequest, VercelResponse } from "./_lib/types";
import Stripe from "stripe";

interface TierConfig {
  priceId: string;
  product: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const { tier, returnUrl, cancelUrl } = req.body;
    const siteUrl =
      process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? "https://invisibleexit.com";

    // Map tier names to Stripe price IDs
    // Subscriptions: starter, founding, standard
    // One-time: tripwire, workshop, book
    // Combo: tripwire_bump = starter sub ($0.97/mo) + tripwire one-time ($7)
    const SUBSCRIPTION_TIERS: Record<string, TierConfig> = {
      starter: {
        priceId: process.env.STRIPE_STARTER_PRICE_ID!,
        product: "starter",
      },
      founding: {
        priceId: process.env.STRIPE_FOUNDING_PRICE_ID!,
        product: "founding",
      },
      standard: {
        priceId: process.env.STRIPE_STANDARD_PRICE_ID!,
        product: "standard",
      },
    };

    const ONETIME_TIERS: Record<string, TierConfig> = {
      tripwire: {
        priceId:
          process.env.STRIPE_TRIPWIRE_PRICE_ID ?? "price_tripwire_stealth_blueprint",
        product: "tripwire",
      },
      workshop: {
        priceId:
          process.env.STRIPE_WORKSHOP_PRICE_ID ?? "price_weekend_workshop",
        product: "weekend_workshop",
      },
      book: {
        priceId: process.env.STRIPE_BOOK_PRICE_ID ?? "price_free_book_shipping",
        product: "book",
      },
      book_audiobook: {
        priceId:
          process.env.STRIPE_BOOK_AUDIOBOOK_PRICE_ID ?? "price_book_audiobook",
        product: "book_audiobook",
      },
    };

    // tripwire_bump = combo: starter subscription + tripwire one-time
    // This creates a checkout session with BOTH line items (Ch 14 Order Bump pattern)
    // First: resolve customer email (same logic as below)
    let customerEmail: string | undefined;
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const jwt = (await import("jsonwebtoken")).default;
        const token = authHeader.replace("Bearer ", "");
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
          email?: string;
        };
        customerEmail = payload.email;
      } catch {
        // Ignore auth failures — allow guest checkout
      }
    }

    // ── Order Bump (DotCom Secrets Ch 14): Always include the tripwire
    //    as a Stripe-side line item when subscribing to Starter.
    //    The user sees BOTH items in Stripe Checkout — no page-level toggle.
    //    This avoids the conversion-killing price change on the CTA button
    //    while still getting the $7 bump on every new subscription.
    const starterPrice = process.env.STRIPE_STARTER_PRICE_ID!;
    const tripwirePrice = process.env.STRIPE_TRIPWIRE_PRICE_ID!;

    if (tier === "starter" || tier === "tripwire_bump") {
      const bumpSuccessUrl = returnUrl
        ? `${returnUrl.startsWith("http") ? "" : siteUrl}${returnUrl}?session_id={CHECKOUT_SESSION_ID}`
        : `${siteUrl}/oto/founding?session_id={CHECKOUT_SESSION_ID}`;

      const bumpSessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "subscription",
        line_items: [
          { price: starterPrice, quantity: 1 },
          { price: tripwirePrice, quantity: 1 },
        ],
        success_url: bumpSuccessUrl,
        cancel_url: cancelUrl
          ? `${cancelUrl.startsWith("http") ? "" : siteUrl}${cancelUrl}`
          : `${siteUrl}/`,
        allow_promotion_codes: false,
        metadata: { product: "starter", order_bump: "tripwire" },
      };

      if (customerEmail) {
        bumpSessionParams.customer_email = customerEmail;
      }

      const session = await stripe.checkout.sessions.create(bumpSessionParams);
      return res.status(200).json({ url: session.url });
    }

    const isOneTime = tier in ONETIME_TIERS;
    const tierConfig = isOneTime
      ? ONETIME_TIERS[tier as keyof typeof ONETIME_TIERS]
      : SUBSCRIPTION_TIERS[tier];

    if (!tierConfig) {
      return res.status(400).json({ error: "Invalid tier" });
    }

    const successUrl = returnUrl
      ? `${returnUrl.startsWith("http") ? "" : siteUrl}${returnUrl}?session_id={CHECKOUT_SESSION_ID}`
      : `${siteUrl}/oto/founding?session_id={CHECKOUT_SESSION_ID}`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isOneTime ? "payment" : "subscription",
      line_items: [{ price: tierConfig.priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl
        ? `${cancelUrl.startsWith("http") ? "" : siteUrl}${cancelUrl}`
        : `${siteUrl}/`,
      allow_promotion_codes: false,
      metadata: { product: tierConfig.product },
    };

    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("create-checkout error:", error);
    return res.status(400).json({
      error: "An unexpected error occurred. Please try again.",
    });
  }
}

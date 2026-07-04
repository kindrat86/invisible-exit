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
    // One-time: tripwire, tripwire_bump, workshop, book, book_audiobook
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
      tripwire_bump: {
        priceId: process.env.STRIPE_TRIPWIRE_BUMP_PRICE_ID ?? "price_tripwire_bump",
        product: "tripwire_bump",
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

    // If the user is authenticated, reuse/create a Stripe customer by email
    let customerEmail: string | undefined;
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      // Optional: decode email from JWT for customer reuse. We do lightweight
      // customer creation here only if a verified email is available.
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

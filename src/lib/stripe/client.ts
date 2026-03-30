/**
 * Server-side Stripe SDK instance.
 * Used in Vercel serverless API routes (api/webhooks/stripe.ts).
 * Requires STRIPE_SECRET_KEY env var.
 */
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
    typescript: true,
});

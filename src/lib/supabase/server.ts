import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Server-side Supabase client for use in Vercel serverless API routes.
 * Uses the service role key for elevated access (e.g., Stripe webhooks).
 * NEVER expose this client to the browser.
 */
export function createServerClient() {
    const url = process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!url || !serviceKey) {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL env vars");
  }

  return createClient<Database>(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
  });
}

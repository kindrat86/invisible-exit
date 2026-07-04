import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
 * Browser Supabase client (env-based config).
 * Reads VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY from env at build time.
 * For backward compat the existing client at @/integrations/supabase/client
 * continues to work; this module lets you switch to env-based config.
 */
export const supabaseBrowser = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
  {
        auth: {
                storage: typeof window !== "undefined" ? localStorage : undefined,
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
        },
  },
  );

/**
 * Shared auth types (replaces @supabase/supabase-js Session/User types)
 */

export interface Session {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user: User | null;
}

export interface User {
  id: string;
  email: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  aud?: string;
  created_at?: string;
}

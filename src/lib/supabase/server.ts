// ═══════════════════════════════════════════════════════════════
// DEPRECATED: Server-side Supabase client.
// The backend now uses Neon Postgres via /api/ routes with pg Pool.
// This file exists only to prevent import errors during the transition.
// ═══════════════════════════════════════════════════════════════

export function createServerClient() {
  throw new Error(
    "createServerClient is deprecated. All server-side DB operations now go through /api/ routes."
  );
}

/**
 * Turso (libSQL/SQLite) server-side connection.
 * Lives inside /api/_lib/ to avoid crossing the src/ boundary
 * (which breaks Vercel's serverless bundler).
 */
// IMPORTANT: use the pure-JS "/web" client, not the default node entry.
// The node entry hard-requires the native `libsql` binary at import time,
// and prebuilt deploys from macOS don't bundle the linux binary — every
// function importing this module then dies with FUNCTION_INVOCATION_FAILED.
// Turso remote URLs (libsql://, https://) work fully over HTTP.
import { createClient, type Client } from "@libsql/client/web";

// libsql:// would use WebSockets; https:// (hrana-over-HTTP) is the
// recommended transport inside serverless functions.
const url = (process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "")
  .replace(/^libsql:\/\//, "https://");
const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || "";

if (!url) {
  console.warn("[turso] DATABASE_URL not set — DB operations will fail");
}

// Lazy so a missing env var fails the request, not the module load.
let _client: Client | null = null;
function getClient(): Client {
  if (!_client) _client = createClient({ url, authToken });
  return _client;
}

export const client = new Proxy({} as Client, {
  get(_t, prop) {
    const c = getClient();
    const v = c[prop as keyof Client];
    return typeof v === "function" ? (v as (...a: unknown[]) => unknown).bind(c) : v;
  },
});

export async function query<T = Record<string, unknown>>(
  sql: string,
  args?: unknown[] | Record<string, unknown>
): Promise<T[]> {
  const result = await client.execute({ sql, args: args as never });
  return result.rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  args?: unknown[] | Record<string, unknown>
): Promise<T | null> {
  const rows = await query<T>(sql, args);
  return rows[0] ?? null;
}

export async function execute(
  sql: string,
  args?: unknown[] | Record<string, unknown>
): Promise<{ rowsAffected: number; lastInsertRowid: bigint | string | null | undefined }> {
  const result = await client.execute({ sql, args: args as never });
  return {
    rowsAffected: result.rowsAffected,
    lastInsertRowid: result.lastInsertRowid,
  };
}

export async function batch(
  statements: Array<{ sql: string; args?: unknown[] | Record<string, unknown> }>
): Promise<void> {
  await client.batch(statements as never);
}

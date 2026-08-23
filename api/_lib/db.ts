/**
 * Turso (libSQL/SQLite) server-side connection.
 * Lives inside /api/_lib/ to avoid crossing the src/ boundary
 * (which breaks Vercel's serverless bundler).
 *
 * Uses the "web" (HTTP-only) client build, not the default "@libsql/client"
 * import: the default build's index.js does `require(`@libsql/${target}`)`
 * with the target computed at runtime, which Vercel's static file-tracer
 * can't follow, it bundled the wrong (or no) native binary across several
 * recent deploys, 500ing every route that touches the DB. The web client
 * is pure HTTP with zero native bindings, which is all this file needs
 * (only .execute()/.batch() are called, no embedded-replica/.sync()).
 */
import type { Client } from "@libsql/client" with { "resolution-mode": "import" };

const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "";
const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || "";

if (!url) {
  console.warn("[turso] DATABASE_URL not set, DB operations will fail");
}

// Lazy so a missing env var fails the request, not the module load. The web
// package is ESM-only under Node's node16 resolver, while Vercel treats this
// file as CommonJS, so keep the import dynamic and memoize the resulting
// client. The literal specifier also lets Vercel's file tracer bundle it.
let _clientPromise: Promise<Client> | null = null;
function getClient(): Promise<Client> {
  if (!_clientPromise) {
    _clientPromise = import("@libsql/client/web").then(({ createClient }) =>
      createClient({ url, authToken }),
    );
  }
  return _clientPromise;
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  args?: unknown[] | Record<string, unknown>
): Promise<T[]> {
  const client = await getClient();
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
  const client = await getClient();
  const result = await client.execute({ sql, args: args as never });
  return {
    rowsAffected: result.rowsAffected,
    lastInsertRowid: result.lastInsertRowid,
  };
}

export async function batch(
  statements: Array<{ sql: string; args?: unknown[] | Record<string, unknown> }>
): Promise<void> {
  const client = await getClient();
  await client.batch(statements as never);
}

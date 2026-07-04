/**
 * Turso (libSQL/SQLite) server-side connection.
 * Lives inside /api/_lib/ to avoid crossing the src/ boundary
 * (which breaks Vercel's serverless bundler).
 */
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "";
const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || "";

if (!url) {
  console.warn("[turso] DATABASE_URL not set — DB operations will fail");
}

export const client = createClient({ url, authToken });

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

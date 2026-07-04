/**
 * Turso (libSQL/SQLite) server-side connection.
 * Used by all /api/ routes. Replaces the Supabase/Postgres layer.
 *
 * Turso is SQLite at the edge — free tier includes 500 databases.
 * Each project gets its own database, managed via `turso db` CLI.
 */
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "";
const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || "";

if (!url) {
  console.warn("[turso] DATABASE_URL not set — DB operations will fail");
}

export const client = createClient({ url, authToken });

/**
 * Execute a query with named/positional parameters
 * Returns array of rows (objects)
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  args?: unknown[] | Record<string, unknown>
): Promise<T[]> {
  const result = await client.execute({ sql, args: args as never });
  return result.rows as T[];
}

/**
 * Execute a query returning a single row (or null)
 */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  args?: unknown[] | Record<string, unknown>
): Promise<T | null> {
  const rows = await query<T>(sql, args);
  return rows[0] ?? null;
}

/**
 * Execute a statement (INSERT/UPDATE/DELETE) and return metadata
 */
export async function execute(
  sql: string,
  args?: unknown[] | Record<string, unknown>
): Promise<{ rowsAffected: number; lastInsertRowid: bigint | null }> {
  const result = await client.execute({ sql, args: args as never });
  return {
    rowsAffected: result.rowsAffected,
    lastInsertRowid: result.lastInsertRowid,
  };
}

/**
 * Execute multiple statements in a batch (transaction)
 */
export async function batch(
  statements: Array<{ sql: string; args?: unknown[] }>
): Promise<void> {
  await client.batch(statements);
}

// Backward-compat aliases for code that imported from the pg version
export const pool = client;

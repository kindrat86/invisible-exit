/**
 * Server-side Neon Postgres connection pool.
 * Used by all /api/ routes.
 */
import { Pool } from "pg";

// Use pooled connection string for serverless (pgbouncer)
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

if (!connectionString) {
  console.warn("[neon] DATABASE_URL not set — DB operations will fail");
}

export const pool = new Pool({
  connectionString,
  max: 3, // Vercel serverless: small pool per instance
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: connectionString.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

/**
 * Execute a query with error handling
 */
export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

/**
 * Execute a query returning a single row
 */
export async function queryOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

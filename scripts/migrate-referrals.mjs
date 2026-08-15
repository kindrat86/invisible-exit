// One-off migration: referral_conversions table for the Referral Engine.
// Runs against the production Turso DB using creds from .env.local.
import { createClient } from "@libsql/client/web";
import { readFileSync } from "fs";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (m) env[m[1]] = m[2];
}

const url = env.DATABASE_URL.replace("libsql://", "https://");
const client = createClient({ url, authToken: env.DATABASE_AUTH_TOKEN });

await client.batch([
  `CREATE TABLE IF NOT EXISTS referral_conversions (
    id TEXT PRIMARY KEY,
    referrer_code TEXT NOT NULL,
    referrer_email TEXT NOT NULL,
    referred_email TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT,
    tier TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_ref_conv_code ON referral_conversions(referrer_code)`,
  `CREATE INDEX IF NOT EXISTS idx_ref_conv_referrer ON referral_conversions(referrer_email)`,
]);

const t = await client.execute(
  `SELECT name FROM sqlite_master WHERE type='table' AND name IN ('referrals','referral_conversions')`
);
console.log("tables:", t.rows.map((r) => r.name).join(", "));
const c = await client.execute(`SELECT COUNT(*) AS n FROM referral_conversions`);
console.log("referral_conversions rows:", c.rows[0].n);

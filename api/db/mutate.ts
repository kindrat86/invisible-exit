import type { VercelRequest, VercelResponse } from "@vercel/node";
import { pool, query } from "../../src/lib/neon/server";
import { requirePost, verifyBearer } from "../_lib/auth";

const ALLOWED_TABLES = new Set([
  "subscribers",
  "profiles",
  "fym_entries",
  "fym_badges",
  "fym_scenarios",
  "invisibility_scores",
  "roadmap_features",
  "roadmap_votes",
  "roadmap_requests",
  "feature_requests",
  "feature_votes",
  "referrals",
  "user_subscriptions",
  "email_sequence_schedule",
]);

const USER_SCOPED_TABLES = new Set([
  "profiles",
  "fym_entries",
  "fym_badges",
  "fym_scenarios",
  "invisibility_scores",
  "roadmap_votes",
  "roadmap_requests",
  "feature_votes",
  "user_subscriptions",
]);

const IDENT_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

interface MutateBody {
  action: "insert" | "update" | "upsert" | "delete";
  table?: string;
  data?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  onConflict?: string; // single column name for ON CONFLICT (col)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;

  const body = (req.body ?? {}) as MutateBody;
  const { action, table } = body;

  if (!table || !ALLOWED_TABLES.has(table)) {
    return res.status(400).json({ error: "Invalid or disallowed table" });
  }

  const claims = verifyBearer(req);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const params: unknown[] = [];
    let sql = "";

    switch (action) {
      case "insert": {
        const data = body.data ?? {};
        const cols = Object.keys(data).filter((k) => IDENT_RE.test(k));
        if (cols.length === 0) {
          return res.status(400).json({ error: "No valid data columns" });
        }
        if (USER_SCOPED_TABLES.has(table) && claims && !("user_id" in data)) {
          cols.unshift("user_id");
          data.user_id = claims.sub;
        }
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
        cols.forEach((c) => params.push(data[c]));
        sql = `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders}) RETURNING *`;
        break;
      }

      case "upsert": {
        const data = body.data ?? {};
        const cols = Object.keys(data).filter((k) => IDENT_RE.test(k));
        if (cols.length === 0) {
          return res.status(400).json({ error: "No valid data columns" });
        }
        if (USER_SCOPED_TABLES.has(table) && claims && !("user_id" in data)) {
          cols.unshift("user_id");
          data.user_id = claims.sub;
        }
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
        cols.forEach((c) => params.push(data[c]));

        const conflictCol = body.onConflict && IDENT_RE.test(body.onConflict) ? body.onConflict : "id";
        const updateCols = cols.filter((c) => c !== conflictCol);
        const updateClause =
          updateCols.length > 0
            ? `UPDATE SET ${updateCols.map((c) => `"${c}" = EXCLUDED."${c}"`).join(", ")}`
            : "DO NOTHING";
        sql = `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders}) ON CONFLICT ("${conflictCol}") DO ${updateClause} RETURNING *`;
        break;
      }

      case "update": {
        const data = body.data ?? {};
        const filters = body.filters ?? {};
        const cols = Object.keys(data).filter((k) => IDENT_RE.test(k));
        const filterCols = Object.keys(filters).filter((k) => IDENT_RE.test(k));
        if (cols.length === 0) {
          return res.status(400).json({ error: "No valid data columns to update" });
        }
        const setParts = cols.map((c) => {
          params.push(data[c]);
          return `"${c}" = $${params.length}`;
        });
        const whereParts: string[] = [];
        if (USER_SCOPED_TABLES.has(table) && claims) {
          params.push(claims.sub);
          whereParts.push(`"user_id" = $${params.length}`);
        }
        filterCols.forEach((c) => {
          params.push(filters[c]);
          whereParts.push(`"${c}" = $${params.length}`);
        });
        const whereClause = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
        if (!whereClause) {
          await client.query("ROLLBACK");
          return res.status(400).json({ error: "Update requires at least one filter" });
        }
        sql = `UPDATE "${table}" SET ${setParts.join(", ")} ${whereClause} RETURNING *`;
        break;
      }

      case "delete": {
        const filters = body.filters ?? {};
        const filterCols = Object.keys(filters).filter((k) => IDENT_RE.test(k));
        const whereParts: string[] = [];
        if (USER_SCOPED_TABLES.has(table) && claims) {
          params.push(claims.sub);
          whereParts.push(`"user_id" = $${params.length}`);
        }
        filterCols.forEach((c) => {
          params.push(filters[c]);
          whereParts.push(`"${c}" = $${params.length}`);
        });
        const whereClause = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
        if (!whereClause) {
          await client.query("ROLLBACK");
          return res.status(400).json({ error: "Delete requires at least one filter" });
        }
        sql = `DELETE FROM "${table}" ${whereClause} RETURNING *`;
        break;
      }

      default:
        await client.query("ROLLBACK");
        return res.status(400).json({ error: `Invalid action: ${action}` });
    }

    const result = await client.query(sql, params);
    await client.query("COMMIT");

    return res.status(200).json({ data: result.rows });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[db/mutate] error:", err);
    return res.status(500).json({ error: "Database mutation failed" });
  } finally {
    client.release();
  }
}

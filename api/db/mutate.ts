import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query, execute } from "../../src/lib/neon/server";
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
  let rows: Record<string, unknown>[] = [];

  try {
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
        const insertParams = cols.map((c) => data[c]);
        sql = `INSERT INTO "${table}" (${cols
          .map((c) => `"${c}"`)
          .join(", ")}) VALUES (${placeholders})`;
        const insResult = await execute(sql, insertParams);
        // SQLite has no RETURNING — fetch the inserted row by rowid
        if (insResult.lastInsertRowid != null) {
          rows = await query(`SELECT * FROM "${table}" WHERE rowid = $1`, [
            insResult.lastInsertRowid,
          ]);
        }
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
        const insertParams = cols.map((c) => data[c]);

        const conflictCol =
          body.onConflict && IDENT_RE.test(body.onConflict) ? body.onConflict : "id";
        const updateCols = cols.filter((c) => c !== conflictCol);
        let conflictSql: string;
        if (updateCols.length > 0) {
          const updateClause = `UPDATE SET ${updateCols
            .map((c) => `"${c}" = excluded."${c}"`)
            .join(", ")}`;
          conflictSql = `ON CONFLICT ("${conflictCol}") DO ${updateClause}`;
        } else {
          conflictSql = `ON CONFLICT ("${conflictCol}") DO NOTHING`;
        }
        sql = `INSERT INTO "${table}" (${cols
          .map((c) => `"${c}"`)
          .join(", ")}) VALUES (${placeholders}) ${conflictSql}`;
        const upResult = await execute(sql, insertParams);
        if (upResult.lastInsertRowid != null) {
          rows = await query(`SELECT * FROM "${table}" WHERE rowid = $1`, [
            upResult.lastInsertRowid,
          ]);
        } else if (upResult.rowsAffected === 0 && conflictCol in data) {
          // DO NOTHING path — fetch the pre-existing row by conflict column
          rows = await query(
            `SELECT * FROM "${table}" WHERE "${conflictCol}" = $1`,
            [data[conflictCol]]
          );
        }
        break;
      }

      case "update": {
        const data = body.data ?? {};
        const filters = body.filters ?? {};
        const cols = Object.keys(data).filter((k) => IDENT_RE.test(k));
        const filterCols = Object.keys(filters).filter((k) => IDENT_RE.test(k));
        if (cols.length === 0) {
          return res
            .status(400)
            .json({ error: "No valid data columns to update" });
        }

        // Build WHERE clause + params (shared by UPDATE and follow-up SELECT)
        const whereParams: unknown[] = [];
        const whereParts: string[] = [];
        let pIdx = 0;
        if (USER_SCOPED_TABLES.has(table) && claims) {
          whereParams.push(claims.sub);
          pIdx++;
          whereParts.push(`"user_id" = $${pIdx}`);
        }
        filterCols.forEach((c) => {
          whereParams.push(filters[c]);
          pIdx++;
          whereParts.push(`"${c}" = $${pIdx}`);
        });
        if (whereParts.length === 0) {
          return res.status(400).json({ error: "Update requires at least one filter" });
        }
        const whereClause = `WHERE ${whereParts.join(" AND ")}`;

        // SET params numbered after the WHERE params
        const setParams: unknown[] = [];
        const setParts = cols.map((c) => {
          setParams.push(data[c]);
          pIdx++;
          return `"${c}" = $${pIdx}`;
        });

        await execute(
          `UPDATE "${table}" SET ${setParts.join(", ")} ${whereClause}`,
          [...whereParams, ...setParams]
        );
        // Follow-up SELECT to return the updated rows (no RETURNING in SQLite)
        rows = await query(`SELECT * FROM "${table}" ${whereClause}`, whereParams);
        break;
      }

      case "delete": {
        const filters = body.filters ?? {};
        const filterCols = Object.keys(filters).filter((k) => IDENT_RE.test(k));
        const whereParams: unknown[] = [];
        const whereParts: string[] = [];
        let pIdx = 0;
        if (USER_SCOPED_TABLES.has(table) && claims) {
          whereParams.push(claims.sub);
          pIdx++;
          whereParts.push(`"user_id" = $${pIdx}`);
        }
        filterCols.forEach((c) => {
          whereParams.push(filters[c]);
          pIdx++;
          whereParts.push(`"${c}" = $${pIdx}`);
        });
        if (whereParts.length === 0) {
          return res.status(400).json({ error: "Delete requires at least one filter" });
        }
        const whereClause = `WHERE ${whereParts.join(" AND ")}`;
        // Capture rows to return before deleting
        rows = await query(`SELECT * FROM "${table}" ${whereClause}`, whereParams);
        await execute(`DELETE FROM "${table}" ${whereClause}`, whereParams);
        break;
      }

      default:
        return res.status(400).json({ error: `Invalid action: ${action}` });
    }

    return res.status(200).json({ data: rows });
  } catch (err) {
    console.error("[db/mutate] error:", err);
    return res.status(500).json({ error: "Database mutation failed" });
  }
}

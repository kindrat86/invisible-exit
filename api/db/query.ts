import type { VercelRequest, VercelResponse } from "../_lib/types";
import { query } from "../../_lib/db";
import { requirePost, verifyBearer } from "../_lib/auth";

/**
 * Whitelisted tables for the generic query endpoint.
 */
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

/**
 * Tables that contain user-scoped data and must be filtered by user_id
 * when the caller is authenticated.
 */
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

interface QueryBody {
  table?: string;
  columns?: string | string[];
  filters?: Record<string, unknown>;
  order?: string | { column: string; ascending?: boolean };
  limit?: number;
  range?: [number, number]; // [offset, count]
  single?: boolean;
}

// Disallow anything other than identifiers in columns/order to prevent injection.
const IDENT_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;

  const body = (req.body ?? {}) as QueryBody;
  const table = body.table;

  if (!table || !ALLOWED_TABLES.has(table)) {
    return res.status(400).json({ error: "Invalid or disallowed table" });
  }

  // --- Columns ---
  let colsClause = "*";
  if (body.columns) {
    const colArr = Array.isArray(body.columns) ? body.columns : [body.columns];
    const cleaned = colArr.filter((c) => typeof c === "string" && IDENT_RE.test(c));
    if (cleaned.length === 0) {
      return res.status(400).json({ error: "Invalid columns" });
    }
    colsClause = cleaned.join(", ");
  }

  // --- Filters ---
  const params: unknown[] = [];
  const whereParts: string[] = [];
  const filters = body.filters ?? {};

  // Optional: scope to authenticated user
  const claims = verifyBearer(req);
  if (USER_SCOPED_TABLES.has(table) && claims) {
    params.push(claims.sub);
    whereParts.push(`"user_id" = $${params.length}`);
  }

  let idx = 0;
  for (const [key, value] of Object.entries(filters)) {
    if (!IDENT_RE.test(key)) continue; // skip invalid column names
    idx += 1;
    params.push(value);
    whereParts.push(`"${key}" = $${params.length}`);
  }

  const whereClause = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

  // --- Order ---
  let orderClause = "";
  if (body.order) {
    if (typeof body.order === "string") {
      const [col, dir] = body.order.split(":");
      if (col && IDENT_RE.test(col)) {
        const direction = dir?.toLowerCase() === "desc" ? "DESC" : "ASC";
        orderClause = `ORDER BY "${col}" ${direction}`;
      }
    } else if (body.order.column && IDENT_RE.test(body.order.column)) {
      const direction = body.order.ascending === false ? "DESC" : "ASC";
      orderClause = `ORDER BY "${body.order.column}" ${direction}`;
    }
  }

  // --- Limit / Range ---
  let limitClause = "";
  let offsetClause = "";
  if (typeof body.limit === "number" && body.limit > 0) {
    params.push(Math.min(Math.floor(body.limit), 1000));
    limitClause = `LIMIT $${params.length}`;
  }
  if (Array.isArray(body.range) && body.range.length === 2) {
    const offset = Math.max(0, Math.floor(body.range[0]));
    const count = Math.min(1000, Math.floor(body.range[1]));
    params.push(offset);
    offsetClause = `OFFSET $${params.length}`;
    if (!limitClause) {
      params.push(count);
      limitClause = `LIMIT $${params.length}`;
    }
  }

  const sql = `SELECT ${colsClause} FROM "${table}" ${whereClause} ${orderClause} ${limitClause} ${offsetClause}`.replace(
    /\s+/g,
    " "
  ).trim();

  try {
    const rows = await query(sql, params);
    if (body.single) {
      return res.status(200).json({ data: rows[0] ?? null });
    }
    return res.status(200).json({ data: rows });
  } catch (err) {
    console.error("[db/query] error:", err);
    return res.status(500).json({ error: "Database query failed" });
  }
}

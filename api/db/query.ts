import type { VercelRequest, VercelResponse } from "../_lib/types";
import { query } from "../_lib/db";
import { requirePost, verifyBearer } from "../_lib/auth";

/**
 * Per-table read policy for the generic query endpoint.
 *
 *  - access "public": anonymous reads allowed (community content, no PII).
 *  - access "auth":   a valid JWT is REQUIRED and results are always
 *                     scoped to the caller's own rows via scopeCol.
 *  - columns:         when set, only these columns may be selected or
 *                     filtered on ("*" maps to this list).
 *
 * Tables not listed here (subscribers, email_sequence_schedule, app_users…)
 * are NOT readable through this endpoint at all.
 */
interface ReadPolicy {
  access: "public" | "auth";
  scopeCol?: string; // ownership column, matched against the JWT claim
  scopeClaim?: "sub" | "email"; // which claim feeds scopeCol (default "sub")
  columns?: string[]; // column allowlist; undefined = all columns
}

const READ_POLICY: Record<string, ReadPolicy> = {
  // Public community tables (no PII columns exposed)
  roadmap_features: { access: "public" },
  feature_requests: {
    access: "public",
    columns: [
      "id",
      "title",
      "description",
      "status",
      "vote_count",
      "is_approved",
      "created_at",
      "updated_at",
    ],
  },
  // Authenticated — always scoped to the caller's own rows
  profiles: { access: "auth", scopeCol: "id" },
  fym_entries: { access: "auth", scopeCol: "user_id" },
  fym_badges: { access: "auth", scopeCol: "user_id" },
  fym_scenarios: { access: "auth", scopeCol: "user_id" },
  invisibility_scores: { access: "auth", scopeCol: "user_id" },
  roadmap_votes: { access: "auth", scopeCol: "user_id" },
  roadmap_requests: { access: "auth", scopeCol: "user_id" },
  feature_votes: { access: "auth", scopeCol: "user_id" },
  user_subscriptions: { access: "auth", scopeCol: "user_id" },
  referrals: { access: "auth", scopeCol: "referrer_email", scopeClaim: "email" },
};

interface QueryBody {
  table?: string;
  columns?: string | string[];
  filters?: unknown;
  order?: string | { column: string; ascending?: boolean } | null;
  limit?: number | null;
  range?: [number, number] | { from: number; to: number } | null;
  single?: boolean;
}

// Disallow anything other than identifiers in columns/order to prevent injection.
const IDENT_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

/**
 * Accept both filter shapes the frontends send:
 *   - array:  [{ column, value }, …]  (src/lib/neon/client.ts)
 *   - object: { col: value, … }       (legacy callers)
 */
function normalizeFilters(raw: unknown): Array<{ column: string; value: unknown }> {
  if (Array.isArray(raw)) {
    return raw
      .filter(
        (f): f is { column: string; value: unknown } =>
          !!f && typeof f === "object" && typeof (f as { column?: unknown }).column === "string"
      )
      .map((f) => ({ column: f.column, value: f.value }));
  }
  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, unknown>).map(([column, value]) => ({
      column,
      value,
    }));
  }
  return [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;

  const body = (req.body ?? {}) as QueryBody;
  const table = body.table;

  const policy = table ? READ_POLICY[table] : undefined;
  if (!table || !policy) {
    return res.status(400).json({ error: "Invalid or disallowed table" });
  }

  const claims = verifyBearer(req);
  if (policy.access === "auth" && !claims) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // --- Columns ---
  let colsClause = "*";
  if (body.columns && body.columns !== "*") {
    const colArr = Array.isArray(body.columns)
      ? body.columns
      : String(body.columns).split(",").map((c) => c.trim());
    let cleaned = colArr.filter((c) => typeof c === "string" && IDENT_RE.test(c));
    if (policy.columns) {
      cleaned = cleaned.filter((c) => policy.columns!.includes(c));
    }
    if (cleaned.length === 0) {
      return res.status(400).json({ error: "Invalid columns" });
    }
    colsClause = cleaned.map((c) => `"${c}"`).join(", ");
  } else if (policy.columns) {
    // "*" on a column-restricted table maps to the allowlist.
    colsClause = policy.columns.map((c) => `"${c}"`).join(", ");
  }

  // --- Filters ---
  const params: unknown[] = [];
  const whereParts: string[] = [];

  // Mandatory ownership scoping for authenticated tables — never optional.
  if (policy.scopeCol) {
    const scopeValue = policy.scopeClaim === "email" ? claims!.email : claims!.sub;
    params.push(scopeValue);
    whereParts.push(`"${policy.scopeCol}" = $${params.length}`);
  }

  for (const { column, value } of normalizeFilters(body.filters)) {
    if (!IDENT_RE.test(column)) continue; // skip invalid column names
    if (policy.columns && !policy.columns.includes(column)) continue; // no filtering on hidden columns
    if (policy.scopeCol && column === policy.scopeCol) continue; // scope is already enforced
    params.push(value);
    whereParts.push(`"${column}" = $${params.length}`);
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
  // Accept both [offset, count] and supabase-style { from, to } (inclusive).
  let rangeFrom: number | null = null;
  let rangeCount: number | null = null;
  if (Array.isArray(body.range) && body.range.length === 2) {
    rangeFrom = Math.max(0, Math.floor(body.range[0]));
    rangeCount = Math.min(1000, Math.floor(body.range[1]));
  } else if (
    body.range &&
    typeof body.range === "object" &&
    typeof (body.range as { from?: unknown }).from === "number"
  ) {
    const r = body.range as { from: number; to: number };
    rangeFrom = Math.max(0, Math.floor(r.from));
    rangeCount = Math.min(1000, Math.max(0, Math.floor(r.to) - rangeFrom + 1));
  }
  if (rangeFrom !== null) {
    params.push(rangeFrom);
    offsetClause = `OFFSET $${params.length}`;
    if (!limitClause && rangeCount !== null) {
      params.push(rangeCount);
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

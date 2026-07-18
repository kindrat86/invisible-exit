import type { VercelRequest, VercelResponse } from "../_lib/types";
import { query, execute } from "../_lib/db";
import { requirePost, verifyBearer, type JwtPayload } from "../_lib/auth";
import { checkRateLimit, getClientIP } from "../_lib/rate-limit";

const IDENT_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Server-side admin identity (mirrors ADMIN_EMAIL in src/lib/constants.ts).
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "escape@invisibleexit.com";

type Action = "insert" | "update" | "upsert" | "delete";

/**
 * Per-table write policy. Tables not listed are not writable through this
 * endpoint at all (profiles, user_subscriptions, email_sequence_schedule,
 * app_users… are server-managed only).
 *
 *  - access "public":  anonymous writes allowed (lead capture), always
 *                      column-allowlisted and rate limited.
 *  - access "auth":    valid JWT required.
 *  - access "admin":   valid JWT with the admin email required.
 *  - scopeCol:         ownership column. Forced to the caller's claim on
 *                      insert/upsert; forced into WHERE on update/delete.
 *  - insertColumns / updateColumns: client-suppliable column allowlists.
 *    Unknown columns are dropped (NOT an error) so legacy callers that send
 *    extra fields still capture the valid ones.
 */
interface ActionPolicy {
  access: "public" | "auth" | "admin";
  columns?: string[];
}
interface WritePolicy {
  scopeCol?: string;
  scopeClaim?: "sub" | "email";
  actions: Partial<Record<Action, ActionPolicy>>;
  onConflict?: string; // forced ON CONFLICT column for upserts
  forced?: (claims: JwtPayload | null) => Record<string, unknown>;
  aliases?: Record<string, string>; // client key -> real column
  rateLimit?: { max: number; windowMs: number };
}

const WRITE_POLICY: Record<string, WritePolicy> = {
  // Anonymous lead capture (funnel pages). Insert/upsert only — the
  // subscribers table can never be read, updated or deleted from here.
  subscribers: {
    actions: {
      insert: { access: "public", columns: ["email", "source"] },
      upsert: { access: "public", columns: ["email", "source"] },
    },
    onConflict: "email",
    rateLimit: { max: 15, windowMs: 3600000 }, // 15/hour/IP
  },
  // Public question/feature submissions land unapproved for moderation.
  // Approval/status/deletion is admin-only.
  feature_requests: {
    actions: {
      insert: { access: "public", columns: ["title", "description", "submitted_email"] },
      update: { access: "admin", columns: ["is_approved", "status", "vote_count"] },
      delete: { access: "admin" },
    },
    forced: (claims) => ({
      status: "pending",
      is_approved: 0,
      submitted_by: claims?.sub ?? null,
    }),
    aliases: { email: "submitted_email" }, // legacy callers send `email`
    rateLimit: { max: 15, windowMs: 3600000 },
  },
  // Voting counters — authenticated users only, counter columns only.
  roadmap_features: {
    actions: {
      update: { access: "auth", columns: ["upvotes", "downvotes"] },
    },
  },
  roadmap_votes: {
    scopeCol: "user_id",
    actions: {
      insert: { access: "auth", columns: ["feature_id", "vote_type"] },
      update: { access: "auth", columns: ["vote_type"] },
      delete: { access: "auth" },
    },
  },
  feature_votes: {
    scopeCol: "user_id",
    actions: {
      insert: { access: "auth", columns: ["feature_id", "vote_type"] },
      update: { access: "auth", columns: ["vote_type"] },
      delete: { access: "auth" },
    },
  },
  roadmap_requests: {
    scopeCol: "user_id",
    actions: {
      insert: { access: "auth", columns: ["title", "description"] },
    },
  },
  // User-owned tool data — authenticated, always scoped to the caller.
  fym_entries: {
    scopeCol: "user_id",
    actions: {
      insert: { access: "auth" },
      upsert: { access: "auth" },
      update: { access: "auth" },
      delete: { access: "auth" },
    },
  },
  fym_badges: {
    scopeCol: "user_id",
    actions: {
      insert: { access: "auth" },
      upsert: { access: "auth" },
    },
  },
  fym_scenarios: {
    scopeCol: "user_id",
    actions: {
      insert: { access: "auth" },
      upsert: { access: "auth" },
      update: { access: "auth" },
      delete: { access: "auth" },
    },
  },
  invisibility_scores: {
    scopeCol: "user_id",
    actions: {
      insert: { access: "auth" },
      upsert: { access: "auth" },
      update: { access: "auth" },
      delete: { access: "auth" },
    },
  },
  // Referral codes — authenticated; referrer_email is always the caller's.
  referrals: {
    scopeCol: "referrer_email",
    scopeClaim: "email",
    actions: {
      insert: { access: "auth", columns: ["referrer_code", "status"] },
    },
  },
};

interface MutateBody {
  action?: Action;
  table?: string;
  data?: Record<string, unknown> | null;
  filters?: unknown;
  onConflict?: string;
}

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

  const body = (req.body ?? {}) as MutateBody;
  const { action, table } = body;

  const policy = table ? WRITE_POLICY[table] : undefined;
  if (!table || !policy) {
    return res.status(400).json({ error: "Invalid or disallowed table" });
  }
  if (!action || !policy.actions[action]) {
    return res.status(400).json({ error: `Action not allowed on ${table}` });
  }
  const actionPolicy = policy.actions[action]!;

  const claims = verifyBearer(req);
  if (actionPolicy.access !== "public" && !claims) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (actionPolicy.access === "admin" && claims!.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Rate-limit publicly writable tables per IP.
  if (policy.rateLimit) {
    const ip = getClientIP(req);
    const rl = checkRateLimit(`db-mutate:${table}:${ip}`, policy.rateLimit);
    if (!rl.allowed) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }
  }

  const scopeValue = policy.scopeCol
    ? policy.scopeClaim === "email"
      ? claims!.email
      : claims!.sub
    : undefined;

  /** Build the sanitized data record for insert/upsert/update. */
  function buildData(): Record<string, unknown> | null {
    const raw = body.data;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const data: Record<string, unknown> = {};
    for (const [rawKey, value] of Object.entries(raw)) {
      const key = policy.aliases?.[rawKey] ?? rawKey;
      if (!IDENT_RE.test(key)) continue;
      if (actionPolicy.columns && !actionPolicy.columns.includes(key)) continue; // drop unknown cols
      if (policy.scopeCol && key === policy.scopeCol) continue; // never client-controlled
      data[key] = value;
    }
    // Server-forced values (moderation flags, ownership) always win.
    if (policy.forced && (action === "insert" || action === "upsert")) {
      Object.assign(data, policy.forced(claims));
    }
    if (policy.scopeCol && (action === "insert" || action === "upsert")) {
      data[policy.scopeCol] = scopeValue;
    }
    return data;
  }

  // Table-specific validation for anonymous lead capture.
  if (table === "subscribers") {
    const email = (body.data as Record<string, unknown> | null | undefined)?.email;
    if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 254) {
      return res.status(400).json({ error: "Invalid email address" });
    }
  }

  let rows: Record<string, unknown>[] = [];

  try {
    switch (action) {
      case "insert": {
        const data = buildData();
        const cols = data ? Object.keys(data).filter((k) => data[k] !== undefined) : [];
        if (!data || cols.length === 0) {
          return res.status(400).json({ error: "No valid data columns" });
        }
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
        const insertParams = cols.map((c) => data[c]);
        const sql = `INSERT INTO "${table}" (${cols
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
        const data = buildData();
        const cols = data ? Object.keys(data).filter((k) => data[k] !== undefined) : [];
        if (!data || cols.length === 0) {
          return res.status(400).json({ error: "No valid data columns" });
        }
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
        const insertParams = cols.map((c) => data[c]);

        // Conflict column is server-controlled when the policy pins one.
        const conflictCol =
          policy.onConflict ??
          (body.onConflict && IDENT_RE.test(body.onConflict) ? body.onConflict : "id");
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
        const sql = `INSERT INTO "${table}" (${cols
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
        const data = buildData();
        const cols = data ? Object.keys(data).filter((k) => data[k] !== undefined) : [];
        const filters = normalizeFilters(body.filters).filter(
          (f) => IDENT_RE.test(f.column) && !(policy.scopeCol && f.column === policy.scopeCol)
        );
        if (!data || cols.length === 0) {
          return res
            .status(400)
            .json({ error: "No valid data columns to update" });
        }
        if (filters.length === 0) {
          return res.status(400).json({ error: "Update requires at least one filter" });
        }

        // Build WHERE clause + params (shared by UPDATE and follow-up SELECT)
        const whereParams: unknown[] = [];
        const whereParts: string[] = [];
        let pIdx = 0;
        if (policy.scopeCol) {
          whereParams.push(scopeValue);
          pIdx++;
          whereParts.push(`"${policy.scopeCol}" = $${pIdx}`);
        }
        filters.forEach((f) => {
          whereParams.push(f.value);
          pIdx++;
          whereParts.push(`"${f.column}" = $${pIdx}`);
        });
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
        const filters = normalizeFilters(body.filters).filter(
          (f) => IDENT_RE.test(f.column) && !(policy.scopeCol && f.column === policy.scopeCol)
        );
        if (filters.length === 0) {
          return res.status(400).json({ error: "Delete requires at least one filter" });
        }
        const whereParams: unknown[] = [];
        const whereParts: string[] = [];
        let pIdx = 0;
        if (policy.scopeCol) {
          whereParams.push(scopeValue);
          pIdx++;
          whereParts.push(`"${policy.scopeCol}" = $${pIdx}`);
        }
        filters.forEach((f) => {
          whereParams.push(f.value);
          pIdx++;
          whereParts.push(`"${f.column}" = $${pIdx}`);
        });
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

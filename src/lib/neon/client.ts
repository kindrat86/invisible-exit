/**
 * Neon-backed drop-in replacement for the Supabase client.
 *
 * This mimics the supabase-js API surface used in the frontend:
 *   - supabase.from(table).select().eq().single()
 *   - supabase.from(table).upsert()
 *   - supabase.functions.invoke(name, { body })
 *   - supabase.auth.* (JWT-based)
 *
 * All data operations route through /api/db/[action] serverless routes
 * that use a pg Pool connected to Neon. Auth is JWT + Resend magic link.
 */

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface QueryBuilder {
  select: (columns?: string) => QueryBuilder;
  eq: (column: string, value: unknown) => QueryBuilder;
  order: (column: string, opts?: { ascending?: boolean }) => QueryBuilder;
  limit: (count: number) => QueryBuilder;
  range: (from: number, to: number) => QueryBuilder;
  single: () => Promise<{ data: unknown | null; error: unknown | null }>;
  then: (resolve: (data: unknown) => void, reject?: (err: unknown) => void) => void;
}

interface FromResult {
  select: (columns?: string) => QueryBuilder;
  insert: (data: unknown | unknown[]) => { select: () => QueryBuilder };
  update: (data: unknown) => { eq: (col: string, val: unknown) => Promise<{ data: unknown | null; error: unknown | null }> };
  upsert: (data: unknown, opts?: { onConflict?: string }) => Promise<{ data: unknown | null; error: unknown | null }>;
  delete: () => { eq: (col: string, val: unknown) => Promise<{ data: unknown | null; error: unknown | null }> };
}

type AuthChangeEvent = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED" | "USER_UPDATED" | "PASSWORD_RECOVERY" | "INITIAL_SESSION";

interface Session {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user: User | null;
}

interface User {
  id: string;
  email: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  aud?: string;
  created_at?: string;
}

// ─────────────────────────────────────────────────────────────
// Query Builder (chains into /api/db/query)
// ─────────────────────────────────────────────────────────────

class NeonQueryChain implements QueryBuilder {
  private table: string;
  private columns = "*";
  private filters: Array<{ column: string; value: unknown }> = [];
  private orderCol: string | null = null;
  private orderAsc = true;
  private limitCount: number | null = null;
  private rangeFrom: number | null = null;
  private rangeTo: number | null = null;
  private singleMode = false;

  constructor(table: string) {
    this.table = table;
  }

  select(columns = "*") {
    this.columns = columns;
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push({ column, value });
    return this;
  }

  order(column: string, opts?: { ascending?: boolean }) {
    this.orderCol = column;
    this.orderAsc = opts?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number) {
    this.rangeFrom = from;
    this.rangeTo = to;
    return this;
  }

  single() {
    this.singleMode = true;
    return this.execute();
  }

  private async execute(): Promise<{ data: unknown | null; error: unknown | null }> {
    try {
      const token = getAccessToken();
      const res = await fetch("/api/db/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          table: this.table,
          columns: this.columns,
          filters: this.filters,
          order: this.orderCol ? { column: this.orderCol, ascending: this.orderAsc } : null,
          limit: this.limitCount,
          range: this.rangeFrom !== null ? { from: this.rangeFrom, to: this.rangeTo } : null,
          single: this.singleMode,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        return { data: null, error: { message: errBody.error || `HTTP ${res.status}` } };
      }

      const json = await res.json();
      return { data: json.data, error: null };
    } catch (e) {
      return { data: null, error: { message: String(e) } };
    }
  }

  // Make it thenable so `await supabase.from(t).select()...` works
  then(resolve: (data: unknown) => void, reject?: (err: unknown) => void) {
    this.execute().then(
      (result) => resolve(result),
      (err) => reject?.(err)
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Mutations (insert/update/upsert/delete via /api/db/mutate)
// ─────────────────────────────────────────────────────────────

class NeonMutator {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  insert(data: unknown | unknown[]) {
    return {
      select: () => new NeonQueryChain(this.table), // chainable no-op for compat
      then: (resolve: (data: unknown) => void, reject?: (err: unknown) => void) => {
        this.mutate("insert", data).then(resolve, reject);
      },
    };
  }

  update(data: unknown) {
    return {
      eq: async (col: string, val: unknown) => {
        return this.mutate("update", data, [{ column: col, value: val }]);
      },
    };
  }

  async upsert(data: unknown, opts?: { onConflict?: string }) {
    return this.mutate("upsert", data, [], opts?.onConflict);
  }

  delete() {
    return {
      eq: async (col: string, val: unknown) => {
        return this.mutate("delete", null, [{ column: col, value: val }]);
      },
    };
  }

  private async mutate(
    action: string,
    data: unknown,
    filters: Array<{ column: string; value: unknown }> = [],
    onConflict?: string
  ): Promise<{ data: unknown | null; error: unknown | null }> {
    try {
      const token = getAccessToken();
      const res = await fetch("/api/db/mutate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action, table: this.table, data, filters, onConflict }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        return { data: null, error: { message: errBody.error || `HTTP ${res.status}` } };
      }

      const json = await res.json();
      return { data: json.data, error: null };
    } catch (e) {
      return { data: null, error: { message: String(e) } };
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Auth (JWT + Resend magic link)
// ─────────────────────────────────────────────────────────────

const TOKEN_KEY = "ie_session_token";
const REFRESH_KEY = "ie_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getSessionFromStorage(): Session | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  // Decode JWT payload to get user info
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      access_token: token,
      refresh_token: localStorage.getItem(REFRESH_KEY) ?? undefined,
      user: {
        id: payload.sub,
        email: payload.email,
        aud: payload.aud,
      },
    };
  } catch {
    return null;
  }
}

type AuthListener = (event: AuthChangeEvent, session: Session | null) => void;
const authListeners: AuthListener[] = [];

function notifyAuthListeners(event: AuthChangeEvent, session: Session | null) {
  authListeners.forEach((cb) => cb(event, session));
}

const auth = {
  async getSession(): Promise<{ data: { session: Session | null } }> {
    return { data: { session: getSessionFromStorage() } };
  },

  async getUser(token?: string): Promise<{ data: { user: User | null }; error: unknown | null }> {
    const session = getSessionFromStorage();
    if (!session?.user) {
      // Try to fetch from /api/auth/me
      const t = token || getAccessToken();
      if (!t) return { data: { user: null }, error: null };
      try {
        const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } });
        if (!res.ok) return { data: { user: null }, error: null };
        const user = await res.json();
        return { data: { user }, error: null };
      } catch {
        return { data: { user: null }, error: null };
      }
    }
    return { data: { user: session.user }, error: null };
  },

  async signInWithOtp({ email }: { email: string }) {
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { error: { message: err.error || "Failed to send magic link" } };
      }
      return { error: null };
    } catch (e) {
      return { error: { message: String(e) } };
    }
  },

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { error: { message: err.error || "Invalid credentials" } };
      }
      const { access_token, refresh_token, user } = await res.json();
      localStorage.setItem(TOKEN_KEY, access_token);
      if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
      notifyAuthListeners("SIGNED_IN", { access_token, refresh_token, user });
      return { error: null };
    } catch (e) {
      return { error: { message: String(e) } };
    }
  },

  async signUp({ email, password }: { email: string; password: string }) {
    // Same as login — creates account then signs in
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { error: { message: err.error || "Signup failed" } };
      }
      const { access_token, refresh_token, user } = await res.json();
      localStorage.setItem(TOKEN_KEY, access_token);
      if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
      notifyAuthListeners("SIGNED_IN", { access_token, refresh_token, user });
      return { error: null, data: { user } };
    } catch (e) {
      return { error: { message: String(e) } };
    }
  },

  async signInWithOAuth() {
    return { error: { message: "OAuth not supported" } };
  },

  async signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    notifyAuthListeners("SIGNED_OUT", null);
    return { error: null };
  },

  async resetPasswordForEmail(email: string) {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { error: { message: err.error || "Failed to send reset email" } };
      }
      return { error: null };
    } catch (e) {
      return { error: { message: String(e) } };
    }
  },

  async updateUser({ password }: { password: string }) {
    const token = getAccessToken();
    if (!token) return { error: { message: "Not authenticated" } };
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { error: { message: err.error || "Failed to update password" } };
      }
      return { error: null };
    } catch (e) {
      return { error: { message: String(e) } };
    }
  },

  onAuthStateChange(callback: AuthListener) {
    authListeners.push(callback);
    // Fire initial session
    const session = getSessionFromStorage();
    if (session) {
      callback("INITIAL_SESSION", session);
    }
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const idx = authListeners.indexOf(callback);
            if (idx > -1) authListeners.splice(idx, 1);
          },
        },
      },
    };
  },
};

// ─────────────────────────────────────────────────────────────
// Functions (edge functions → /api/ routes)
// ─────────────────────────────────────────────────────────────

const functions = {
  async invoke(name: string, opts?: { body?: unknown; headers?: Record<string, string> }) {
    const token = getAccessToken();
    const res = await fetch(`/api/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opts?.headers,
      },
      body: JSON.stringify(opts?.body ?? {}),
    });

    const data = await res.json().catch(() => ({}));
    return {
      data: res.ok ? data : null,
      error: res.ok ? null : data,
    };
  },
};

// ─────────────────────────────────────────────────────────────
// Main export — drop-in supabase replacement
// ─────────────────────────────────────────────────────────────

export const neonClient = {
  from(table: string): FromResult {
    const chain = new NeonQueryChain(table);
    const mutator = new NeonMutator(table);
    return {
      select: (columns?: string) => {
        chain.select(columns);
        return chain;
      },
      insert: (data: unknown | unknown[]) => mutator.insert(data),
      update: (data: unknown) => mutator.update(data),
      upsert: (data: unknown, opts?: { onConflict?: string }) => mutator.upsert(data, opts),
      delete: () => mutator.delete(),
    };
  },
  auth,
  functions,
  channel: { subscribe: () => ({}) }, // no-op for realtime compat
  removeSubscription: () => ({}), // no-op
};

// Type for the integration layer
export type NeonClient = typeof neonClient;

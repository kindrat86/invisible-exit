import type { VercelRequest, VercelResponse } from "../_lib/types";
import bcrypt from "bcryptjs";
import { query, batch } from "../../_lib/db";
import { requirePost, signAccessToken, signRefreshToken } from "../_lib/auth";

interface SignupBody {
  email?: string;
  password?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;

  const { email, password } = (req.body ?? {}) as SignupBody;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check for existing user
  const existing = await query<{ id: string }>(
    "SELECT id FROM app_users WHERE email = $1",
    [normalizedEmail]
  );
  if (existing.length > 0) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Generate UUID in JS (SQLite has no uuid_generate_v4()).
  // SQLite also lacks writable CTEs / RETURNING, so insert both rows directly.
  const userId = crypto.randomUUID();

  // Insert app_users + profiles in a single transaction (batch)
  await batch([
    {
      sql: `INSERT INTO app_users (id, email, password_hash) VALUES ($1, $2, $3)`,
      args: [userId, normalizedEmail, passwordHash],
    },
    {
      sql: `INSERT INTO profiles (id, email) VALUES ($1, $2)`,
      args: [userId, normalizedEmail],
    },
  ]);

  const user = { id: userId, email: normalizedEmail };

  const payload = { sub: user.id, email: user.email };
  return res.status(201).json({
    access_token: signAccessToken(payload),
    refresh_token: signRefreshToken(payload),
    user: { id: user.id, email: user.email },
  });
}

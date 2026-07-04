import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { query } from "../../src/lib/neon/server";
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

  // Insert app_users + profiles in a single transaction
  const rows = await query<{ id: string; email: string }>(
    `
    WITH new_user AS (
      INSERT INTO app_users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email
    ),
    new_profile AS (
      INSERT INTO profiles (id, email)
      SELECT id, email FROM new_user
      RETURNING id
    )
    SELECT id, email FROM new_user
    `,
    [normalizedEmail, passwordHash]
  );

  const user = rows[0];
  if (!user) {
    return res.status(500).json({ error: "Failed to create user" });
  }

  const payload = { sub: user.id, email: user.email };
  return res.status(201).json({
    access_token: signAccessToken(payload),
    refresh_token: signRefreshToken(payload),
    user: { id: user.id, email: user.email },
  });
}

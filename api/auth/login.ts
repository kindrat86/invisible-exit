import type { VercelRequest, VercelResponse } from "../_lib/types";
import bcrypt from "bcryptjs";
import { queryOne } from "../../_lib/db";
import { requirePost, signAccessToken, signRefreshToken } from "../_lib/auth";

interface LoginBody {
  email?: string;
  password?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;

  const { email, password } = (req.body ?? {}) as LoginBody;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await queryOne<{ id: string; email: string; password_hash: string }>(
    "SELECT id, email, password_hash FROM app_users WHERE email = $1",
    [normalizedEmail]
  );

  // Use a constant-time-ish failure: still run bcrypt.compare against a dummy hash
  // to avoid user enumeration via timing.
  const dummyHash = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8.0m6F8V8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8";
  const valid = user?.password_hash
    ? await bcrypt.compare(password, user.password_hash)
    : (await bcrypt.compare(password, dummyHash)) && false;

  if (!user || !user.password_hash || !valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const payload = { sub: user.id, email: user.email };
  return res.status(200).json({
    access_token: signAccessToken(payload),
    refresh_token: signRefreshToken(payload),
    user: { id: user.id, email: user.email },
  });
}

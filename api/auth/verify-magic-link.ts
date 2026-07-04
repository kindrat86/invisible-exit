import type { VercelRequest, VercelResponse } from "@vercel/node";
import { queryOne, query } from "../../src/lib/neon/server";
import { requirePost, signAccessToken, signRefreshToken } from "../_lib/auth";

interface VerifyBody {
  token?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;

  const { token } = (req.body ?? {}) as VerifyBody;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const user = await queryOne<{ id: string; email: string }>(
    `
    SELECT id, email FROM app_users
    WHERE magic_link_token = $1
      AND magic_link_expires > datetime('now')
    `,
    [token]
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Clear the token so it can't be reused
  await query(
    `UPDATE app_users SET magic_link_token = NULL, magic_link_expires = NULL, updated_at = datetime('now')
     WHERE id = $1`,
    [user.id]
  );

  const payload = { sub: user.id, email: user.email };
  return res.status(200).json({
    access_token: signAccessToken(payload),
    refresh_token: signRefreshToken(payload),
    user: { id: user.id, email: user.email },
  });
}

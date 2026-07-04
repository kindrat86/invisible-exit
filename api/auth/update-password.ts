import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { execute } from "../../src/lib/neon/server";
import { requirePost, verifyBearer } from "../_lib/auth";

interface UpdatePasswordBody {
  password?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requirePost(req, res)) return;

  const claims = verifyBearer(req);
  if (!claims) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const { password } = (req.body ?? {}) as UpdatePasswordBody;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // SQLite: NOW() -> datetime('now'). execute() returns rowsAffected.
  await execute(
    `
    UPDATE app_users
    SET password_hash = $2,
        magic_link_token = NULL,
        magic_link_expires = NULL,
        updated_at = datetime('now')
    WHERE id = $1
    `,
    [claims.sub, passwordHash]
  );

  return res.status(200).json({ success: true });
}

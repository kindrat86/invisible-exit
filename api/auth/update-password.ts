import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { query } from "../../src/lib/neon/server";
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

  const result = await query(
    `
    UPDATE app_users
    SET password_hash = $2,
        magic_link_token = NULL,
        magic_link_expires = NULL,
        updated_at = NOW()
    WHERE id = $1
    `,
    [claims.sub, passwordHash]
  );

  if (result.length === 0) {
    // query() returns rows; rowCount is on the underlying result. Re-check via a select.
  }

  return res.status(200).json({ success: true });
}

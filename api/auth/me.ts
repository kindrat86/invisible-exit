import type { VercelRequest, VercelResponse } from "../_lib/types";
import { queryOne } from "../../_lib/db";
import { requireGet, verifyBearer } from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireGet(req, res)) return;

  const claims = verifyBearer(req);
  if (!claims) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const user = await queryOne<{
    id: string;
    email: string;
    stripe_customer_id: string | null;
    subscription_status: string;
    subscription_tier: string;
    monthly_validations_used: number;
    validations_reset_at: string;
    ideas_browsed_total: number;
    created_at: string;
  }>(
    `
    SELECT id, email, stripe_customer_id, subscription_status, subscription_tier,
           monthly_validations_used, validations_reset_at, ideas_browsed_total, created_at
    FROM app_users
    WHERE id = $1
    `,
    [claims.sub]
  );

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  return res.status(200).json({ data: user });
}

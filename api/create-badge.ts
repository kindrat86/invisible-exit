import type { VercelRequest, VercelResponse } from "./_lib/types";
import jwt from "jsonwebtoken";
import { query, queryOne, execute } from "./_lib/db";

interface BadgeRow {
  id: string;
  share_id: string;
  created_at: string;
}

interface JwtPayload {
  sub: string;
  email?: string;
}

function genShareId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify JWT from Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.replace("Bearer ", "");

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = payload.sub;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { badge_value } = req.body;
    const siteUrl =
      process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? "https://invisibleexit.com";

    if (badge_value === undefined || badge_value === null) {
      return res.status(400).json({ error: "badge_value is required" });
    }

    // Check if badge with same value already exists for this user
    const existing = await queryOne<BadgeRow>(
      `SELECT id, share_id FROM fym_badges
       WHERE user_id = $1 AND badge_value = $2
       LIMIT 1`,
      [userId, badge_value]
    );

    if (existing) {
      return res.status(200).json({
        share_url: `${siteUrl}/fym/badge/${existing.share_id}`,
        share_id: existing.share_id,
      });
    }

    // Enforce 10-badge limit: delete oldest if at limit
    const allBadges = await query<{ id: string; created_at: string }>(
      `SELECT id, created_at FROM fym_badges
       WHERE user_id = $1
       ORDER BY created_at ASC`,
      [userId]
    );

    if (allBadges.length >= 10) {
      const toDelete = allBadges.slice(0, allBadges.length - 9);
      if (toDelete.length > 0) {
        // SQLite has no arrays / ANY() — expand to IN (?, ?, ...)
        const placeholders = toDelete.map((_, i) => `$${i + 1}`).join(", ");
        await execute(
          `DELETE FROM fym_badges WHERE id IN (${placeholders})`,
          toDelete.map((b) => b.id)
        );
      }
    }

    // Insert with retry on unique constraint violation (share_id collision).
    // SQLite has no RETURNING; generate the id in JS.
    let shareId = genShareId();
    let inserted = false;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const badgeId = crypto.randomUUID();
        await execute(
          `INSERT INTO fym_badges (id, user_id, badge_value, share_id)
           VALUES ($1, $2, $3, $4)`,
          [badgeId, userId, badge_value, shareId]
        );
        inserted = true;
        break;
      } catch (err: any) {
        // 23505 = Postgres unique_violation; SQLite raises "UNIQUE constraint failed"
        if (err?.code === "23505" || /UNIQUE constraint/i.test(err?.message)) {
          shareId = genShareId();
          continue;
        }
        throw err;
      }
    }

    if (!inserted) {
      throw new Error("Failed to insert badge after retries");
    }

    return res.status(200).json({
      share_url: `${siteUrl}/fym/badge/${shareId}`,
      share_id: shareId,
    });
  } catch (error) {
    console.error("create-badge error:", error);
    return res.status(400).json({
      error: "An unexpected error occurred. Please try again.",
    });
  }
}

/**
 * /api/email-sequence-scheduler.ts
 *
 * Vercel serverless route — converted from
 * supabase/functions/email-sequence-scheduler/index.ts
 *
 * Called by Vercel Cron (or manually). Auth via CRON_SECRET.
 *
 * For each pending schedule row:
 *  1. Check if subscriber is now a buyer → switch to post_purchase
 *  2. Find due emails not yet in days_sent
 *  3. Send via sendEmail (imported from ./email-sequence)
 *  4. Update days_sent array
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "../src/lib/neon/server";
import { sendEmail, getSequence } from "./email-sequence";

const MAX_DAYS: Record<string, number> = {
  soap_opera: 4,
  seinfeld: 84,
  winback: 100,
  ascension: 7,
  post_purchase: 5,
};

interface ScheduleRow {
  id: string;
  email: string;
  sequence: string;
  started_at: string;
  days_sent: number[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ── CRON_SECRET auth ──
  const authHeader = req.headers["authorization"] ?? "";
  const providedSecret = authHeader.replace(/^Bearer\s+/i, "");
  const expected = process.env.CRON_SECRET;

  if (!expected || providedSecret !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get all pending sequences
    const schedules = await query<ScheduleRow>(
      `SELECT id, email, sequence, started_at, days_sent
       FROM email_sequence_schedule
       WHERE completed_at IS NULL`,
    );

    if (schedules.length === 0) {
      return res.status(200).json({ sent: 0, checked: 0, message: "No pending emails" });
    }

    let sentCount = 0;
    const now = Date.now();

    for (const schedule of schedules) {
      const startedAt = new Date(schedule.started_at).getTime();
      const daysSinceStart = Math.floor((now - startedAt) / (1000 * 60 * 60 * 24));
      const rawDaysSent = schedule.days_sent;
      const daysSent: number[] = typeof rawDaysSent === "string"
        ? JSON.parse(rawDaysSent)
        : Array.isArray(rawDaysSent) ? rawDaysSent : [];
      const sequence = schedule.sequence || "soap_opera";
      const maxDays = MAX_DAYS[sequence] ?? 4;
      const allEmails = getSequence(sequence);

      // ── BUYER SUPPRESSION ──
      // Check if subscriber is now a buyer (profile with active subscription)
      const profile = await queryOne<{ subscription_status: string; subscription_tier: string | null }>(
        `SELECT subscription_status, subscription_tier FROM profiles WHERE email = $1`,
        [schedule.email],
      );

      const isBuyer =
        profile?.subscription_status === "active" && Boolean(profile?.subscription_tier);

      // If buyer and not already on post_purchase, switch over
      if (isBuyer && sequence !== "post_purchase") {
        const ts = new Date().toISOString();
        // Mark current sequence complete
        await query(
          `UPDATE email_sequence_schedule
           SET completed_at = $1, updated_at = $2
           WHERE id = $3`,
          [ts, ts, schedule.id],
        );

        // Create post-purchase sequence schedule
        await query(
          `INSERT INTO email_sequence_schedule (email, sequence, started_at, days_sent)
           VALUES ($1, 'post_purchase', $2, '{}')`,
          [schedule.email, ts],
        );

        continue; // Skip this schedule, buyer handled
      }

      // Find the next due email not yet sent
      for (let day = 1; day <= maxDays; day++) {
        if (daysSent.includes(day)) continue;
        if (daysSinceStart < day) break;

        // This email is due — find the matching entry in the sequence array
        const emailData = allEmails.find((e) => e.day === day);
        if (!emailData) {
          // Day not in this sequence's schedule; mark as sent to skip next time
          daysSent.push(day);
          break;
        }

        const result = await sendEmail(schedule.email, emailData.subject, emailData.html);

        if (result.success) {
          sentCount++;
          const updatedDaysSent = [...daysSent, day];
          const isComplete = day >= maxDays;
          const ts = new Date().toISOString();

          await query(
            `UPDATE email_sequence_schedule
             SET days_sent = $1, completed_at = $2, updated_at = $3
             WHERE id = $4`,
            [JSON.stringify(updatedDaysSent), isComplete ? ts : null, ts, schedule.id],
          );
        }

        // Only send one email per check (avoid spamming)
        break;
      }
    }

    return res.status(200).json({
      success: true,
      sent: sentCount,
      checked: schedules.length,
    });
  } catch (err: any) {
    console.error("Scheduler error:", err);
    return res.status(500).json({ error: err?.message ?? "Internal error" });
  }
}

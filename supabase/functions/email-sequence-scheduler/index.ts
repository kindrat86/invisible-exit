import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// This function is designed to be called by a daily cron job.
// It checks the email_sequence_schedule table and sends due emails.

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get all pending sequences
    const { data: schedules, error } = await supabase
      .from("email_sequence_schedule")
      .select("*")
      .is("completed_at", null);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    if (!schedules || schedules.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "No pending emails" }), {
        status: 200, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    if (!resendKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), {
        status: 500, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    let sentCount = 0;
    const now = Date.now();

    for (const schedule of schedules) {
      const startedAt = new Date(schedule.started_at).getTime();
      const daysSinceStart = Math.floor((now - startedAt) / (1000 * 60 * 60 * 24));
      const daysSent: number[] = schedule.days_sent || [];

      // Determine which sequence to use
      const sequence = schedule.sequence || "soap_opera";
      const maxDays = sequence === "soap_opera" ? 4 : 84;

      // Find the next email to send
      for (let day = 1; day <= maxDays; day++) {
        if (daysSent.includes(day)) continue;
        if (daysSinceStart < day) break;

        // This email is due! Call the email-sequence function
        try {
          const res = await fetch(`${supabaseUrl}/functions/v1/email-sequence`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseKey}`,
              apikey: supabaseKey,
            },
            body: JSON.stringify({
              email: schedule.email,
              sequence,
              day,
            }),
          });

          if (res.ok) {
            sentCount++;
            // Update the schedule
            const updatedDaysSent = [...daysSent, day];
            const isComplete = day >= maxDays;

            await supabase
              .from("email_sequence_schedule")
              .update({
                days_sent: updatedDaysSent,
                completed_at: isComplete ? new Date().toISOString() : null,
                updated_at: new Date().toISOString(),
              })
              .eq("id", schedule.id);
          }
        } catch (err) {
          console.error(`Failed to send day ${day} to ${schedule.email}:`, err);
        }

        // Only send one email per check (to avoid spamming)
        break;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      sent: sentCount,
      checked: schedules.length,
    }), {
      status: 200, headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});

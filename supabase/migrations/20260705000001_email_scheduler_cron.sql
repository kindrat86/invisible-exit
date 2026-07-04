-- ═══════════════════════════════════════════════════════════════
-- pg_cron trigger for email-sequence-scheduler Edge Function
-- DOTCOM SECRETS: Ch 7 & 12 — Follow-Up Funnels / Continuous Loop
--
-- Without this migration, the email-sequence-scheduler Edge Function
-- is NEVER triggered automatically. All 27 emails (Soap Opera, Seinfeld,
-- Win-back, Ascension) exist in code but never get sent because nothing
-- calls the scheduler.
--
-- This migration sets up a daily cron job at 9:00 AM UTC that invokes
-- the scheduler function, which then sends any due emails.
-- ═══════════════════════════════════════════════════════════════

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Get the Supabase project URL and anon key for the function invocation
-- These are set as environment variables in Supabase
DO $$
DECLARE
  project_url text;
  anon_key text;
BEGIN
  -- Try to get from current_setting (set by Supabase)
  BEGIN
    project_url := current_setting('app.project_url', true);
  EXCEPTION WHEN OTHERS THEN
    project_url := '';
  END;

  -- Schedule the email scheduler to run daily at 9:00 AM UTC
  -- This is the standard time for sending marketing emails
  -- Using net.http_post (pg_net extension) to invoke the edge function
  IF project_url != '' THEN
    PERFORM cron.schedule(
      'email-sequence-scheduler-daily',
      '0 9 * * *',
      $cron$
        SELECT net.http_post(
          url := current_setting('app.project_url') || '/functions/v1/email-sequence-scheduler',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
          ),
          body := jsonb_build_object()
        );
      $cron$
    );
    RAISE NOTICE 'Scheduled email-sequence-scheduler-daily';
  ELSE
    RAISE NOTICE 'app.project_url not set — skipping cron schedule. Set it manually: SELECT cron.schedule(...)';
  END IF;
END $$;

-- Also schedule the win-back sequence check (runs daily at 10:00 AM UTC)
-- This checks for newly cancelled subscribers and triggers the win-back flow
DO $$
DECLARE
  project_url text;
BEGIN
  BEGIN
    project_url := current_setting('app.project_url', true);
  EXCEPTION WHEN OTHERS THEN
    project_url := '';
  END;

  IF project_url != '' THEN
    PERFORM cron.schedule(
      'winback-sequence-check-daily',
      '0 10 * * *',
      $cron$
        SELECT net.http_post(
          url := current_setting('app.project_url') || '/functions/v1/email-sequence-scheduler',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
          ),
          body := jsonb_build_object(
            'check_winback', true
          )
        );
      $cron$
    );
    RAISE NOTICE 'Scheduled winback-sequence-check-daily';
  END IF;
END $$;

-- Enable pg_net extension for HTTP calls from cron
CREATE EXTENSION IF NOT EXISTS pg_net;

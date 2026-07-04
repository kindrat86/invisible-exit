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

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Step 2: Set the project URL and service role key as GUC parameters
-- that the cron job will read at execution time.
-- >>> YOU MUST REPLACE THESE PLACEHOLDERS BEFORE RUNNING <<<
ALTER DATABASE postgres SET app.project_url = 'https://maybpahtbbcxnucposjy.supabase.co';
-- Set the service role key after running this migration — see Step 5 below.

-- Step 3: Schedule the email scheduler (daily 9:00 AM UTC)
-- Unschedule any existing job with this name first (idempotent)
DO $$
BEGIN
  PERFORM cron.unschedule('email-sequence-scheduler-daily');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

PERFORM cron.schedule(
  'email-sequence-scheduler-daily',
  '0 9 * * *',
  $cron$
    SELECT net.http_post(
      url := current_setting('app.project_url', true) || '/functions/v1/email-sequence-scheduler',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
      ),
      body := jsonb_build_object()
    );
  $cron$
);

-- Step 4: Schedule the win-back check (daily 10:00 AM UTC)
DO $$
BEGIN
  PERFORM cron.unschedule('winback-sequence-check-daily');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

PERFORM cron.schedule(
  'winback-sequence-check-daily',
  '0 10 * * *',
  $cron$
    SELECT net.http_post(
      url := current_setting('app.project_url', true) || '/functions/v1/email-sequence-scheduler',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
      ),
      body := jsonb_build_object('check_winback', true)
    );
  $cron$
);

-- ───────────────────────────────────────────────────────────────
-- STEP 5: AFTER RUNNING THIS MIGRATION, run this ONE command in the
--         Supabase SQL Editor to set your service role key:
--
--   ALTER DATABASE postgres SET app.service_role_key = 'YOUR_KEY';
--
-- (Replace YOUR_KEY with your actual SUPABASE_SERVICE_ROLE_KEY from
--  Settings → API → service_role key. Without this, the cron job's
--  Authorization header will be empty and the edge function will
--  reject the call with 401.)
-- ───────────────────────────────────────────────────────────────

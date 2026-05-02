-- ─────────────────────────────────────────────────────────────────────────────
-- Payment Reminder Cron Schedule
-- Run this in Supabase SQL Editor AFTER deploying the edge function.
--
-- Replace the two placeholders before running:
--   <project-ref>  → your Supabase project reference (e.g. ozzqkncnrtxvabbddzwd)
--   <anon-key>     → your NEXT_PUBLIC_SUPABASE_ANON_KEY value
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Enable required extensions (safe to re-run)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Schedule the edge function to run every day at 09:00 UTC
--    Cron syntax: minute hour day month weekday
SELECT cron.schedule(
  'send-payment-reminders',       -- unique job name
  '0 9 * * *',                    -- every day at 09:00 UTC
  $$
  SELECT net.http_post(
    url     := 'https://<project-ref>.supabase.co/functions/v1/send-payment-reminders',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer <anon-key>'
    ),
    body    := jsonb_build_object('triggered_by', 'pg_cron', 'time', now()::text)
  );
  $$
);

-- ─── Useful management queries ────────────────────────────────────────────────

-- View all scheduled jobs:
-- SELECT * FROM cron.job;

-- View recent run history:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;

-- Remove the job if needed:
-- SELECT cron.unschedule('send-payment-reminders');

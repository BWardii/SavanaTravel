-- Add last_notified_at to track when a payment reminder was last sent
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS last_notified_at TIMESTAMPTZ;

-- Allow the service role (Edge Function) to update this column
-- (already covered by the existing authenticated update policy)

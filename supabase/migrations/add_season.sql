-- Isolate 2026 / 2027 bookings without touching existing 2026 records.
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS season integer NOT NULL DEFAULT 2026;

UPDATE public.customers
SET season = 2026
WHERE season IS NULL;

CREATE INDEX IF NOT EXISTS idx_customers_season
  ON public.customers (season);

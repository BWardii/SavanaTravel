-- Add amount_paid for partial payment tracking
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(10,2) DEFAULT 0;

-- Expand status to include 'Partial'
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS customers_status_check;
ALTER TABLE public.customers
  ADD CONSTRAINT customers_status_check
  CHECK (status IN ('Pending', 'Partial', 'Paid'));

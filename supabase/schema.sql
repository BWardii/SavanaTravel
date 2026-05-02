-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Customers ────────────────────────────────────────────────────────────────
create table if not exists public.customers (
  id                uuid        default uuid_generate_v4() primary key,
  name              text        not null,
  email             text        not null,
  dob               date        not null,
  destination       text        not null,
  departure_date    date,
  return_date       date,
  num_travelers     integer     default 1,
  special_requests  text,
  phone             text,
  -- Passport / travel document
  nationality       text,
  passport_number   text,
  passport_expiry   date,
  -- Pricing & admin
  flight_price      numeric(10, 2),
  payment_due_date  date,
  status            text        not null default 'Pending'
                    check (status in ('Pending', 'Paid')),
  created_at        timestamptz not null default now()
);

alter table public.customers enable row level security;

create policy "Allow public insert"        on public.customers for insert with check (true);
create policy "Allow authenticated read"   on public.customers for select using (auth.role() = 'authenticated');
create policy "Allow authenticated update" on public.customers for update using (auth.role() = 'authenticated');

create index if not exists idx_customers_email            on public.customers (email);
create index if not exists idx_customers_payment_due_date on public.customers (payment_due_date);
create index if not exists idx_customers_status           on public.customers (status);

-- ─── Travellers (additional party members) ────────────────────────────────────
create table if not exists public.travellers (
  id               uuid        default uuid_generate_v4() primary key,
  customer_id      uuid        not null references public.customers(id) on delete cascade,
  name             text        not null,
  dob              date        not null,
  nationality      text        not null,
  passport_number  text        not null,
  passport_expiry  date        not null,
  created_at       timestamptz not null default now()
);

alter table public.travellers enable row level security;

create policy "Allow public insert travellers"        on public.travellers for insert with check (true);
create policy "Allow authenticated read travellers"   on public.travellers for select using (auth.role() = 'authenticated');

create index if not exists idx_travellers_customer_id on public.travellers (customer_id);

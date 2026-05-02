# Savana Travel — Luxury Travel Agency Dashboard

A full-stack travel agency management platform built with Next.js, Supabase, and shadcn/ui.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui
- **Backend/Auth**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Forms**: React Hook Form + Zod
- **Email**: Resend
- **Animations**: Framer Motion
- **Tables**: TanStack Table v8

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── onboard/
│   │   ├── page.tsx              # Multi-step onboarding form
│   │   └── success/page.tsx      # Submission confirmation
│   ├── admin/
│   │   ├── page.tsx              # Protected dashboard (SSR)
│   │   └── login/page.tsx        # Manager login
│   └── api/
│       └── onboard/route.ts      # Public form submission API
├── components/
│   ├── onboard/                  # Multi-step form components
│   └── admin/                    # Dashboard components
├── lib/
│   ├── schemas.ts                # Zod validation schemas
│   └── supabase/
│       ├── client.ts             # Browser client
│       └── server.ts             # Server client (RSC)
├── proxy.ts                      # Auth protection proxy
└── types/index.ts                # Shared TypeScript types

supabase/
├── schema.sql                    # Database schema
└── functions/
    └── payment-reminder/         # Deno Edge Function
        └── index.ts
```

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL Editor, run the contents of `supabase/schema.sql` to create the `customers` table and RLS policies.
3. Enable Email auth under **Authentication → Providers → Email**.
4. Create an admin user under **Authentication → Users**.

### 2. Configure Environment Variables

Copy `.env.local` and fill in your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=re_your_resend_key
```

All keys are found in your Supabase project: **Settings → API**.

### 3. Run the Development Server

```bash
cd savana-travel
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Public landing page |
| `/onboard` | 3-step customer enquiry form |
| `/onboard/success` | Submission confirmation |
| `/admin/login` | Manager authentication |
| `/admin` | Protected dashboard (requires login) |

## Edge Function — Payment Reminders

The `supabase/functions/payment-reminder` function:
- Queries for all `Pending` customers where `payment_due_date` is exactly 3 days away
- Sends a branded HTML reminder email via Resend
- Designed to run on a **daily cron** schedule

### Deploy the Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Set secrets
supabase secrets set RESEND_API_KEY=re_your_key

# Deploy
supabase functions deploy payment-reminder

# Schedule via pg_cron (run in Supabase SQL Editor):
select cron.schedule(
  'daily-payment-reminders',
  '0 9 * * *',  -- 9am UTC daily
  $$
    select net.http_post(
      url := 'https://your-project.supabase.co/functions/v1/payment-reminder',
      headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb
    )
  $$
);
```

## Admin Dashboard Features

- **Stats overview** — Total, Pending, and Paid enquiry counts
- **Searchable & sortable** data table (TanStack Table)
- **Row click → Edit dialog** — Update `flight_price`, `payment_due_date`, and `status`
- **Sign out** with session cleanup

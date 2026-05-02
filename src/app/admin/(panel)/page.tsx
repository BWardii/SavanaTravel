import { createClient as createAdminClient } from "@supabase/supabase-js";
import type { Customer } from "@/types";
import { OverviewClient } from "@/components/admin/overview-client";

// Always fetch fresh — never serve a cached snapshot
export const dynamic = "force-dynamic";
export const metadata = { title: "Overview — Savana Manager" };

export default async function OverviewPage() {
  const client = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await client
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  const customers: Customer[] = (error || !data) ? [] : (data as Customer[]);

  const now = Date.now();

  const total   = customers.length;
  const pending = customers.filter((c) => c.status === "Pending").length;
  const paid    = customers.filter((c) => c.status === "Paid").length;
  const overdue = customers.filter((c) => {
    if (!c.payment_due_date || c.status === "Paid") return false;
    return new Date(c.payment_due_date).getTime() < now;
  }).length;
  const revenue = customers
    .filter((c) => c.status === "Paid" && c.flight_price)
    .reduce((sum, c) => sum + (c.flight_price ?? 0), 0);

  // Due within 7 days (includes overdue)
  const dueSoon = customers.filter((c) => {
    if (!c.payment_due_date || c.status === "Paid") return false;
    const days = Math.ceil((new Date(c.payment_due_date).getTime() - now) / 86400000);
    return days <= 7;
  });

  const recent = customers.slice(0, 5);

  return (
    <OverviewClient
      stats={{ total, pending, paid, overdue, revenue }}
      recent={recent}
      dueSoon={dueSoon}
    />
  );
}

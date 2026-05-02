import { createClient as createAdminClient } from "@supabase/supabase-js";
import type { Customer } from "@/types";
import { OverviewClient } from "@/components/admin/overview-client";

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

  const total       = customers.length;
  const pending     = customers.filter((c) => c.status === "Pending" || c.status === "Partial").length;
  const paid        = customers.filter((c) => c.status === "Paid").length;
  const overdue     = customers.filter((c) => {
    if (!c.payment_due_date || c.status === "Paid") return false;
    return new Date(c.payment_due_date).getTime() < now;
  }).length;

  const collected   = customers.reduce((s, c) => s + (c.amount_paid ?? 0), 0);
  const outstanding = customers
    .filter((c) => c.status !== "Paid")
    .reduce((s, c) => s + Math.max(0, (c.flight_price ?? 0) - (c.amount_paid ?? 0)), 0);

  const dueSoon = customers.filter((c) => {
    if (!c.payment_due_date || c.status === "Paid") return false;
    const days = Math.ceil((new Date(c.payment_due_date).getTime() - now) / 86400000);
    return days <= 7;
  });

  return (
    <OverviewClient
      stats={{ total, pending, paid, overdue, collected, outstanding }}
      recent={customers.slice(0, 5)}
      dueSoon={dueSoon}
      allCustomers={customers}
    />
  );
}

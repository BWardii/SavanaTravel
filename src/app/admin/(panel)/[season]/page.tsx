import { notFound } from "next/navigation";
import { isSeason, parseSeason } from "@/lib/season";
import { fetchCustomers } from "@/lib/supabase/admin-data";
import type { Customer } from "@/types";
import { OverviewClient } from "@/components/admin/overview-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  return { title: `Overview ${season} — Savana Manager` };
}

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season: raw } = await params;
  if (!isSeason(raw)) notFound();
  const season = parseSeason(raw);

  const customers: Customer[] = await fetchCustomers(season);
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

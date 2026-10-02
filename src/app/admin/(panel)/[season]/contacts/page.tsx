import { notFound } from "next/navigation";
import { isSeason, parseSeason } from "@/lib/season";
import { fetchCustomers } from "@/lib/supabase/admin-data";
import { ContactsClient } from "@/components/admin/contacts-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  return { title: `Contacts ${season} — Savana Manager` };
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season: raw } = await params;
  if (!isSeason(raw)) notFound();
  const season = parseSeason(raw);
  const customers = await fetchCustomers(season, { withTravellers: true, orderBy: "name" });
  return <ContactsClient customers={customers} isDemo={false} />;
}

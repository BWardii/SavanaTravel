import { notFound } from "next/navigation";
import { isSeason, parseSeason } from "@/lib/season";
import { fetchCustomers } from "@/lib/supabase/admin-data";
import { EnquiriesClient } from "@/components/admin/enquiries-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  return { title: `Enquiries ${season} — Savana Manager` };
}

export default async function EnquiriesPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season: raw } = await params;
  if (!isSeason(raw)) notFound();
  const season = parseSeason(raw);
  const customers = await fetchCustomers(season);
  return <EnquiriesClient customers={customers} isDemo={false} />;
}

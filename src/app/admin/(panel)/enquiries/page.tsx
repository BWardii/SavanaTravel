import { createClient as createAdminClient } from "@supabase/supabase-js";
import type { Customer } from "@/types";
import { EnquiriesClient } from "@/components/admin/enquiries-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enquiries — Savana Manager" };

export default async function EnquiriesPage() {
  const client = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await client
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  const customers: Customer[] = (data as Customer[]) ?? [];
  return <EnquiriesClient customers={customers} isDemo={false} />;
}

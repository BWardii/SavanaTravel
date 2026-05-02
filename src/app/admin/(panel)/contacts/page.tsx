import { createClient as createAdminClient } from "@supabase/supabase-js";
import type { Customer } from "@/types";
import { ContactsClient } from "@/components/admin/contacts-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contacts — Savana Manager" };

export default async function ContactsPage() {
  const client = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await client
    .from("customers")
    .select("*, travellers(*)")
    .order("name", { ascending: true });

  const customers: Customer[] = (data as Customer[]) ?? [];
  return <ContactsClient customers={customers} isDemo={false} />;
}

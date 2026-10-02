import { createClient } from "@supabase/supabase-js";
import type { Customer } from "@/types";
import type { Season } from "@/lib/season";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function fetchCustomers(
  season: Season,
  opts: { withTravellers?: boolean; orderBy?: "created_at" | "name" } = {}
): Promise<Customer[]> {
  const { withTravellers = false, orderBy = "created_at" } = opts;
  const client = createAdminClient();
  const ascending = orderBy === "name";
  const select = withTravellers ? "*, travellers(*)" : "*";

  const query = client
    .from("customers")
    .select(select)
    .eq("season", season)
    .order(orderBy, { ascending });

  const { data, error } = await query;

  if (!error) return (data as unknown as Customer[]) ?? [];

  // Before the season column exists, keep serving the original 2026 records.
  if (season === 2026) {
    const fallback = await client
      .from("customers")
      .select(select)
      .order(orderBy, { ascending });
    return (fallback.data as unknown as Customer[]) ?? [];
  }

  return [];
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SeasonShell } from "@/components/admin/season-shell";

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http") &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail = "demo@savanatravel.com";

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/admin/login");
    userEmail = user.email ?? "";
  }

  return <SeasonShell userEmail={userEmail}>{children}</SeasonShell>;
}

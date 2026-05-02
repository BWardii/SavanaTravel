import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/sidebar";

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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userEmail={userEmail} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}

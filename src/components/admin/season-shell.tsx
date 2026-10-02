"use client";

import { usePathname } from "next/navigation";
import { parseSeason } from "@/lib/season";
import { SeasonProvider } from "@/contexts/season-context";
import { Sidebar } from "@/components/admin/sidebar";
import { cn } from "@/lib/utils";

export function SeasonShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const season = parseSeason(pathname.split("/")[2]);
  const is2027 = season === 2027;

  return (
    <SeasonProvider season={season}>
      <div
        data-season={season}
        className={cn("flex min-h-screen", is2027 ? "bg-amber-50" : "bg-slate-50")}
      >
        <Sidebar userEmail={userEmail} season={season} />
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </div>
    </SeasonProvider>
  );
}

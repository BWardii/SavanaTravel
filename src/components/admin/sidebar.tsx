"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { adminPath, switchAdminSeason, type Season } from "@/lib/season";

const NAV = [
  {
    rest: "",
    label: "Overview",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="8.5" y="1" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="1" y="8.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="8.5" y="8.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    rest: "/enquiries",
    label: "Enquiries",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4 5h7M4 7.5h7M4 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    rest: "/contacts",
    label: "Contacts",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1.5 13.5c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    rest: "/manual-entry",
    label: "Manual Entry",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7.5 4.5v6M4.5 7.5h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

interface SidebarProps {
  userEmail: string;
  season: Season;
}

export function Sidebar({ userEmail, season }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const is2027 = season === 2027;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "w-56 shrink-0 flex flex-col border-r min-h-screen",
        is2027 ? "border-yellow-200 bg-[#FFFEF5]" : "border-slate-200 bg-white"
      )}
    >
      <div className={cn("px-6 py-5 border-b", is2027 ? "border-yellow-100" : "border-slate-100")}>
        <Link href="/" className={cn("font-semibold tracking-tight", is2027 ? "text-yellow-950" : "text-slate-900")}>
          Savana Travel
        </Link>
        <p className={cn("text-xs mt-0.5", is2027 ? "text-yellow-700" : "text-slate-400")}>
          Manager Portal
        </p>
      </div>

      <div className={cn("px-3 py-4 border-b", is2027 ? "border-yellow-100" : "border-slate-100")}>
        <p className={cn("px-1 mb-2 text-[10px] font-semibold uppercase tracking-widest", is2027 ? "text-yellow-700" : "text-slate-400")}>
          Season
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {([2026, 2027] as const).map((year) => {
            const active = season === year;
            return (
              <Link
                key={year}
                href={switchAdminSeason(pathname, year)}
                className={cn(
                  "rounded-lg px-2 py-2.5 text-center text-sm font-semibold border transition-colors",
                  year === 2026 && active && "bg-slate-900 text-white border-slate-900",
                  year === 2026 && !active && "bg-white text-slate-600 border-slate-200 hover:border-slate-400",
                  year === 2027 && active && "bg-yellow-400 text-yellow-950 border-yellow-500",
                  year === 2027 && !active && "bg-white text-yellow-800 border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50"
                )}
              >
                {year}
              </Link>
            );
          })}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ rest, label, icon }) => {
          const href = adminPath(season, rest);
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors",
                isActive && is2027 && "bg-yellow-100 text-yellow-900 font-medium",
                isActive && !is2027 && "bg-indigo-50 text-indigo-700 font-medium",
                !isActive && is2027 && "text-yellow-900/70 hover:bg-yellow-50 hover:text-yellow-950",
                !isActive && !is2027 && "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className={cn(
                isActive && is2027 && "text-yellow-700",
                isActive && !is2027 && "text-indigo-600",
                !isActive && "text-slate-400"
              )}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className={cn("px-6 py-5 border-t space-y-3", is2027 ? "border-yellow-100" : "border-slate-100")}>
        <p className={cn("text-xs truncate", is2027 ? "text-yellow-700" : "text-slate-400")}>{userEmail}</p>
        <button
          onClick={handleLogout}
          className={cn(
            "text-xs transition-colors",
            is2027 ? "text-yellow-700 hover:text-yellow-950" : "text-slate-400 hover:text-slate-700"
          )}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

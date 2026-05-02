"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  {
    href: "/admin",
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
    href: "/admin/enquiries",
    label: "Enquiries",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4 5h7M4 7.5h7M4 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/admin/contacts",
    label: "Contacts",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1.5 13.5c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

interface SidebarProps {
  userEmail: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-slate-200 bg-white min-h-screen">

      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-100">
        <Link href="/" className="font-semibold text-slate-900 tracking-tight">
          Savana Travel
        </Link>
        <p className="text-xs text-slate-400 mt-0.5">Manager Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className={cn(isActive ? "text-indigo-600" : "text-slate-400")}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-slate-100 space-y-3">
        <p className="text-xs text-slate-400 truncate">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

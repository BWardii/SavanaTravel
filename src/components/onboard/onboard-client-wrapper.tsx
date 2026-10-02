"use client";

import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "./language-switcher";
import { OnboardingForm } from "./onboarding-form";
import { cn } from "@/lib/utils";
import type { Season } from "@/lib/season";

function PageContent({ season }: { season: Season }) {
  const { t } = useLanguage();
  const is2027 = season === 2027;

  return (
    <div className={cn("min-h-screen", is2027 ? "bg-[#FFFBEB]" : "bg-[#FAF8F4]")}>
      <header
        className={cn(
          "border-b sticky top-0 z-20 backdrop-blur-sm",
          is2027 ? "border-yellow-200 bg-[#FFFBEB]/95" : "border-[#E8E2D9] bg-[#FAF8F4]/95"
        )}
      >
        <div className="mx-auto max-w-2xl px-5 h-14 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className={cn("font-serif text-xl tracking-wide font-medium", is2027 ? "text-yellow-950" : "text-[#1C1917]")}>
              Savana<span className={is2027 ? "text-yellow-600" : "text-[#8B7355]"}>Travel</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-[10px] font-bold tracking-[0.18em] uppercase rounded px-2 py-1",
                is2027 ? "bg-yellow-400 text-yellow-950" : "text-[#9C8B7E] hidden sm:block"
              )}
            >
              {is2027 ? "2027 Season" : t.headerLabel}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className={cn("px-5 py-5 lg:hidden", is2027 ? "bg-yellow-400" : "bg-[#1C1917]")}>
        <h1 className={cn("font-serif font-light text-2xl leading-snug", is2027 ? "text-yellow-950" : "text-white")}>
          {t.pageTitle}
        </h1>
        {is2027 && (
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-900 mt-1">2027 bookings</p>
        )}
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 lg:py-14 lg:max-w-5xl lg:px-8 lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
        <aside className="hidden lg:block pt-2">
          <span
            className={cn(
              "inline-block text-[10px] font-bold uppercase tracking-widest rounded px-2 py-1 mb-5",
              is2027 ? "bg-yellow-400 text-yellow-950" : "text-[#9C8B7E]"
            )}
          >
            {is2027 ? "2027 Season" : "2026 Season"}
          </span>
          <h1 className={cn("font-serif font-light text-4xl leading-tight mb-10", is2027 ? "text-yellow-950" : "text-[#1C1917]")}>
            {t.pageTitle}
          </h1>

          <p className={cn("text-xs tracking-[0.2em] uppercase mb-6", is2027 ? "text-yellow-700" : "text-[#9C8B7E]")}>
            {t.sidebarProcess}
          </p>
          <div className="space-y-8">
            {t.sidebarSteps.map(({ label, desc }, i) => (
              <div key={i} className="flex gap-4">
                <span className={cn("font-serif text-sm mt-0.5 shrink-0", is2027 ? "text-yellow-500" : "text-[#C4B49A]")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className={cn("text-sm font-medium", is2027 ? "text-yellow-950" : "text-[#1C1917]")}>{label}</p>
                  <p className={cn("text-xs mt-0.5 leading-relaxed", is2027 ? "text-yellow-700" : "text-[#9C8B7E]")}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={cn("mt-16 pt-8 border-t", is2027 ? "border-yellow-200" : "border-[#E8E2D9]")}>
            <p className={cn("text-xs leading-relaxed", is2027 ? "text-yellow-700" : "text-[#9C8B7E]")}>{t.sidebarNote}</p>
          </div>
        </aside>

        <div className="w-full">
          <div className="lg:hidden mb-4 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {t.sidebarSteps.map(({ label }, i) => (
              <div key={i} className="flex items-center gap-1.5 shrink-0">
                <span className={cn("font-serif text-xs", is2027 ? "text-yellow-500" : "text-[#C4B49A]")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn("text-xs", is2027 ? "text-yellow-800" : "text-[#6B5E52]")}>{label}</span>
                {i < t.sidebarSteps.length - 1 && (
                  <span className={cn("text-xs ml-1", is2027 ? "text-yellow-300" : "text-[#D4CAC0]")}>›</span>
                )}
              </div>
            ))}
          </div>

          <div
            className={cn(
              "bg-white p-5 sm:p-8 rounded-lg lg:rounded-none lg:p-10 border",
              is2027 ? "border-yellow-200" : "border-[#E8E2D9]"
            )}
          >
            <OnboardingForm season={season} />
          </div>

          <div className="lg:hidden mt-6 px-1 pb-8">
            <p className={cn("text-xs leading-relaxed border-t pt-4", is2027 ? "text-yellow-700 border-yellow-200" : "text-[#9C8B7E] border-[#E8E2D9]")}>
              {t.sidebarNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnboardClientWrapper({ season = 2026 }: { season?: Season }) {
  return (
    <LanguageProvider>
      <PageContent season={season} />
    </LanguageProvider>
  );
}

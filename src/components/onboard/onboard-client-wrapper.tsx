"use client";

import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "./language-switcher";
import { OnboardingForm } from "./onboarding-form";

function PageContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAF8F4]">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-[#E8E2D9] bg-[#FAF8F4]/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto max-w-2xl px-5 h-14 flex items-center justify-between gap-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-serif text-xl tracking-wide text-[#1C1917] font-medium">
              Savana<span className="text-[#8B7355]">Travel</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.18em] uppercase text-[#9C8B7E] hidden sm:block">
              {t.headerLabel}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* ── Hero banner (mobile) ────────────────────────────────────────────── */}
      <div className="bg-[#1C1917] px-5 py-5 lg:hidden">
        <h1 className="font-serif font-light text-2xl text-white leading-snug">
          {t.pageTitle}
        </h1>
        <p className="text-xs text-[#9C8B7E] mt-1">{t.privacy}</p>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-4 py-6 lg:py-14 lg:max-w-5xl lg:px-8 lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">

        {/* Left sidebar — desktop only */}
        <aside className="hidden lg:block pt-2">
          <h1 className="font-serif font-light text-4xl text-[#1C1917] leading-tight mb-10">
            {t.pageTitle}
          </h1>

          <p className="text-xs tracking-[0.2em] uppercase text-[#9C8B7E] mb-6">
            {t.sidebarProcess}
          </p>
          <div className="space-y-8">
            {t.sidebarSteps.map(({ label, desc }, i) => (
              <div key={i} className="flex gap-4">
                <span className="font-serif text-sm text-[#C4B49A] mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium text-[#1C1917]">{label}</p>
                  <p className="text-xs text-[#9C8B7E] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-[#E8E2D9]">
            <p className="text-xs text-[#9C8B7E] leading-relaxed">{t.sidebarNote}</p>
          </div>
        </aside>

        {/* Form card */}
        <div className="w-full">
          {/* Mobile: process steps collapsed strip */}
          <div className="lg:hidden mb-4 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {t.sidebarSteps.map(({ label }, i) => (
              <div key={i} className="flex items-center gap-1.5 shrink-0">
                <span className="font-serif text-xs text-[#C4B49A]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-[#6B5E52]">{label}</span>
                {i < t.sidebarSteps.length - 1 && (
                  <span className="text-[#D4CAC0] text-xs ml-1">›</span>
                )}
              </div>
            ))}
          </div>

          {/* The form itself — no extra outer padding on mobile */}
          <div className="border border-[#E8E2D9] bg-white p-5 sm:p-8 rounded-lg lg:rounded-none lg:p-10">
            <OnboardingForm />
          </div>

          <p className="text-xs text-[#9C8B7E] mt-4 px-1 lg:px-0">{t.privacy}</p>

          {/* Mobile: sidebar note at bottom */}
          <div className="lg:hidden mt-6 px-1 pb-8">
            <p className="text-xs text-[#9C8B7E] leading-relaxed border-t border-[#E8E2D9] pt-4">
              {t.sidebarNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnboardClientWrapper() {
  return (
    <LanguageProvider>
      <PageContent />
    </LanguageProvider>
  );
}

"use client";

import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "./language-switcher";
import { OnboardingForm } from "./onboarding-form";

function PageContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <header className="border-b border-[#E8E2D9] bg-[#FAF8F4]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-8 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="font-serif text-lg tracking-wide text-[#1C1917] shrink-0">
            Savana
          </Link>
          <span className="text-xs tracking-[0.2em] uppercase text-[#9C8B7E] hidden sm:block">
            {t.headerLabel}
          </span>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">

        {/* Left sidebar */}
        <aside className="hidden lg:block pt-2">
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

        {/* Form */}
        <div>
          <div className="mb-10">
            <h1 className="font-serif font-light text-4xl text-[#1C1917] leading-tight">
              {t.pageTitle}
            </h1>
          </div>

          <div className="border border-[#E8E2D9] bg-white p-8 sm:p-10">
            <OnboardingForm />
          </div>

          <p className="text-xs text-[#9C8B7E] mt-5">{t.privacy}</p>
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

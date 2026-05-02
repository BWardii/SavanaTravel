"use client";

import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "en" as const, flag: "🇬🇧", label: "English" },
  { code: "so" as const, flag: "🇸🇴", label: "Somali" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/60 border border-[#E8E2D9] rounded-full px-1.5 py-1">
      {LOCALES.map(({ code, flag, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          title={label}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200",
            locale === code
              ? "bg-[#1C1917] text-white shadow-sm"
              : "text-[#9C8B7E] hover:text-[#1C1917] hover:bg-[#F5F0E8]"
          )}
        >
          <span className="text-sm leading-none">{flag}</span>
          <span className="hidden sm:inline tracking-wide">{label}</span>
        </button>
      ))}
    </div>
  );
}

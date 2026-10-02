import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Season } from "@/lib/season";

export function OnboardSuccess({ season = 2026 }: { season?: Season }) {
  const is2027 = season === 2027;

  return (
    <div className={cn("min-h-screen flex flex-col", is2027 ? "bg-[#FFFBEB]" : "bg-[#FAF8F4]")}>
      <header className={cn("border-b", is2027 ? "border-yellow-200" : "border-[#E8E2D9]")}>
        <div className="mx-auto max-w-5xl px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className={cn("font-serif text-lg tracking-wide", is2027 ? "text-yellow-950" : "text-[#1C1917]")}
          >
            Savana
          </Link>
          {is2027 && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-yellow-400 text-yellow-950 rounded px-2 py-1">
              2027 Season
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-md w-full">
          <div className={cn("border-l-2 pl-8 mb-10", is2027 ? "border-yellow-400" : "border-[#8B7355]")}>
            <p className={cn("text-xs tracking-[0.2em] uppercase mb-4", is2027 ? "text-yellow-700" : "text-[#9C8B7E]")}>
              Enquiry Received{is2027 ? " · 2027" : ""}
            </p>
            <h1 className={cn("font-serif font-light text-4xl leading-tight mb-4", is2027 ? "text-yellow-950" : "text-[#1C1917]")}>
              We&apos;ll be in<br />touch shortly.
            </h1>
            <p className={cn("leading-relaxed text-sm", is2027 ? "text-yellow-800" : "text-[#6B5E52]")}>
              Your travel consultant will review your request and contact you
              within <strong className={is2027 ? "text-yellow-950" : "text-[#1C1917]"}>one business day</strong> with
              a personalised quote and itinerary options.
            </p>
          </div>

          <div className={cn("border p-6 mb-8", is2027 ? "border-yellow-200 bg-white" : "border-[#E8E2D9]")}>
            <p className={cn("text-xs tracking-[0.15em] uppercase mb-4", is2027 ? "text-yellow-700" : "text-[#9C8B7E]")}>What to expect</p>
            <ul className="space-y-3">
              {[
                "A personalised response within 24 hours",
                "Detailed flight pricing for your route",
                "Curated accommodation recommendations",
              ].map((item) => (
                <li key={item} className={cn("flex items-start gap-3 text-sm", is2027 ? "text-yellow-800" : "text-[#6B5E52]")}>
                  <span className={cn("mt-0.5 shrink-0", is2027 ? "text-yellow-500" : "text-[#8B7355]")}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Link href="/">
            <Button
              variant="outline"
              className={cn(
                "rounded-none h-10 px-6 text-sm tracking-wide transition-all",
                is2027
                  ? "border-yellow-500 text-yellow-950 hover:bg-yellow-400 hover:text-yellow-950"
                  : "border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white"
              )}
            >
              Return to homepage
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

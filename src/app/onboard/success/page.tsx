import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Enquiry Received — Savana Travel",
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col">
      <header className="border-b border-[#E8E2D9]">
        <div className="mx-auto max-w-5xl px-8 h-14 flex items-center">
          <Link href="/" className="font-serif text-lg tracking-wide text-[#1C1917]">
            Savana
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-md w-full">
          <div className="border-l-2 border-[#8B7355] pl-8 mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-[#9C8B7E] mb-4">Enquiry Received</p>
            <h1 className="font-serif font-light text-4xl text-[#1C1917] leading-tight mb-4">
              We&apos;ll be in<br />touch shortly.
            </h1>
            <p className="text-[#6B5E52] leading-relaxed text-sm">
              Your travel consultant will review your request and contact you
              within <strong className="text-[#1C1917]">one business day</strong> with
              a personalised quote and itinerary options.
            </p>
          </div>

          <div className="border border-[#E8E2D9] p-6 mb-8">
            <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7E] mb-4">What to expect</p>
            <ul className="space-y-3">
              {[
                "A personalised response within 24 hours",
                "Detailed flight pricing for your route",
                "Curated accommodation recommendations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#6B5E52]">
                  <span className="text-[#8B7355] mt-0.5 shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Link href="/">
            <Button
              variant="outline"
              className="rounded-none border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white h-10 px-6 text-sm tracking-wide transition-all"
            >
              Return to homepage
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

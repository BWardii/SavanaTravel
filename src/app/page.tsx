import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1C1917]">

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FAF8F4]/90 backdrop-blur-sm border-b border-[#E8E2D9]">
        <div className="mx-auto max-w-6xl px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-wide text-[#1C1917]">
            Savana
          </Link>
          <div className="hidden sm:flex items-center gap-10 text-sm text-[#6B5E52]">
            <Link href="#" className="hover:text-[#1C1917] transition-colors">Destinations</Link>
            <Link href="#" className="hover:text-[#1C1917] transition-colors">Services</Link>
            <Link href="#" className="hover:text-[#1C1917] transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-sm text-[#6B5E52] hover:text-[#1C1917] transition-colors hidden sm:block">
              Manager
            </Link>
            <Link href="/onboard">
              <Button className="bg-[#1C1917] hover:bg-[#2D2520] text-white text-sm rounded-none h-9 px-5 tracking-wide">
                Plan a Journey
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-0 px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-12 pb-16 border-b border-[#E8E2D9]">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#9C8B7E] mb-8 font-sans">
                Est. 2019 — Luxury Travel
              </p>
              <h1 className="font-serif font-light text-[clamp(3.5rem,8vw,7rem)] leading-[0.95] tracking-tight text-[#1C1917]">
                The world,<br />
                <em className="not-italic text-[#8B7355]">unhurried.</em>
              </h1>
            </div>
            <div className="max-w-xs pb-2">
              <p className="text-base text-[#6B5E52] leading-relaxed font-sans">
                We craft journeys for those who believe travel is an art form —
                not a transaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations strip */}
      <section className="px-8 py-0 border-b border-[#E8E2D9]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E8E2D9]">
            {[
              { place: "Kyoto", region: "Japan", tag: "Cultural" },
              { place: "Amalfi", region: "Italy", tag: "Coastal" },
              { place: "Serengeti", region: "Tanzania", tag: "Safari" },
              { place: "Maldives", region: "Indian Ocean", tag: "Retreat" },
            ].map(({ place, region, tag }) => (
              <div key={place} className="px-6 py-8 first:pl-0 last:pr-0 group cursor-pointer">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#9C8B7E] mb-3">{tag}</p>
                <p className="font-serif text-2xl text-[#1C1917] group-hover:text-[#8B7355] transition-colors">{place}</p>
                <p className="text-xs text-[#9C8B7E] mt-1">{region}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-8 py-28">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#9C8B7E] mb-6">Our Approach</p>
            <h2 className="font-serif font-light text-5xl leading-tight text-[#1C1917] mb-8">
              Every detail,<br />considered.
            </h2>
            <p className="text-[#6B5E52] leading-relaxed mb-6">
              We don&apos;t believe in packages. Each journey begins with a
              conversation — your pace, your preferences, your idea of
              extraordinary. We handle the rest.
            </p>
            <p className="text-[#6B5E52] leading-relaxed mb-10">
              From the moment you enquire to the morning you return, a single
              dedicated consultant holds every thread of your trip.
            </p>
            <Link href="/onboard">
              <Button variant="outline" className="rounded-none border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white h-10 px-6 text-sm tracking-wide transition-all">
                Begin your enquiry
              </Button>
            </Link>
          </div>

          {/* Stats column */}
          <div className="grid grid-cols-2 gap-px bg-[#E8E2D9] border border-[#E8E2D9]">
            {[
              { n: "200+", label: "Destinations" },
              { n: "24/7", label: "Concierge" },
              { n: "98%", label: "Return clients" },
              { n: "15+", label: "Years expertise" },
            ].map(({ n, label }) => (
              <div key={label} className="bg-[#FAF8F4] px-8 py-10">
                <p className="font-serif text-4xl text-[#1C1917] mb-2">{n}</p>
                <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7E]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services — typographic list, no icon boxes */}
      <section className="px-8 py-0 border-t border-[#E8E2D9]">
        <div className="mx-auto max-w-6xl">
          {[
            {
              num: "01",
              title: "Bespoke Itineraries",
              desc: "No two journeys alike. We build your trip from scratch around your exact preferences — accommodation, pacing, local guides.",
            },
            {
              num: "02",
              title: "Private Flight Coordination",
              desc: "First-class, business, or private charter. We handle seat selection, transfers, and every connection in between.",
            },
            {
              num: "03",
              title: "Full Financial Protection",
              desc: "ATOL-protected bookings with comprehensive travel insurance included as standard on every package.",
            },
          ].map(({ num, title, desc }, i, arr) => (
            <div
              key={num}
              className={`grid grid-cols-[4rem_1fr_1fr] items-start gap-8 py-10 ${i < arr.length - 1 ? "border-b border-[#E8E2D9]" : ""}`}
            >
              <span className="font-serif text-sm text-[#C4B49A] pt-1">{num}</span>
              <h3 className="font-serif text-xl text-[#1C1917]">{title}</h3>
              <p className="text-sm text-[#6B5E52] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — editorial dark strip, not rounded gradient blob */}
      <section className="px-8 py-0 mt-28">
        <div className="mx-auto max-w-6xl bg-[#1C1917] px-12 py-16 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#9C8B7E] mb-4">Ready to travel?</p>
            <h2 className="font-serif font-light text-4xl sm:text-5xl text-white leading-tight">
              Tell us where<br />you want to go.
            </h2>
          </div>
          <Link href="/onboard">
            <Button className="bg-[#FAF8F4] hover:bg-white text-[#1C1917] rounded-none h-11 px-8 text-sm tracking-wide font-medium shrink-0">
              Start your enquiry
            </Button>
          </Link>
        </div>
      </section>

      <footer className="px-8 py-10 mt-16 border-t border-[#E8E2D9]">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-serif text-lg text-[#1C1917]">Savana</span>
          <p className="text-xs text-[#9C8B7E]">
            © {new Date().getFullYear()} Savana Travel Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

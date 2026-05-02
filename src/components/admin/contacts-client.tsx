"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Customer, Traveller } from "@/types";
import { format } from "date-fns";
import { Search, Mail, MapPin, CalendarDays, BookOpen, Globe, Users, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactsClientProps {
  customers: Customer[];
  isDemo: boolean;
}

function PassportRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-medium text-slate-700 font-mono">{value}</span>
    </div>
  );
}

function TravellerCard({ t, index }: { t: Traveller; index: number }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-indigo-600">{t.name.charAt(0)}</span>
        </div>
        <p className="text-sm font-medium text-slate-900">{t.name}</p>
        <span className="text-[10px] text-slate-400 ml-auto">#{index + 2}</span>
      </div>
      <PassportRow label="DOB"         value={t.dob ? format(new Date(t.dob), "d MMM yyyy") : null} />
      <PassportRow label="Nationality" value={t.nationality} />
      <PassportRow label="Passport"    value={t.passport_number} />
      <PassportRow label="Expiry"      value={t.passport_expiry ? format(new Date(t.passport_expiry), "d MMM yyyy") : null} />
    </div>
  );
}

function ContactCard({ c }: { c: Customer }) {
  const [expanded, setExpanded] = useState(false);
  const travellers = c.travellers ?? [];
  const hasPassport = c.passport_number || c.nationality;

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-indigo-600">
              {c.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-900 truncate">{c.name}</p>
              <Badge variant="secondary" className={cn(
                "text-xs shrink-0",
                c.status === "Paid"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-amber-50 text-amber-700 border-amber-100"
              )}>
                {c.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Added {format(new Date(c.created_at), "d MMM yyyy")}
            </p>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <a href={`mailto:${c.email}`} className="truncate hover:text-indigo-600 transition-colors">
              {c.email}
            </a>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{c.destination}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{c.dob ? format(new Date(c.dob), "d MMMM yyyy") : "—"}</span>
          </div>
          {(c.num_travelers ?? 1) > 1 && (
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{c.num_travelers} travellers in party</span>
            </div>
          )}
        </div>

        {/* Passport summary */}
        {hasPassport && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Passport</p>
            {c.nationality && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Globe className="h-3 w-3 text-slate-400" />
                {c.nationality}
              </div>
            )}
            {c.passport_number && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <BookOpen className="h-3 w-3 text-slate-400" />
                <span className="font-mono">{c.passport_number}</span>
              </div>
            )}
            {c.passport_expiry && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays className="h-3 w-3 text-slate-400" />
                Exp. {format(new Date(c.passport_expiry), "d MMM yyyy")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Travel party expand toggle */}
      {travellers.length > 0 && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 border-t border-slate-100 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium">
              {travellers.length} additional {travellers.length === 1 ? "traveller" : "travellers"}
            </span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {expanded && (
            <div className="px-5 pb-5 space-y-3">
              {travellers.map((t, i) => (
                <TravellerCard key={t.id} t={t} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function ContactsClient({ customers, isDemo }: ContactsClientProps) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.destination.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Contacts</h1>
          <p className="text-xs text-slate-500">Personal & passport details for all passengers</p>
        </div>
        <div className="flex items-center gap-3">
          {isDemo && (
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100">Demo</Badge>
          )}
          <span className="text-sm text-slate-500">
            {customers.length} {customers.length === 1 ? "contact" : "contacts"}
          </span>
        </div>
      </header>

      <div className="flex-1 p-8 space-y-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or destination…"
            className="pl-10 h-10 border-slate-200 bg-white text-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No contacts found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <ContactCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

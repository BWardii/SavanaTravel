"use client";

import { useFormContext } from "react-hook-form";
import type { OnboardingData } from "@/lib/schemas";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";

function formatDate(d: string | null | undefined) {
  if (!d) return "—";
  try { return format(new Date(d), "d MMMM yyyy"); } catch { return d; }
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between items-start py-1.5 gap-4">
      <span className="text-[10px] tracking-[0.15em] uppercase text-[#9C8B7E] shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-[#1C1917] font-medium text-right">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#E8E2D9] bg-[#FAF8F4] p-5 space-y-0.5">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#9C8B7E] mb-3">{title}</p>
      {children}
    </div>
  );
}

export function StepReview() {
  const { t } = useLanguage();
  const form = useFormContext<OnboardingData>();
  const v = form.getValues();
  const count = v.num_travelers || 1;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif font-light text-3xl text-[#1C1917]">{t.reviewTitle}</h2>
        <p className="mt-1 text-sm text-[#6B5E52]">{t.reviewSubtitle}</p>
      </div>

      <Section title={t.reviewTripSection}>
        <Row label={t.reviewDestination} value={v.destination} />
        <Row label={t.reviewDeparture}   value={formatDate(v.departure_date)} />
        {v.trip_type !== "one-way" && <Row label={t.reviewReturn} value={formatDate(v.return_date)} />}
        <Row label={t.reviewTravellers}  value={`${count} ${count === 1 ? t.personSingular : t.personPlural}`} />
        {v.special_requests && <Row label={t.reviewRequests} value={v.special_requests} />}
      </Section>

      <Section title={t.reviewLeadSection}>
        <Row label={t.reviewName}           value={v.name} />
        <Row label={t.reviewEmail}          value={v.email} />
        <Row label={t.reviewDob}            value={formatDate(v.dob)} />
        <Row label={t.reviewPhone}          value={v.phone} />
        <Row label={t.reviewNationality}    value={v.nationality} />
        <Row label={t.reviewPassportNo}     value={v.passport_number} />
        <Row label={t.reviewPassportExpiry} value={formatDate(v.passport_expiry)} />
      </Section>

      {v.travellers && v.travellers.length > 0 && v.travellers.map((traveller, i) => (
        <Section key={i} title={`${t.travellerLabel} ${i + 2}`}>
          <Row label={t.reviewName}           value={traveller.name} />
          <Row label={t.reviewDob}            value={formatDate(traveller.dob)} />
          <Row label={t.reviewNationality}    value={traveller.nationality} />
          <Row label={t.reviewPassportNo}     value={traveller.passport_number} />
          <Row label={t.reviewPassportExpiry} value={formatDate(traveller.passport_expiry)} />
        </Section>
      ))}

      <div className="border-l-2 border-[#8B7355] pl-4 text-sm text-[#6B5E52] leading-relaxed">
        <strong className="text-[#1C1917]">{t.whatHappensNext}</strong>{" "}
        {t.whatHappensNextText}
      </div>
    </div>
  );
}

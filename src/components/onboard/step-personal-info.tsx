"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import type { OnboardingData } from "@/lib/schemas";
import { User, Mail, CalendarDays, Phone, Globe, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/language-context";

export function StepPersonalInfo() {
  const { t } = useLanguage();
  const form = useFormContext<OnboardingData>();
  const numTravelers = Number(form.watch("num_travelers")) || 1;
  const additionalCount = Math.max(0, numTravelers - 1);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "travellers",
  });

  const currentLength = fields.length;
  if (currentLength < additionalCount) {
    for (let i = currentLength; i < additionalCount; i++) {
      append({ name: "", dob: "", nationality: "", passport_number: "", passport_expiry: "" });
    }
  } else if (currentLength > additionalCount) {
    for (let i = currentLength - 1; i >= additionalCount; i--) {
      remove(i);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif font-light text-3xl text-[#1C1917]">{t.personalInfoTitle}</h2>
        <p className="mt-1 text-sm text-[#6B5E52]">{t.personalInfoSubtitle}</p>
      </div>

      {/* ── Contact ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.fullName}</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input {...field} placeholder="Alexandra Chen" className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.email}</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input {...field} type="email" placeholder="alex@example.com" className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="dob" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.dob}</FormLabel>
            <FormControl>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input {...field} type="date" max={new Date().toISOString().split("T")[0]} className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.phone}</FormLabel>
            <FormControl>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input {...field} type="tel" placeholder="+44 7700 900123" className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <Separator className="bg-slate-100" />

      {/* ── Passport ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
          {t.passportSectionLabel}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField control={form.control} name="nationality" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.nationality}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input {...field} placeholder="British" className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="passport_number" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.passportNumber}</FormLabel>
              <FormControl>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input {...field} placeholder="123456789" className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10 font-mono uppercase" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="passport_expiry" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.passportExpiry}</FormLabel>
              <FormControl>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input {...field} type="date" min={new Date().toISOString().split("T")[0]} className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </div>

      {/* ── Additional travellers ── */}
      {additionalCount > 0 && (
        <>
          <Separator className="bg-slate-100" />
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t.additionalTravellersLabel} ({additionalCount})
            </p>

            {fields.map((field, i) => (
              <div key={field.id} className="border border-slate-200 rounded-lg p-5 space-y-4 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-700">
                  {t.travellerLabel} {i + 2}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name={`travellers.${i}.name`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.fullName}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input {...field} placeholder="Full name" className="pl-9 h-10 border-slate-200 focus:border-[#8B7355] bg-white" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`travellers.${i}.dob`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.dob}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input {...field} type="date" max={new Date().toISOString().split("T")[0]} className="pl-9 h-10 border-slate-200 focus:border-[#8B7355] bg-white" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name={`travellers.${i}.nationality`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.nationality}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input {...field} placeholder="British" className="pl-9 h-10 border-slate-200 focus:border-[#8B7355] bg-white" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`travellers.${i}.passport_number`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.passportNumber}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input {...field} placeholder="123456789" className="pl-9 h-10 border-slate-200 focus:border-[#8B7355] bg-white font-mono uppercase" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`travellers.${i}.passport_expiry`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">{t.passportExpiry}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input {...field} type="date" min={new Date().toISOString().split("T")[0]} className="pl-9 h-10 border-slate-200 focus:border-[#8B7355] bg-white" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

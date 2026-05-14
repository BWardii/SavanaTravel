"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { OnboardingData } from "@/lib/schemas";
import { MapPin, Users, CalendarDays, MessageSquare, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

const POPULAR_DESTINATIONS = [
  { label: "Makkah",    flag: "🕋" },
  { label: "Madinah",   flag: "🕌" },
  { label: "Dubai",     flag: "🇦🇪" },
  { label: "Istanbul",  flag: "🇹🇷" },
  { label: "Mogadishu", flag: "🇸🇴" },
  { label: "Cairo",     flag: "🇪🇬" },
  { label: "Nairobi",   flag: "🇰🇪" },
  { label: "London",    flag: "🇬🇧" },
];

export function StepTripDetails() {
  const { t } = useLanguage();
  const form = useFormContext<OnboardingData>();
  const currentDestination = form.watch("destination");
  const tripType = form.watch("trip_type") ?? "return";
  const isCustom =
    currentDestination !== "" &&
    !POPULAR_DESTINATIONS.some((d) => d.label === currentDestination);
  const [showCustom, setShowCustom] = useState(isCustom);

  function selectDestination(label: string) {
    form.setValue("destination", label, { shouldValidate: true });
    setShowCustom(false);
  }

  function activateCustom() {
    setShowCustom(true);
    form.setValue("destination", "", { shouldValidate: false });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif font-light text-3xl text-[#1C1917]">
          {t.tripDetailsTitle}
        </h2>
        <p className="mt-1 text-sm text-[#6B5E52]">{t.tripDetailsSubtitle}</p>
      </div>

      {/* Destination */}
      <FormField
        control={form.control}
        name="destination"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">
              {t.destination}
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {POPULAR_DESTINATIONS.map((d) => {
                    const isSelected =
                      currentDestination === d.label && !showCustom;
                    return (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => selectDestination(d.label)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2.5 rounded-md border text-sm transition-all text-left",
                          isSelected
                            ? "border-[#8B7355] bg-[#F5F0E8] text-[#1C1917] font-medium"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#8B7355]/50 hover:bg-[#FAF8F4]"
                        )}
                      >
                        <span className="text-base leading-none">{d.flag}</span>
                        <span>{d.label}</span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={activateCustom}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-md border text-sm transition-all text-left",
                      showCustom
                        ? "border-[#8B7355] bg-[#F5F0E8] text-[#1C1917] font-medium"
                        : "border-dashed border-slate-300 bg-white text-slate-400 hover:border-[#8B7355]/50 hover:text-slate-600"
                    )}
                  >
                    <PenLine className="h-3.5 w-3.5 shrink-0" />
                    <span>{t.otherDestination}</span>
                  </button>
                </div>

                {showCustom && (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      {...field}
                      autoFocus
                      placeholder="Type your destination"
                      className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10"
                    />
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Trip Type toggle */}
      <FormField
        control={form.control}
        name="trip_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">
              {t.tripTypeLabel}
            </FormLabel>
            <FormControl>
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 gap-1">
                {(["one-way", "return"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      field.onChange(type);
                      if (type === "one-way") {
                        form.setValue("return_date", null, { shouldValidate: true });
                      }
                    }}
                    className={cn(
                      "px-5 py-2 rounded-md text-sm font-medium transition-all",
                      field.value === type
                        ? "bg-[#1C1917] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    {type === "one-way" ? t.tripTypeOneWay : t.tripTypeReturn}
                  </button>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Dates */}
      <div className={cn("grid gap-4", tripType === "return" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-1 max-w-xs")}>
        <FormField
          control={form.control}
          name="departure_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">
                {t.departureDate}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    {...field}
                    type="date"
                    className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {tripType === "return" && (
          <FormField
            control={form.control}
            name="return_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">
                  {t.returnDate}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="date"
                      className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Travellers */}
      <FormField
        control={form.control}
        name="num_travelers"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">
              {t.numTravellers}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  {...field}
                  type="number"
                  min={1}
                  max={20}
                  placeholder="2"
                  className="pl-9 h-11 border-slate-200 focus:border-[#8B7355] focus:ring-[#8B7355]/10"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Special requests */}
      <FormField
        control={form.control}
        name="special_requests"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1C1917] text-sm font-medium tracking-wide">
              {t.specialRequests}{" "}
              <span className="text-slate-400 font-normal">({t.optional})</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  {...field}
                  rows={3}
                  placeholder="Dietary requirements, accessibility needs, anniversary surprises..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-md border border-slate-200 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/10 focus:border-[#8B7355] resize-none"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

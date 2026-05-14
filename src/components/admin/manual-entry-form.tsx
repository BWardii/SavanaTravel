"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ChevronDown, User, Users, MapPin, FileText } from "lucide-react";

import { onboardingSchema, type OnboardingData } from "@/lib/schemas";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import { Button }   from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const DESTINATIONS = ["Makkah", "Medina", "Dubai", "Istanbul", "Mogadishu"];

function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 pb-4 mb-6 border-b border-slate-200">
      <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 mt-0.5">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export function ManualEntryForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      num_travelers: 1,
      travellers: [],
      special_requests: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "travellers" });

  const numTravelers = watch("num_travelers");
  const destination  = watch("destination");

  // Sync additional traveller slots with num_travelers
  useEffect(() => {
    const count = Number(numTravelers) || 1;
    const needed = count - 1;
    const current = fields.length;

    if (needed > current) {
      for (let i = current; i < needed; i++) {
        append({ name: "", dob: "", nationality: "", passport_number: "", passport_expiry: "" });
      }
    } else if (needed < current) {
      for (let i = current - 1; i >= needed; i--) {
        remove(i);
      }
    }
  }, [numTravelers]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(data: OnboardingData) {
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Submission failed");
      }

      toast.success("Booking created successfully", {
        description: `${data.name} has been added to the system.`,
      });

      router.push("/admin/enquiries");
      router.refresh();
    } catch (err) {
      toast.error("Failed to create booking", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* ── Section 1: Trip Details ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader
          icon={<MapPin className="h-4 w-4" />}
          title="Trip Details"
          description="Destination, dates, and number of travellers."
        />

        <div className="space-y-5">

          {/* Destination */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Destination</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {DESTINATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setValue("destination", d, { shouldValidate: true })}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                    destination === d
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  )}
                >
                  {d}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setValue("destination", "", { shouldValidate: false })}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                  !DESTINATIONS.includes(destination ?? "")
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                )}
              >
                Other
              </button>
            </div>
            {!DESTINATIONS.includes(destination ?? "") && (
              <Input
                {...register("destination")}
                placeholder="Enter destination"
                className="h-10 border-slate-200"
              />
            )}
            <FieldError message={errors.destination?.message} />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="departure_date" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Departure Date</Label>
              <Input id="departure_date" type="date" {...register("departure_date")} className="h-10 border-slate-200" />
              <FieldError message={errors.departure_date?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="return_date" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Return Date</Label>
              <Input id="return_date" type="date" {...register("return_date")} className="h-10 border-slate-200" />
              <FieldError message={errors.return_date?.message} />
            </div>
          </div>

          {/* Travellers count */}
          <div className="space-y-1.5">
            <Label htmlFor="num_travelers" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Number of Travellers</Label>
            <div className="relative max-w-xs">
              <select
                id="num_travelers"
                {...register("num_travelers", { valueAsNumber: true })}
                className="w-full h-10 pl-3 pr-8 border border-slate-200 rounded-md text-sm text-slate-800 bg-white appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "traveller" : "travellers"}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            <FieldError message={errors.num_travelers?.message} />
          </div>

          {/* Special requests */}
          <div className="space-y-1.5">
            <Label htmlFor="special_requests" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Special Requests <span className="text-slate-400 normal-case font-normal">(optional)</span></Label>
            <Textarea
              id="special_requests"
              {...register("special_requests")}
              placeholder="e.g. wheelchair access, dietary requirements…"
              rows={3}
              className="border-slate-200 resize-none text-sm"
            />
          </div>

        </div>
      </div>

      {/* ── Section 2: Lead Passenger ───────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader
          icon={<User className="h-4 w-4" />}
          title="Lead Passenger"
          description="Main contact and passport details."
        />

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="Jane Smith" className="h-10 border-slate-200" />
              <FieldError message={errors.name?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="jane@email.com" className="h-10 border-slate-200" />
              <FieldError message={errors.email?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Phone</Label>
              <Input id="phone" type="tel" {...register("phone")} placeholder="+44 7700 900000" className="h-10 border-slate-200" />
              <FieldError message={errors.phone?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dob" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Date of Birth</Label>
              <Input id="dob" type="date" {...register("dob")} className="h-10 border-slate-200" />
              <FieldError message={errors.dob?.message} />
            </div>
          </div>

          {/* Passport */}
          <div className="border border-slate-100 rounded-lg bg-slate-50 p-4 space-y-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Passport Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nationality" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Nationality</Label>
                <Input id="nationality" {...register("nationality")} placeholder="British" className="h-10 border-slate-200 bg-white" />
                <FieldError message={errors.nationality?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="passport_number" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Passport No.</Label>
                <Input id="passport_number" {...register("passport_number")} placeholder="123456789" className="h-10 border-slate-200 bg-white font-mono" />
                <FieldError message={errors.passport_number?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="passport_expiry" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Expiry Date</Label>
                <Input id="passport_expiry" type="date" {...register("passport_expiry")} className="h-10 border-slate-200 bg-white" />
                <FieldError message={errors.passport_expiry?.message} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Additional Travellers ────────────────────────────── */}
      {fields.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader
            icon={<Users className="h-4 w-4" />}
            title={`Additional Travellers (${fields.length})`}
            description="Passport details for each person in the group."
          />

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-slate-100 rounded-lg p-4 space-y-4 relative">
                {/* Traveller number badge */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-600">
                      {index + 2}
                    </div>
                    <span className="text-sm font-medium text-slate-700">Traveller {index + 2}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                      const cur = Number(numTravelers) || 1;
                      if (cur > 1) setValue("num_travelers", cur - 1);
                    }}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                    title="Remove traveller"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Full Name</Label>
                    <Input {...register(`travellers.${index}.name`)} placeholder="Full name" className="h-10 border-slate-200" />
                    <FieldError message={errors.travellers?.[index]?.name?.message} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Date of Birth</Label>
                    <Input type="date" {...register(`travellers.${index}.dob`)} className="h-10 border-slate-200" />
                    <FieldError message={errors.travellers?.[index]?.dob?.message} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Nationality</Label>
                    <Input {...register(`travellers.${index}.nationality`)} placeholder="British" className="h-10 border-slate-200" />
                    <FieldError message={errors.travellers?.[index]?.nationality?.message} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Passport No.</Label>
                    <Input {...register(`travellers.${index}.passport_number`)} placeholder="123456789" className="h-10 border-slate-200 font-mono" />
                    <FieldError message={errors.travellers?.[index]?.passport_number?.message} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Passport Expiry</Label>
                    <Input type="date" {...register(`travellers.${index}.passport_expiry`)} className="h-10 border-slate-200 max-w-xs" />
                    <FieldError message={errors.travellers?.[index]?.passport_expiry?.message} />
                  </div>
                </div>
              </div>
            ))}

            {/* Add more button */}
            <button
              type="button"
              onClick={() => {
                append({ name: "", dob: "", nationality: "", passport_number: "", passport_expiry: "" });
                setValue("num_travelers", (Number(numTravelers) || 1) + 1);
              }}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add another traveller
            </button>
          </div>
        </div>
      )}

      {/* ── Submit ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader
          icon={<FileText className="h-4 w-4" />}
          title="Submit Booking"
          description="Review the details above, then create the record. You can update pricing and status from the Enquiries page."
        />

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6 font-medium"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating booking…</>
            ) : (
              "Create Booking"
            )}
          </Button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

    </form>
  );
}

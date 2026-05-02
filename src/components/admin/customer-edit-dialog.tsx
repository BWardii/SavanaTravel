"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Customer, CustomerStatus } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const editSchema = z.object({
  flight_price: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z.number().min(0, "Must be ≥ 0").nullable()
  ),
  amount_paid: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z.number().min(0, "Must be ≥ 0").nullable()
  ),
  payment_due_date: z.string().nullable(),
  status: z.enum(["Pending", "Partial", "Paid"]),
});

type EditData = z.infer<typeof editSchema>;

interface CustomerEditDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (customer: Customer) => void;
}

function fmt(v: number | null) {
  if (v == null) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 }).format(v);
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-sm text-slate-700 font-medium">{value || "—"}</span>
    </div>
  );
}

/** Derives the correct status from paid vs total */
function deriveStatus(total: number | null, paid: number | null): CustomerStatus {
  if (!total || !paid || paid <= 0) return "Pending";
  if (paid >= total) return "Paid";
  return "Partial";
}

export function CustomerEditDialog({ customer, open, onOpenChange, onUpdated }: CustomerEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty }, watch, setValue, reset } =
    useForm<EditData, unknown, EditData>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: zodResolver(editSchema) as any,
      defaultValues: {
        flight_price: customer.flight_price,
        amount_paid: customer.amount_paid ?? 0,
        payment_due_date: customer.payment_due_date ?? "",
        status: customer.status,
      },
    });

  // Reset form when customer changes
  useEffect(() => {
    reset({
      flight_price: customer.flight_price,
      amount_paid: customer.amount_paid ?? 0,
      payment_due_date: customer.payment_due_date ?? "",
      status: customer.status,
    });
  }, [customer, reset]);

  const flightPrice  = watch("flight_price");
  const amountPaid   = watch("amount_paid");
  const currentStatus = watch("status");

  const total     = Number(flightPrice) || 0;
  const paid      = Number(amountPaid)  || 0;
  const balance   = Math.max(0, total - paid);
  const paidPct   = total > 0 ? Math.min(100, (paid / total) * 100) : 0;
  const autoStatus = deriveStatus(total || null, paid || null);

  // Auto-update status whenever amounts change
  useEffect(() => {
    setValue("status", autoStatus, { shouldDirty: true });
  }, [autoStatus, setValue]);

  async function onSubmit(data: EditData) {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { data: updated, error } = await supabase
        .from("customers")
        .update({
          flight_price: data.flight_price,
          amount_paid: data.amount_paid ?? 0,
          payment_due_date: data.payment_due_date || null,
          status: data.status,
        })
        .eq("id", customer.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      toast.success(`${customer.name} updated.`);
      onUpdated(updated as Customer);
      onOpenChange(false);
    } catch (err) {
      toast.error("Update failed", { description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setIsLoading(false);
    }
  }

  const statusColour: Record<CustomerStatus, string> = {
    Paid:    "bg-emerald-50 border-emerald-200 text-emerald-700",
    Partial: "bg-blue-50 border-blue-200 text-blue-700",
    Pending: "bg-amber-50 border-amber-200 text-amber-700",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900 text-lg">{customer.name}</DialogTitle>
          <DialogDescription className="text-slate-500">
            {customer.destination} · {customer.num_travelers ?? 1} traveller{(customer.num_travelers ?? 1) > 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        {/* ── Customer snapshot ─────────────────────────────────────────────── */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-1">
          <InfoRow label="Email"     value={customer.email} />
          <InfoRow label="Phone"     value={customer.phone} />
          <InfoRow label="Departure" value={customer.departure_date
            ? format(new Date(customer.departure_date), "d MMM yyyy") : null} />
          <InfoRow label="Return"    value={customer.return_date
            ? format(new Date(customer.return_date), "d MMM yyyy") : null} />
          <InfoRow label="Submitted" value={customer.created_at
            ? format(new Date(customer.created_at), "d MMM yyyy, HH:mm") : null} />
        </div>

        {/* ── Invoice summary ────────────────────────────────────────────────── */}
        {total > 0 && (
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Invoice</p>
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", statusColour[currentStatus])}>
                {currentStatus}
              </span>
            </div>
            <div className="px-4 py-3 space-y-2.5 bg-white">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Price</span>
                <span className="font-semibold text-slate-900">{fmt(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-semibold text-emerald-600">{fmt(paid)}</span>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    paidPct >= 100 ? "bg-emerald-500" : paidPct > 0 ? "bg-blue-500" : "bg-slate-300"
                  )}
                  style={{ width: `${paidPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{paidPct.toFixed(0)}% paid</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">Balance:</span>
                  <span className={cn(
                    "text-sm font-bold",
                    balance === 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    {fmt(balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-slate-100" />

        {/* ── Edit form ──────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Price & paid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="flight_price" className="text-sm font-medium text-slate-700">
                Total Price (£)
              </Label>
              <Input id="flight_price" type="number" step="0.01" min="0"
                {...register("flight_price")}
                className="h-10 border-slate-200" placeholder="0.00" />
              {errors.flight_price && (
                <p className="text-xs text-red-500">{errors.flight_price.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount_paid" className="text-sm font-medium text-slate-700">
                Amount Paid (£)
              </Label>
              <Input id="amount_paid" type="number" step="0.01" min="0"
                {...register("amount_paid")}
                className="h-10 border-slate-200" placeholder="0.00" />
              {errors.amount_paid && (
                <p className="text-xs text-red-500">{errors.amount_paid.message}</p>
              )}
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1.5">
            <Label htmlFor="payment_due_date" className="text-sm font-medium text-slate-700">
              Payment Due Date
            </Label>
            <Input id="payment_due_date" type="date"
              {...register("payment_due_date")}
              className="h-10 border-slate-200" />
          </div>

          {/* Status — auto-set but can override */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Payment Status
              <span className="ml-2 text-xs text-slate-400 font-normal">(auto-set from amounts above)</span>
            </Label>
            <div className="flex gap-2">
              {(["Pending", "Partial", "Paid"] as const).map((s) => (
                <button key={s} type="button"
                  onClick={() => setValue("status", s, { shouldDirty: true })}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-sm font-medium transition-all",
                    currentStatus === s
                      ? s === "Paid"    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : s === "Partial" ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                      : "border-slate-200 text-slate-400 hover:border-slate-300"
                  )}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-200 text-slate-700" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading || !isDirty}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Customer } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const editSchema = z.object({
  flight_price: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().min(0, "Price cannot be negative").nullable()
  ),
  payment_due_date: z.string().nullable(),
  status: z.enum(["Pending", "Paid"]),
});

type EditData = z.infer<typeof editSchema>;

interface CustomerEditDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (customer: Customer) => void;
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-sm text-slate-700 font-medium">{value || "—"}</span>
    </div>
  );
}

export function CustomerEditDialog({ customer, open, onOpenChange, onUpdated }: CustomerEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<EditData, unknown, EditData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editSchema) as any,
    defaultValues: {
      flight_price: customer.flight_price,
      payment_due_date: customer.payment_due_date ?? "",
      status: customer.status,
    },
  });

  const currentStatus = watch("status");

  async function onSubmit(data: EditData) {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { data: updated, error } = await supabase
        .from("customers")
        .update({
          flight_price: data.flight_price,
          payment_due_date: data.payment_due_date || null,
          status: data.status,
        })
        .eq("id", customer.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      onUpdated(updated as Customer);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast.error("Update failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-900">{customer.name}</DialogTitle>
          <DialogDescription className="text-slate-500">
            Review enquiry and update flight pricing or payment schedule.
          </DialogDescription>
        </DialogHeader>

        {/* Read-only info */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-1">
          <InfoRow label="Email" value={customer.email} />
          <InfoRow
            label="Date of Birth"
            value={customer.dob ? format(new Date(customer.dob), "d MMMM yyyy") : null}
          />
          <InfoRow label="Destination" value={customer.destination} />
          <InfoRow
            label="Submitted"
            value={customer.created_at ? format(new Date(customer.created_at), "d MMM yyyy, HH:mm") : null}
          />
        </div>

        <Separator className="bg-slate-100" />

        {/* Edit form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="flight_price" className="text-sm font-medium text-slate-700">
                Flight Price (£)
              </Label>
              <Input
                id="flight_price"
                type="number"
                step="0.01"
                min="0"
                {...register("flight_price")}
                className="h-10 border-slate-200"
                placeholder="0.00"
              />
              {errors.flight_price && (
                <p className="text-xs text-red-500">{errors.flight_price.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="payment_due_date" className="text-sm font-medium text-slate-700">
                Payment Due Date
              </Label>
              <Input
                id="payment_due_date"
                type="date"
                {...register("payment_due_date")}
                className="h-10 border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Payment Status</Label>
            <div className="flex gap-2">
              {(["Pending", "Paid"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue("status", s, { shouldDirty: true })}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-sm font-medium transition-all",
                    currentStatus === s
                      ? s === "Paid"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                      : "border-slate-200 text-slate-400 hover:border-slate-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-200 text-slate-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading || !isDirty}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

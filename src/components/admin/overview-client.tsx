"use client";

import Link from "next/link";
import type { Customer } from "@/types";
import { formatDistanceToNow, format } from "date-fns";
import { Users, Clock, CheckCircle2, TrendingUp, ChevronRight, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OverviewClientProps {
  stats: { total: number; pending: number; paid: number; overdue: number; revenue: number };
  recent: Customer[];
  dueSoon: Customer[];
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(v);
}

function StatusBadge({ status }: { status: Customer["status"] }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-xs font-medium",
        status === "Paid"
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-amber-50 text-amber-700 border-amber-100"
      )}
    >
      {status}
    </Badge>
  );
}

export function OverviewClient({ stats, recent, dueSoon }: OverviewClientProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      {/* Top bar */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Overview</h1>
          <p className="text-xs text-slate-500">Welcome back — here's what's happening.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/enquiries"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            View all enquiries →
          </Link>
        </div>
      </header>

      <div className="flex-1 p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            {
              icon: Users,
              label: "Total",
              value: stats.total,
              sub: "all enquiries",
              iconBg: "bg-slate-100",
              iconColor: "text-slate-600",
              valueColor: "text-slate-900",
            },
            {
              icon: Clock,
              label: "Pending",
              value: stats.pending,
              sub: "awaiting payment",
              iconBg: "bg-amber-50",
              iconColor: "text-amber-600",
              valueColor: "text-amber-700",
            },
            {
              icon: CheckCircle2,
              label: "Paid",
              value: stats.paid,
              sub: "confirmed",
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-600",
              valueColor: "text-emerald-700",
            },
            {
              icon: AlertTriangle,
              label: "Overdue",
              value: stats.overdue,
              sub: "past due date",
              iconBg: "bg-red-50",
              iconColor: "text-red-500",
              valueColor: stats.overdue > 0 ? "text-red-600" : "text-slate-400",
            },
            {
              icon: TrendingUp,
              label: "Revenue",
              value: formatCurrency(stats.revenue),
              sub: "from paid bookings",
              iconBg: "bg-indigo-50",
              iconColor: "text-indigo-600",
              valueColor: "text-indigo-700",
            },
          ].map(({ icon: Icon, label, value, sub, iconBg, iconColor, valueColor }) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-slate-500">{label}</p>
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", iconBg)}>
                  <Icon className={cn("h-4 w-4", iconColor)} />
                </div>
              </div>
              <p className={cn("text-2xl font-semibold", valueColor)}>{value}</p>
              <p className="text-xs text-slate-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

          {/* Recent enquiries */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-medium text-slate-900">Recent Enquiries</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest submissions from the onboarding form</p>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                See all
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recent.length === 0 ? (
                <p className="px-6 py-10 text-sm text-slate-400 text-center">No enquiries yet.</p>
              ) : recent.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-indigo-600">
                        {c.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                      <p className="text-xs text-slate-400 truncate">{c.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <StatusBadge status={c.status} />
                    <span className="text-xs text-slate-400 hidden sm:block whitespace-nowrap">
                      {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Due soon */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-medium text-slate-900">Due Within 7 Days</h2>
              <p className="text-xs text-slate-500 mt-0.5">Pending payments approaching deadline</p>
            </div>
            <div className="divide-y divide-slate-100">
              {dueSoon.length === 0 ? (
                <p className="px-6 py-10 text-sm text-slate-400 text-center">No upcoming payments.</p>
              ) : dueSoon.map((c) => {
                const days = Math.ceil(
                  (new Date(c.payment_due_date!).getTime() - Date.now()) / 86400000
                );
                const isOverdue = days < 0;
                const isDueSoon = !isOverdue && days <= 3;
                return (
                  <div key={c.id} className={cn(
                    "px-6 py-3.5 transition-colors",
                    isOverdue ? "bg-red-50/50 hover:bg-red-50" : "hover:bg-slate-50"
                  )}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{c.destination}</p>
                      </div>
                      {isOverdue ? (
                        <span className="text-[10px] font-bold uppercase tracking-wide shrink-0 bg-red-100 text-red-600 rounded px-2 py-0.5">
                          Overdue
                        </span>
                      ) : isDueSoon ? (
                        <span className="text-[10px] font-bold uppercase tracking-wide shrink-0 bg-amber-100 text-amber-600 rounded px-2 py-0.5">
                          {days === 0 ? "Today" : `${days}d`}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 shrink-0">{days}d</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={cn("text-xs", isOverdue ? "text-red-500 font-medium" : "text-slate-400")}>
                        Due {c.payment_due_date ? format(new Date(c.payment_due_date), "d MMM yyyy") : "—"}
                      </span>
                      {c.flight_price && (
                        <span className="text-xs font-medium text-slate-700">
                          {formatCurrency(c.flight_price)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

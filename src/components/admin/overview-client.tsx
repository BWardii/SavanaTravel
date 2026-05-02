"use client";

import { useState } from "react";
import Link from "next/link";
import type { Customer, CustomerStatus } from "@/types";
import { formatDistanceToNow, format, subDays, subYears } from "date-fns";
import {
  Users, Clock, CheckCircle2, TrendingUp, ChevronRight,
  AlertTriangle, TrendingDown, CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Period = "1d" | "7d" | "30d" | "1y";

interface OverviewClientProps {
  stats: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
    collected: number;
    outstanding: number;
  };
  recent: Customer[];
  dueSoon: Customer[];
  allCustomers: Customer[];
}

function fmt(v: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency", currency: "GBP", minimumFractionDigits: 0,
  }).format(v);
}

function fmt2(v: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency", currency: "GBP", minimumFractionDigits: 2,
  }).format(v);
}

function StatusBadge({ status }: { status: CustomerStatus }) {
  const cfg: Record<CustomerStatus, string> = {
    Paid:    "bg-emerald-50 text-emerald-700 border-emerald-100",
    Partial: "bg-blue-50 text-blue-700 border-blue-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <Badge variant="secondary" className={cn("text-xs font-medium", cfg[status])}>
      {status}
    </Badge>
  );
}

const PERIOD_LABELS: Record<Period, string> = {
  "1d": "1D", "7d": "7D", "30d": "30D", "1y": "1Y",
};

function periodStart(p: Period): Date {
  const now = new Date();
  if (p === "1d") return subDays(now, 1);
  if (p === "7d") return subDays(now, 7);
  if (p === "30d") return subDays(now, 30);
  return subYears(now, 1);
}

export function OverviewClient({ stats, recent, dueSoon, allCustomers }: OverviewClientProps) {
  const [period, setPeriod] = useState<Period>("30d");

  const start = periodStart(period);
  const filtered = allCustomers.filter((c) => new Date(c.created_at) >= start);
  const periodCollected    = filtered.reduce((s, c) => s + (c.amount_paid ?? 0), 0);
  const periodOutstanding  = filtered
    .filter((c) => c.status !== "Paid")
    .reduce((s, c) => s + Math.max(0, (c.flight_price ?? 0) - (c.amount_paid ?? 0)), 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Overview</h1>
          <p className="text-xs text-slate-500">Financial summary and booking status at a glance.</p>
        </div>
        <Link href="/admin/enquiries"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
          View all enquiries →
        </Link>
      </header>

      <div className="flex-1 p-8 space-y-6">

        {/* ── Stat cards ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              icon: Users,
              label: "Total Clients",
              value: stats.total,
              sub: "all enquiries",
              iconBg: "bg-slate-100", iconColor: "text-slate-600", valueColor: "text-slate-900",
              border: "border-slate-100",
            },
            {
              icon: Clock,
              label: "Pending",
              value: stats.pending,
              sub: "awaiting payment",
              iconBg: "bg-amber-50", iconColor: "text-amber-500", valueColor: "text-amber-700",
              border: "border-amber-50",
            },
            {
              icon: CheckCircle2,
              label: "Paid in Full",
              value: stats.paid,
              sub: "confirmed bookings",
              iconBg: "bg-emerald-50", iconColor: "text-emerald-600", valueColor: "text-emerald-700",
              border: "border-emerald-50",
            },
            {
              icon: AlertTriangle,
              label: "Overdue",
              value: stats.overdue,
              sub: "past due date",
              iconBg: "bg-red-50", iconColor: "text-red-500",
              valueColor: stats.overdue > 0 ? "text-red-600" : "text-slate-400",
              border: stats.overdue > 0 ? "border-red-100" : "border-slate-100",
            },
          ].map(({ icon: Icon, label, value, sub, iconBg, iconColor, valueColor, border }) => (
            <div key={label} className={cn("rounded-xl border bg-white p-5 shadow-sm", border)}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", iconBg)}>
                  <Icon className={cn("h-4 w-4", iconColor)} />
                </div>
              </div>
              <p className={cn("text-3xl font-bold tabular-nums", valueColor)}>{value}</p>
              <p className="text-xs text-slate-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Financial cards with period filter ────────────────────────────── */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Period toggle header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Financial Summary</h2>
              <p className="text-xs text-slate-400 mt-0.5">Based on enquiries created in this period</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150",
                    period === p
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Two financial stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Collected */}
            <div className="p-6 flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Collected</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1 tabular-nums">{fmt(periodCollected)}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {filtered.filter(c => (c.amount_paid ?? 0) > 0).length} clients paid in period
                </p>
              </div>
            </div>

            {/* Outstanding */}
            <div className="p-6 flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Outstanding</p>
                <p className="text-3xl font-bold text-red-600 mt-1 tabular-nums">{fmt(periodOutstanding)}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {filtered.filter(c => c.status !== "Paid" && (c.flight_price ?? 0) > 0).length} clients with balance
                </p>
              </div>
            </div>
          </div>

          {/* All-time footnote */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-6">
            <span className="text-xs text-slate-400">
              All-time collected: <span className="font-semibold text-slate-600">{fmt2(stats.collected)}</span>
            </span>
            <span className="text-xs text-slate-400">
              All-time outstanding: <span className="font-semibold text-slate-600">{fmt2(stats.outstanding)}</span>
            </span>
          </div>
        </div>

        {/* ── Bottom row ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

          {/* Recent enquiries */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-medium text-slate-900">Recent Enquiries</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest submissions from the onboarding form</p>
              </div>
              <Link href="/admin/enquiries"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                See all
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recent.length === 0 ? (
                <p className="px-6 py-10 text-sm text-slate-400 text-center">No enquiries yet.</p>
              ) : recent.map((c) => {
                const paid    = c.amount_paid ?? 0;
                const total   = c.flight_price ?? 0;
                const balance = Math.max(0, total - paid);
                return (
                  <div key={c.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/80 transition-colors">
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
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {total > 0 && (
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-semibold text-slate-700">{fmt2(paid)}</p>
                          {balance > 0 && <p className="text-[10px] text-red-500">–{fmt2(balance)} left</p>}
                        </div>
                      )}
                      <StatusBadge status={c.status} />
                      <span className="text-xs text-slate-400 hidden lg:block whitespace-nowrap">
                        {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Due soon */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-medium text-slate-900">Due Within 7 Days</h2>
              <p className="text-xs text-slate-500 mt-0.5">Pending balances approaching deadline</p>
            </div>
            <div className="divide-y divide-slate-100">
              {dueSoon.length === 0 ? (
                <p className="px-6 py-10 text-sm text-slate-400 text-center">No upcoming payments.</p>
              ) : dueSoon.map((c) => {
                const days    = Math.ceil((new Date(c.payment_due_date!).getTime() - Date.now()) / 86400000);
                const isOverdue = days < 0;
                const balance = Math.max(0, (c.flight_price ?? 0) - (c.amount_paid ?? 0));
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
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wide shrink-0 rounded px-2 py-0.5",
                        isOverdue ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                      )}>
                        {isOverdue ? "Overdue" : days === 0 ? "Today" : `${days}d`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={cn("text-xs", isOverdue ? "text-red-500 font-medium" : "text-slate-400")}>
                        {c.payment_due_date ? format(new Date(c.payment_due_date), "d MMM yyyy") : "—"}
                      </span>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3 text-slate-400" />
                        <span className="text-xs font-semibold text-red-600">{fmt2(balance)}</span>
                      </div>
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

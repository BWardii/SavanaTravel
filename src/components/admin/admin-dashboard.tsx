"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { CustomersTable } from "./customers-table";
import { CustomerEditDialog } from "./customer-edit-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types";
import {
  Globe,
  LogOut,
  Users,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface AdminDashboardProps {
  customers: Customer[];
  stats: { total: number; pending: number; paid: number };
  userEmail: string;
  isDemo?: boolean;
}

export function AdminDashboard({
  customers: initialCustomers,
  stats,
  userEmail,
  isDemo = false,
}: AdminDashboardProps) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  }

  function handleCustomerUpdated(updatedCustomer: Customer) {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
    setSelectedCustomer(null);
    toast.success("Customer updated", {
      description: `${updatedCustomer.name}'s details have been saved.`,
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold text-slate-900">
                Savana Travel
              </span>
            </Link>
            <Badge
              variant="secondary"
              className="text-xs bg-indigo-50 text-indigo-700 border-indigo-100"
            >
              Admin
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
                Demo Mode
              </span>
            )}
            <span className="text-xs text-slate-500 hidden sm:block">
              {userEmail}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-slate-600"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
            {!isDemo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Customer Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage travel enquiries, pricing, and payment schedules.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Users,
              label: "Total Enquiries",
              value: stats.total,
              color: "text-slate-700",
              bg: "bg-slate-100",
            },
            {
              icon: Clock,
              label: "Pending",
              value: stats.pending,
              color: "text-amber-700",
              bg: "bg-amber-50",
            },
            {
              icon: CheckCircle2,
              label: "Paid",
              value: stats.paid,
              color: "text-emerald-700",
              bg: "bg-emerald-50",
            },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-100 bg-white p-5 flex items-center gap-4"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}
              >
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`text-2xl font-semibold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-medium text-slate-900">All Enquiries</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click a row to update flight pricing and payment details.
            </p>
          </div>
          <CustomersTable
            customers={customers}
            onRowClick={setSelectedCustomer}
          />
        </div>
      </main>

      {selectedCustomer && (
        <CustomerEditDialog
          customer={selectedCustomer}
          open={!!selectedCustomer}
          onOpenChange={(open) => !open && setSelectedCustomer(null)}
          onUpdated={handleCustomerUpdated}
        />
      )}
    </div>
  );
}

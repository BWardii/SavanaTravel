"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, flexRender,
  type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerEditDialog } from "./customer-edit-dialog";
import type { Customer, CustomerStatus } from "@/types";
import { format } from "date-fns";
import { ArrowUpDown, Search, ChevronRight, AlertTriangle, Clock, PoundSterling } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSeenEnquiries } from "@/hooks/use-seen-enquiries";

interface EnquiriesClientProps {
  customers: Customer[];
  isDemo: boolean;
}

function getDateStatus(c: Customer): "overdue" | "due-soon" | "ok" | null {
  if (!c.payment_due_date || c.status === "Paid") return null;
  const days = Math.ceil((new Date(c.payment_due_date).getTime() - Date.now()) / 86400000);
  if (days < 0) return "overdue";
  if (days <= 3) return "due-soon";
  return "ok";
}

function fmt(v: number | null | undefined) {
  if (v == null) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 }).format(v);
}

function fmt2(v: number | null | undefined) {
  if (v == null) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 }).format(v);
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

function PaymentCell({ c }: { c: Customer }) {
  const total   = c.flight_price ?? 0;
  const paid    = c.amount_paid ?? 0;
  const balance = Math.max(0, total - paid);
  const pct     = total > 0 ? Math.min(100, (paid / total) * 100) : 0;

  if (!total) return <span className="text-sm text-slate-300">Not set</span>;

  return (
    <div className="space-y-1 min-w-[140px]">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500">{fmt(paid)} paid</span>
        <span className={cn("font-semibold", balance === 0 ? "text-emerald-600" : "text-red-600")}>
          {balance === 0 ? "Settled" : `${fmt(balance)} left`}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            pct >= 100 ? "bg-emerald-500" : pct > 0 ? "bg-blue-500" : "bg-slate-200"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-400">of {fmt(total)} total</p>
    </div>
  );
}

function DueDateCell({ c }: { c: Customer }) {
  const ds = getDateStatus(c);
  const dateStr = c.payment_due_date ? format(new Date(c.payment_due_date), "d MMM yyyy") : null;
  if (!dateStr) return <span className="text-sm text-slate-300">—</span>;
  if (ds === "overdue") return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span className="text-sm font-semibold text-red-600">{dateStr}</span>
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide bg-red-100 text-red-600 rounded px-1.5 py-0.5">
        <AlertTriangle className="h-2.5 w-2.5" /> Overdue
      </span>
    </span>
  );
  if (ds === "due-soon") {
    const days = Math.ceil((new Date(c.payment_due_date!).getTime() - Date.now()) / 86400000);
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-sm font-semibold text-amber-600">{dateStr}</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-600 rounded px-1.5 py-0.5">
          <Clock className="h-2.5 w-2.5" /> {days === 0 ? "Today" : `${days}d`}
        </span>
      </span>
    );
  }
  return <span className="text-sm text-slate-600">{dateStr}</span>;
}

export function EnquiriesClient({ customers: initial, isDemo }: EnquiriesClientProps) {
  const [customers, setCustomers] = useState<Customer[]>(initial);
  const [selected, setSelected]   = useState<Customer | null>(null);
  const [sorting, setSorting]     = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { isNew, markSeen } = useSeenEnquiries();

  function handleUpdated(updated: Customer) {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    toast.success(`${updated.name} updated.`);
  }

  const overdueCount    = customers.filter((c) => getDateStatus(c) === "overdue").length;
  const dueSoonCount    = customers.filter((c) => getDateStatus(c) === "due-soon").length;
  const partialCount    = customers.filter((c) => c.status === "Partial").length;
  const needsQuoteCount = customers.filter((c) => !c.flight_price || c.flight_price === 0).length;

  // Financial totals
  const totalRevenue     = customers.reduce((s, c) => s + (c.amount_paid ?? 0), 0);
  const totalOutstanding = customers
    .filter((c) => c.status !== "Paid")
    .reduce((s, c) => s + Math.max(0, (c.flight_price ?? 0) - (c.amount_paid ?? 0)), 0);

  const columns = useMemo<ColumnDef<Customer>[]>(() => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 text-xs font-semibold text-slate-500 hover:text-slate-900">
          Client <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const ds = getDateStatus(row.original);
        return (
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold",
              ds === "overdue"  ? "bg-red-100 text-red-600"
              : ds === "due-soon" ? "bg-amber-100 text-amber-600"
              : row.original.status === "Paid" ? "bg-emerald-100 text-emerald-600"
              : row.original.status === "Partial" ? "bg-blue-100 text-blue-600"
              : "bg-indigo-50 text-indigo-600"
            )}>
              {row.original.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-medium text-slate-900 whitespace-nowrap">{row.original.name}</p>
                {isNew(row.original.id) && (
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-indigo-600 text-white rounded px-1.5 py-0.5 shrink-0">
                    New
                  </span>
                )}
                {(!row.original.flight_price || row.original.flight_price === 0) ? (
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-orange-500 text-white rounded px-1.5 py-0.5 shrink-0 animate-pulse">
                    Needs Quote
                  </span>
                ) : (
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200 rounded px-1.5 py-0.5 shrink-0">
                    Quoted
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">
                {row.original.destination}
                {(row.original.num_travelers ?? 1) > 1
                  ? ` · 👥 Group (${row.original.num_travelers})`
                  : " · 👤 Individual"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "payment_breakdown",
      accessorFn: (row) => row.flight_price,
      header: () => <span className="text-xs font-semibold text-slate-500">Payment</span>,
      cell: ({ row }) => <PaymentCell c={row.original} />,
    },
    {
      accessorKey: "flight_price",
      header: ({ column }) => (
        <Button variant="ghost" size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 text-xs font-semibold text-slate-500 hover:text-slate-900">
          Total <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className={cn("text-sm font-semibold tabular-nums", getValue() ? "text-slate-800" : "text-slate-300")}>
          {fmt2(getValue() as number | null)}
        </span>
      ),
    },
    {
      accessorKey: "skyrise_reference",
      header: () => <span className="text-xs font-semibold text-slate-500">Skyrise Ref</span>,
      cell: ({ getValue }) => {
        const ref = getValue() as string | null;
        return ref ? (
          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5">
            # {ref}
          </span>
        ) : (
          <span className="text-xs text-slate-300 italic">No ref</span>
        );
      },
    },
    {
      accessorKey: "payment_due_date",
      header: ({ column }) => (
        <Button variant="ghost" size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 text-xs font-semibold text-slate-500 hover:text-slate-900">
          Due Date <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <DueDateCell c={row.original} />,
    },
    {
      accessorKey: "status",
      header: () => <span className="text-xs font-semibold text-slate-500">Status</span>,
      cell: ({ getValue }) => <StatusBadge status={getValue() as CustomerStatus} />,
    },
    {
      id: "actions",
      cell: () => <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400 transition-colors" />,
    },
  ], []);

  const table = useReactTable({
    data: customers, columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Enquiries</h1>
          <p className="text-xs text-slate-500">Invoice tracking, payment status and booking management</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {isDemo && <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100">Demo</Badge>}
          {overdueCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full px-3 py-1">
              <AlertTriangle className="h-3 w-3" /> {overdueCount} overdue
            </span>
          )}
          {dueSoonCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
              <Clock className="h-3 w-3" /> {dueSoonCount} due soon
            </span>
          )}
          {partialCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
              {partialCount} partial
            </span>
          )}
          {needsQuoteCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 animate-pulse">
              ✏️ {needsQuoteCount} need{needsQuoteCount === 1 ? "s" : ""} quote
            </span>
          )}
        </div>
      </header>

      {/* Financial summary strip */}
      <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <PoundSterling className="h-4 w-4 text-emerald-600" />
          <span className="text-xs text-slate-500">Collected</span>
          <span className="text-sm font-bold text-emerald-700">{fmt2(totalRevenue)}</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <PoundSterling className="h-4 w-4 text-red-500" />
          <span className="text-xs text-slate-500">Outstanding</span>
          <span className="text-sm font-bold text-red-600">{fmt2(totalOutstanding)}</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Clients</span>
          <span className="text-sm font-bold text-slate-700">{customers.length}</span>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-medium text-slate-900">All Enquiries</h2>
              <p className="text-xs text-slate-500 mt-0.5">Click a row to update pricing, payments and status</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search…" className="pl-9 h-9 w-52 text-sm border-slate-200 bg-white" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="border-slate-100 hover:bg-transparent bg-slate-50/60">
                    {hg.headers.map((h) => (
                      <TableHead key={h.id} className="text-slate-500">
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-slate-400">
                      No enquiries found.
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.map((row) => {
                  const ds = getDateStatus(row.original);
                  return (
                    <TableRow key={row.id} onClick={() => { setSelected(row.original); markSeen(row.original.id); }} 
                      className={cn(
                        "group cursor-pointer border-slate-100 transition-colors",
                        ds === "overdue"   ? "bg-red-50/40 hover:bg-red-50/70"
                        : ds === "due-soon" ? "bg-amber-50/40 hover:bg-amber-50/70"
                        : "hover:bg-indigo-50/30"
                      )}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3.5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {table.getFilteredRowModel().rows.length} of {customers.length} records
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-red-100" />Overdue</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-amber-100" />Due within 3 days</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-blue-100" />Partial payment</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-orange-400 rounded-sm" />Needs quote</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-100" />Quoted</span>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <CustomerEditDialog customer={selected} open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          onUpdated={handleUpdated} />
      )}
    </div>
  );
}

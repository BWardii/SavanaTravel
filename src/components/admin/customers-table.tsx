"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types";
import { format } from "date-fns";
import { ArrowUpDown, Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomersTableProps {
  customers: Customer[];
  onRowClick: (customer: Customer) => void;
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

function formatCurrency(value: number | null) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "d MMM yyyy");
  } catch {
    return "—";
  }
}

export function CustomersTable({ customers, onRowClick }: CustomersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Client
            <ArrowUpDown className="ml-1.5 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-900">{row.original.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: "destination",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Destination
            <ArrowUpDown className="ml-1.5 h-3 w-3" />
          </Button>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "flight_price",
        header: () => (
          <span className="text-xs font-semibold text-slate-500">Flight Price</span>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-slate-800 tabular-nums">
            {formatCurrency(getValue() as number | null)}
          </span>
        ),
      },
      {
        accessorKey: "payment_due_date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Due Date
            <ArrowUpDown className="ml-1.5 h-3 w-3" />
          </Button>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-600">
            {formatDate(getValue() as string | null)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <span className="text-xs font-semibold text-slate-500">Status</span>
        ),
        cell: ({ getValue }) => (
          <StatusBadge status={getValue() as Customer["status"]} />
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Submitted
            <ArrowUpDown className="ml-1.5 h-3 w-3" />
          </Button>
        ),
        cell: ({ getValue }) => (
          <span className="text-xs text-slate-400">
            {formatDate(getValue() as string)}
          </span>
        ),
      },
      {
        id: "actions",
        cell: () => (
          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: customers,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <div className="px-6 py-3 border-b border-slate-100">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search clients…"
            className="pl-9 h-9 text-sm border-slate-200 bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-slate-100 hover:bg-transparent bg-slate-50/60">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-slate-500">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-slate-400">
                  No contacts found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick(row.original)}
                  className="group cursor-pointer border-slate-100 hover:bg-indigo-50/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="px-6 py-3 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          {table.getFilteredRowModel().rows.length} of {customers.length} records
        </p>
      </div>
    </div>
  );
}

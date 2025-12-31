"use client";
import { DataTable } from "@/components/table/data-table";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { ticketsColumns, SupportTicket } from "./tickets-columns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";

export function TicketsTable({ data }: { data: SupportTicket[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns: ticketsColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
  });
  return (
    <div className="space-y-4">
      <DataTableFilters
        table={table}
        filters={{
          globalSearch: {
            placeholder: "Search tickets...",
            columnId: "subject",
          },
          facetedFilters: [
            {
              columnId: "status",
              title: "Status",
              options: [
                { label: "Open", value: "open" },
                { label: "Pending", value: "pending" },
                { label: "Closed", value: "closed" },
              ],
            },
          ],
        }}
        showViewOptions={false}
      />
      <DataTable table={table} columns={ticketsColumns} />
      <DataTablePagination table={table} />
    </div>
  );
}

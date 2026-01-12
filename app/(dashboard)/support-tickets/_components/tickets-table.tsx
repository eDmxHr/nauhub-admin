"use client";
import { DataTable } from "@/components/table/data-table";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { ticketsColumns } from "./tickets-columns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import { SupportTicketWithUser } from "@/types";

export function TicketsTable({
  data,
  isLoading,
}: {
  data: SupportTicketWithUser[];
  isLoading?: boolean;
}) {
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
                { label: "Awaiting Reply", value: "awaiting_reply" },
                { label: "In Progress", value: "in_progress" },
                { label: "Resolved", value: "resolved" },
                { label: "Closed", value: "closed" },
              ],
            },
            {
              columnId: "priority",
              title: "Priority",
              options: [
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
                { label: "Urgent", value: "urgent" },
              ],
            },
          ],
        }}
        showViewOptions={false}
      />
      <DataTable table={table} columns={ticketsColumns} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </div>
  );
}

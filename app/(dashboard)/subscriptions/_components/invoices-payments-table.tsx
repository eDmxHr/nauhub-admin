"use client";
import React from "react";
import { DataTable } from "@/components/table/data-table";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { invoicesPaymentsColumns } from "./invoices-payments-columns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { PaymentWithRelations } from "@/types";

interface InvoicesPaymentsTableProps {
  data: PaymentWithRelations[];
  isLoading?: boolean;
}

export function InvoicesPaymentsTable({
  data,
  isLoading = false,
}: InvoicesPaymentsTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns: invoicesPaymentsColumns,
    state: {
      rowSelection,
      globalFilter,
      columnFilters,
      sorting,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
    enableRowSelection: true,
  });

  // Filters config for search and filter options
  const filtersConfig = {
    globalSearch: { placeholder: "Search by reference code or user..." },
    facetedFilters: [
      {
        columnId: "status",
        title: "Status",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
        ],
      },
      {
        columnId: "subscription.plan_type",
        title: "Plan Type",
        options: [
          { label: "Monthly", value: "monthly" },
          { label: "Annual", value: "annual" },
        ],
      },
    ],
  };

  return (
    <>
      <div className="space-y-4">
        <DataTableFilters
          table={table}
          filters={filtersConfig}
          showViewOptions={false}
        />
        <DataTable
          table={table}
          columns={invoicesPaymentsColumns}
          isLoading={isLoading}
        />
        <DataTablePagination table={table} />
      </div>
    </>
  );
}

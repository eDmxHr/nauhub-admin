"use client";

import React from "react";
import { DataTable } from "@/components/table/data-table";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { userColumns } from "./_components/columns";
import { mockUsers, UserRow } from "../../data/mock-users";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Card } from "@/components/ui/card";

const users: UserRow[] = mockUsers;

// Mock metrics data
const userMetrics = {
  new_signups: [
    { day: "2025-12-02", signups: 10 },
    { day: "2025-12-03", signups: 12 },
    { day: "2025-12-04", signups: 8 },
    { day: "2025-12-05", signups: 15 },
    { day: "2025-12-06", signups: 9 },
    { day: "2025-12-07", signups: 11 },
    { day: "2025-12-08", signups: 14 },
  ],
};

const userStats = {
  total: 1200,
  active: 950,
  banned: 15,
  newToday: 12,
};

export default function UserManagement() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<
    import("@tanstack/react-table").ColumnFiltersState
  >([]);
  const [sorting, setSorting] = React.useState<
    import("@tanstack/react-table").SortingState
  >([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: users,
    columns: userColumns,
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
    globalSearch: { placeholder: "Search by name or email..." },
    facetedFilters: [
      {
        columnId: "subscription",
        title: "Subscription",
        options: [
          { label: "Premium", value: "Premium" },
          { label: "Free", value: "Free" },
        ],
      },
      {
        columnId: "status",
        title: "Status",
        options: [
          { label: "Active", value: "active" },
          { label: "Banned", value: "banned" },
        ],
      },
    ],
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ title: "User Management", url: "/user-management" }]}
      />
      <PageWrapper
        title="User Management"
        description="Manage users, subscriptions, and access."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Total Users</span>
            <span className="text-2xl font-bold">
              {userStats.total.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Active: {userStats.active.toLocaleString()}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Active Users</span>
            <span className="text-2xl font-bold">
              {userStats.active.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Total: {userStats.total.toLocaleString()}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Banned Users</span>
            <span className="text-2xl font-bold">
              {userStats.banned.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Active: {userStats.active.toLocaleString()}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              New Users Today
            </span>
            <span className="text-2xl font-bold">
              {userStats.newToday.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Yesterday:{" "}
              {userMetrics.new_signups.at(-1)?.signups.toLocaleString()}
            </span>
          </Card>
        </div>
        <DataTableFilters
          table={table}
          filters={filtersConfig}
          showViewOptions={false}
        />
        <DataTable columns={userColumns} table={table} isLoading={isLoading} />
        <DataTablePagination table={table} />
      </PageWrapper>
    </>
  );
}

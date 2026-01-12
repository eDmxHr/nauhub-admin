"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/table/data-table";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { userColumns } from "./_components/columns";
import { useUsers, useUserStats } from "@/hooks/use-users";
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

export default function UserManagement() {
  const router = useRouter();
  const { data: users = [], isLoading } = useUsers();
  const { data: stats } = useUserStats();

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
        columnId: "role",
        title: "Role",
        options: [
          { label: "Admin", value: "admin" },
          { label: "User", value: "user" },
        ],
      },
      {
        columnId: "is_active",
        title: "Status",
        options: [
          { label: "Active", value: "true" },
          { label: "Blocked", value: "false" },
        ],
      },
      {
        columnId: "is_subscribed",
        title: "Subscription",
        options: [
          { label: "Subscribed", value: "true" },
          { label: "Not Subscribed", value: "false" },
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
              {stats?.total_users?.toLocaleString() || 0}
            </span>
            <span className="text-xs text-muted-foreground">
              Active: {stats?.active_users?.toLocaleString() || 0}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Active Users</span>
            <span className="text-2xl font-bold">
              {stats?.active_users?.toLocaleString() || 0}
            </span>
            <span className="text-xs text-muted-foreground">
              Total: {stats?.total_users?.toLocaleString() || 0}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Blocked Users</span>
            <span className="text-2xl font-bold">
              {stats?.blocked_users?.toLocaleString() || 0}
            </span>
            <span className="text-xs text-muted-foreground">
              Admins: {stats?.total_admins?.toLocaleString() || 0}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              Subscribed Users
            </span>
            <span className="text-2xl font-bold">
              {stats?.subscribed_users?.toLocaleString() || 0}
            </span>
            <span className="text-xs text-muted-foreground">
              Phone Verified:{" "}
              {stats?.phone_verified_users?.toLocaleString() || 0}
            </span>
          </Card>
        </div>
        <DataTableFilters
          table={table}
          filters={filtersConfig}
          showViewOptions={false}
        />
        <DataTable
          columns={userColumns}
          table={table}
          isLoading={isLoading}
          onRowClick={(row) => router.push(`/user-management/${row.original.id}`)}
        />
        <DataTablePagination table={table} />
      </PageWrapper>
    </>
  );
}

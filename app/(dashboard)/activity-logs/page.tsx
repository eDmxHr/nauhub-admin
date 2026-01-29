"use client";

import { useState } from "react";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useActivityLogs,
  useActivityLogStats,
  useCriticalActivityLogs,
  useCleanupActivityLogs,
} from "@/hooks/use-activity-logs";
import { DataTable } from "@/components/table/data-table";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { activityLogsColumns } from "./_components/activity-logs-columns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { Trash2, XCircle } from "@/lib/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ActivityLogsPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Fetch all logs without filters - let TanStack Table handle filtering client-side
  const { data: logs, isLoading } = useActivityLogs({
    per_page: 1000, // Fetch a large number to get all logs
  });

  const { data: stats, isLoading: statsLoading } = useActivityLogStats();
  const { data: criticalLogs, isLoading: criticalLoading } =
    useCriticalActivityLogs(5);
  const cleanupLogs = useCleanupActivityLogs();

  const table = useReactTable({
    data: logs?.data.data || [],
    columns: activityLogsColumns,
    state: {
      globalFilter,
      columnFilters,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  const handleCleanup = async () => {
    try {
      const result = await cleanupLogs.mutateAsync();
      toast.success(result.message || "Activity logs cleaned up successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to cleanup activity logs"
      );
      console.error("Error cleaning up logs:", error);
    }
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ title: "Activity Logs", url: "/activity-logs" }]}
      />
      <PageWrapper
        title="Activity Logs"
        description="Monitor and track all system activities"
      >
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              Critical Issues
            </span>
            <span className="text-2xl font-bold text-destructive">
              {statsLoading
                ? "-"
                : stats?.critical_count?.toLocaleString() || "0"}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Errors</span>
            <span className="text-2xl font-bold text-destructive">
              {statsLoading ? "-" : stats?.error_count?.toLocaleString() || "0"}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Total Actions</span>
            <span className="text-2xl font-bold">
              {statsLoading
                ? "-"
                : stats?.by_action
                    ?.reduce((sum, item) => sum + item.count, 0)
                    .toLocaleString() || "0"}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Active Users</span>
            <span className="text-2xl font-bold">
              {statsLoading ? "-" : stats?.most_active_users?.length || 0}
            </span>
          </Card>
        </div>

        {/* Critical Activities */}
        {!criticalLoading && criticalLogs && criticalLogs.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Recent Critical Activities
            </h3>
            <div className="space-y-2">
              {criticalLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="destructive" className="text-xs">
                        {log.severity}
                      </Badge>
                      <span className="text-sm font-medium">{log.action}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {log.description}
                    </p>
                    {log.user && (
                      <p className="text-xs text-muted-foreground mt-1">
                        by {log.user.name}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Filters and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <DataTableFilters
              table={table}
              filters={{
                globalSearch: {
                  placeholder: "Search logs...",
                },
                facetedFilters: [
                  {
                    columnId: "severity",
                    title: "Severity",
                    options: [
                      { label: "Info", value: "info" },
                      { label: "Warning", value: "warning" },
                      { label: "Error", value: "error" },
                      { label: "Critical", value: "critical" },
                    ],
                  },
                  {
                    columnId: "action",
                    title: "Action",
                    options:
                      stats?.by_action?.map((item) => ({
                        label: `${item.action} (${item.count})`,
                        value: item.action,
                      })) || [],
                  },
                  {
                    columnId: "entity",
                    title: "Entity Type",
                    options:
                      stats?.by_entity_type?.map((item) => ({
                        label: `${item.entity_type} (${item.count})`,
                        value: item.entity_type,
                      })) || [],
                  },
                ],
              }}
              showViewOptions={false}
            />
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="ml-4">
                <Trash2 className="h-4 w-4 mr-2" />
                Cleanup Old Logs
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cleanup Old Activity Logs</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all info-level logs older than 30 days.
                  Warning, error, and critical logs will be preserved. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCleanup}
                  disabled={cleanupLogs.isPending}
                >
                  {cleanupLogs.isPending ? "Cleaning up..." : "Cleanup"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Activity Logs Table */}
        <div className="space-y-4">
          <DataTable
            table={table}
            columns={activityLogsColumns}
            isLoading={isLoading}
          />
          <DataTablePagination table={table} />
        </div>
      </PageWrapper>
    </>
  );
}

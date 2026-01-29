"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useNotifications,
  useNotificationStats,
  useMarkAllNotificationsRead,
  useCleanupNotifications,
} from "@/hooks/use-notifications";
import { DataTable } from "@/components/table/data-table";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { notificationsColumns } from "./notifications-columns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertCircle,
  AlertTriangle,
} from "@/lib/icons";
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

export function AdminNotificationsTab() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Fetch all notifications
  const { data: notifications, isLoading } = useNotifications({
    per_page: 1000,
  });

  const { data: stats, isLoading: statsLoading } = useNotificationStats();
  const markAllRead = useMarkAllNotificationsRead();
  const cleanupNotifications = useCleanupNotifications();

  const table = useReactTable({
    data: notifications?.data.data || [],
    columns: notificationsColumns,
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

  const handleMarkAllRead = async () => {
    try {
      const result = await markAllRead.mutateAsync();
      toast.success(
        result.message || `${result.marked_count} notifications marked as read`
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    }
  };

  const handleCleanup = async () => {
    try {
      const result = await cleanupNotifications.mutateAsync(30);
      toast.success(
        result.message ||
          `${result.deleted_count} old notifications cleaned up successfully`
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to cleanup notifications"
      );
    }
  };

  console.log(stats);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 flex flex-col items-start gap-2">
          <span className="text-xs text-muted-foreground">
            Unread Notifications
          </span>
          <span className="text-2xl font-bold text-primary">
            {statsLoading ? "-" : stats?.unread_count?.toLocaleString() || "0"}
          </span>
        </Card>
        <Card className="p-6 flex flex-col items-start gap-2">
          <span className="text-xs text-muted-foreground">Critical Alerts</span>
          <span className="text-2xl font-bold text-destructive">
            {statsLoading
              ? "-"
              : stats?.critical_count?.toLocaleString() || "0"}
          </span>
        </Card>
        <Card className="p-6 flex flex-col items-start gap-2">
          <span className="text-xs text-muted-foreground">High Priority</span>
          <span className="text-2xl font-bold text-destructive">
            {statsLoading
              ? "-"
              : stats?.high_priority_count?.toLocaleString() || "0"}
          </span>
        </Card>
        <Card className="p-6 flex flex-col items-start gap-2">
          <span className="text-xs text-muted-foreground">
            Total Notifications
          </span>
          <span className="text-2xl font-bold">
            {statsLoading
              ? "-"
              : stats?.total_notifications?.toLocaleString() || "0"}
          </span>
        </Card>
      </div>

      {/* Recent Unread Notifications */}
      {!statsLoading &&
        stats?.recent_unread &&
        stats.recent_unread.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Recent Unread Notifications
            </h3>
            <div className="space-y-2">
              {stats.recent_unread.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between p-3 bg-muted/50 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          notification.priority === "critical" ||
                          notification.priority === "high"
                            ? "destructive"
                            : notification.priority === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {notification.priority === "critical" && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {notification.priority === "high" && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {notification.priority}
                      </Badge>
                      <span className="text-sm font-medium">
                        {notification.title}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 w-full">
          <DataTableFilters
            table={table}
            filters={{
              globalSearch: {
                placeholder: "Search notifications...",
              },
              facetedFilters: [
                {
                  columnId: "is_read",
                  title: "Status",
                  options: [
                    { label: "Unread", value: "unread" },
                    { label: "Read", value: "read" },
                  ],
                },
                {
                  columnId: "priority",
                  title: "Priority",
                  options: [
                    { label: "Critical", value: "critical" },
                    { label: "High", value: "high" },
                    { label: "Medium", value: "medium" },
                    { label: "Low", value: "low" },
                  ],
                },
                {
                  columnId: "type",
                  title: "Type",
                  options:
                    stats?.by_type?.map((item) => ({
                      label: `${item.type.replace(/_/g, " ")} (${item.count})`,
                      value: item.type,
                    })) || [],
                },
              ],
            }}
            showViewOptions={false}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markAllRead.isPending || stats?.unread_count === 0}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Cleanup Old
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cleanup Old Notifications</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all read notifications older than 30 days.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCleanup}
                  disabled={cleanupNotifications.isPending}
                >
                  {cleanupNotifications.isPending
                    ? "Cleaning up..."
                    : "Cleanup"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="space-y-4">
        <DataTable
          table={table}
          columns={notificationsColumns}
          isLoading={isLoading}
        />
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}

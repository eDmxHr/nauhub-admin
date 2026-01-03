"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomColumnDef } from "@/types/data-table-columndef";
import {
  Notification,
  useMarkNotificationRead,
  useMarkNotificationUnread,
  useDeleteNotification,
} from "@/hooks/use-notifications";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Bell, BellOff, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { cn, extractDateTime } from "@/lib/utils";

function NotificationDetails({ notification }: { notification: Notification }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium capitalize">
              {notification.type.replace(/_/g, " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Priority:</span>
            <Badge
              variant={
                notification.priority === "critical"
                  ? "destructive"
                  : notification.priority === "high"
                  ? "destructive"
                  : notification.priority === "medium"
                  ? "secondary"
                  : "outline"
              }
            >
              {notification.priority}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span>{notification.is_read ? "Read" : "Unread"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{new Date(notification.created_at).toLocaleString()}</span>
          </div>
          {notification.read_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Read at:</span>
              <span>{new Date(notification.read_at).toLocaleString()}</span>
            </div>
          )}
          {notification.related_activity_log_id && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Activity Log ID:</span>
              <span className="font-mono text-xs">
                {notification.related_activity_log_id}
              </span>
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Title</h4>
        <p className="text-sm font-semibold">{notification.title}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Message</h4>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
      </div>

      {notification.action_url && (
        <div>
          <h4 className="text-sm font-medium mb-2">Action</h4>
          <Button variant="outline" size="sm" asChild>
            <a
              href={notification.action_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              View Details
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

export const notificationsColumns: CustomColumnDef<Notification, any>[] = [
  {
    accessorKey: "is_read",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.is_read ? "outline" : "default"}>
        {row.original.is_read ? "Read" : "Unread"}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const isRead = row.getValue(id);
      return value.includes(isRead ? "read" : "unread");
    },
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.priority === "critical" ||
          row.original.priority === "high"
            ? "destructive"
            : row.original.priority === "medium"
            ? "secondary"
            : "outline"
        }
        className="capitalize"
      >
        {row.original.priority}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">{row.original.type.replace(/_/g, " ")}</span>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className={cn("font-medium", !row.original.is_read && "font-bold")}>
        {row.original.title}
      </div>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <div
        className={cn(
          "max-w-md truncate text-muted-foreground",
          !row.original.is_read && "text-foreground"
        )}
        title={row.original.message}
      >
        {row.original.message}
      </div>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = extractDateTime(row.original.created_at);
      return (
        <div>
          <p>{date.date}</p>
          <p className="text-muted-foreground text-xs">{date.time}</p>
        </div>
      );
    },
    meta: { headerAlign: "left" },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: function ActionsCell({ row }) {
      const [open, setOpen] = useState(false);
      const notification = row.original;
      const markRead = useMarkNotificationRead();
      const markUnread = useMarkNotificationUnread();
      const deleteNotification = useDeleteNotification();

      const handleMarkRead = async () => {
        try {
          await markRead.mutateAsync(notification.id);
          toast.success("Notification marked as read");
        } catch (error: any) {
          toast.error(
            error?.response?.data?.message || "Failed to mark as read"
          );
        }
      };

      const handleMarkUnread = async () => {
        try {
          await markUnread.mutateAsync(notification.id);
          toast.success("Notification marked as unread");
        } catch (error: any) {
          toast.error(
            error?.response?.data?.message || "Failed to mark as unread"
          );
        }
      };

      const handleDelete = async () => {
        try {
          await deleteNotification.mutateAsync(notification.id);
          toast.success("Notification deleted");
        } catch (error: any) {
          toast.error(
            error?.response?.data?.message || "Failed to delete notification"
          );
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpen(true)}>
                View Details
              </DropdownMenuItem>
              {notification.action_url && (
                <DropdownMenuItem asChild>
                  <a
                    href={notification.action_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Action
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {notification.is_read ? (
                <DropdownMenuItem onClick={handleMarkUnread}>
                  <Bell className="h-4 w-4 mr-2" />
                  Mark as Unread
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleMarkRead}>
                  <BellOff className="h-4 w-4 mr-2" />
                  Mark as Read
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Notification Details</SheetTitle>
                <SheetDescription>
                  Detailed information about this notification
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 p-4">
                <NotificationDetails notification={notification} />
              </div>
            </SheetContent>
          </Sheet>
        </>
      );
    },
    meta: { headerAlign: "center", headerWidth: 80 },
  },
];

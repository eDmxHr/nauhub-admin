"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomColumnDef } from "@/types/data-table-columndef";
import { ActivityLog } from "@/hooks/use-activity-logs";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Eye } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function ActivityLogDetails({ log }: { log: ActivityLog }) {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h4 className="text-sm font-medium mb-2">Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Action:</span>
            <span className="font-medium">{log.action}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Severity:</span>
            <Badge
              variant={
                log.severity === "critical" || log.severity === "error"
                  ? "destructive"
                  : log.severity === "warning"
                  ? "secondary"
                  : "outline"
              }
            >
              {log.severity}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">User:</span>
            <span>{log.user?.name || "System"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Entity:</span>
            <span>
              {log.entity_type ? `${log.entity_type} #${log.entity_id}` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">IP Address:</span>
            <span className="font-mono text-xs">{log.ip_address || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{new Date(log.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Description</h4>
        <p className="text-sm text-muted-foreground">{log.description}</p>
      </div>

      {log.metadata && Object.keys(log.metadata).length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Metadata</h4>
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
        </div>
      )}

      {log.user_agent && (
        <div>
          <h4 className="text-sm font-medium mb-2">User Agent</h4>
          <p className="text-xs text-muted-foreground font-mono break-all">
            {log.user_agent}
          </p>
        </div>
      )}
    </div>
  );
}

export const activityLogsColumns: CustomColumnDef<ActivityLog, any>[] = [
  {
    accessorKey: "severity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Severity" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.severity === "critical" ||
          row.original.severity === "error"
            ? "destructive"
            : row.original.severity === "warning"
            ? "secondary"
            : "outline"
        }
      >
        {row.original.severity}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.action}</span>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-md truncate" title={row.original.description}>
        {row.original.description}
      </div>
    ),
    meta: { headerAlign: "left" },
  },
  {
    id: "user",
    accessorFn: (row) => row.user?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.user ? (
          <>
            <div className="font-medium">{row.original.user.name}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.user.email}
            </div>
          </>
        ) : (
          <span className="text-muted-foreground">System</span>
        )}
      </div>
    ),
    meta: { headerAlign: "left" },
  },
  {
    id: "entity",
    accessorFn: (row) => row.entity_type,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entity" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.entity_type ? (
          <>
            <div className="font-medium">{row.original.entity_type}</div>
            <div className="text-xs text-muted-foreground">
              ID: {row.original.entity_id}
            </div>
          </>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
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
      const date = new Date(row.original.created_at);
      return (
        <div>
          <div className="text-sm">{date.toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">
            {date.toLocaleTimeString()}
          </div>
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
      const log = row.original;

      return (
        <>
          <div className="flex justify-center">
            <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Activity Log Details</SheetTitle>
                <SheetDescription>
                  Detailed information about this activity
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <ActivityLogDetails log={log} />
              </div>
            </SheetContent>
          </Sheet>
        </>
      );
    },
    meta: { headerAlign: "center", headerWidth: 80 },
  },
];

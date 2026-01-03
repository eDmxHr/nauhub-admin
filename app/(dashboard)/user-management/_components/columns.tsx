"use client";

import { useState } from "react";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { CustomColumnDef } from "@/types/data-table-columndef";
import { User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Shield, Ban, CheckCircle } from "lucide-react";
import { UserRoleForm } from "@/components/dialogs/user-role-form";
import { UserToggleActiveDialog } from "@/components/dialogs/user-toggle-active-dialog";
import { formatDate } from "@/lib/utils";

export const userColumns: CustomColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium flex items-center gap-2">
          {row.original.name}
          {row.original.role === "admin" && (
            <Shield className="h-3 w-3 text-primary" />
          )}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.email || row.original.phone || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.role === "admin" ? "default" : "secondary"}>
        {row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)}
      </Badge>
    ),
    meta: { headerAlign: "center", headerWidth: 100 },
  },
  {
    accessorKey: "is_subscribed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.is_subscribed ? "default" : "outline"}>
        {row.original.is_subscribed ? "Subscribed" : "Free"}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const boolValue = row.getValue(id) as boolean;
      return value.includes(String(boolValue));
    },
    meta: { headerAlign: "center", headerWidth: 120 },
  },
  {
    accessorKey: "phone_verified",
    header: "Phone Verified",
    cell: ({ row }) => (
      <Badge variant={row.original.phone_verified ? "default" : "outline"}>
        {row.original.phone_verified ? "Verified" : "Not Verified"}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      return formatDate(row.original.created_at);
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "destructive"}>
        {row.original.is_active ? "Active" : "Blocked"}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const boolValue = row.getValue(id) as boolean;
      return value.includes(String(boolValue));
    },
    meta: { headerAlign: "center", headerWidth: 100 },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="flex justify-start"
        column={column}
        title="Actions"
      />
    ),
    cell: function ActionsCell({ row }) {
      const [roleDialogOpen, setRoleDialogOpen] = useState(false);
      const [toggleActiveDialogOpen, setToggleActiveDialogOpen] =
        useState(false);

      const user = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRoleDialogOpen(true)}>
                <Shield className="mr-2 h-4 w-4" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setToggleActiveDialogOpen(true)}>
                {user.is_active ? (
                  <>
                    <Ban className="mr-2 h-4 w-4" />
                    Block User
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Unblock User
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <UserRoleForm
            user={user}
            open={roleDialogOpen}
            onOpenChange={setRoleDialogOpen}
          />

          <UserToggleActiveDialog
            user={user}
            open={toggleActiveDialogOpen}
            onOpenChange={setToggleActiveDialogOpen}
          />
        </>
      );
    },
    meta: { headerAlign: "center", headerWidth: 80 },
  },
];

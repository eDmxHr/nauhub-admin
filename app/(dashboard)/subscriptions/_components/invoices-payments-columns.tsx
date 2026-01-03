"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomColumnDef } from "@/types/data-table-columndef";
import { PaymentWithRelations } from "@/types";
import { PaymentVerificationForm } from "@/components/forms/payment-verification-form";
import { Eye } from "lucide-react";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { formatDate } from "@/lib/utils";

export const invoicesPaymentsColumns: CustomColumnDef<
  PaymentWithRelations,
  any
>[] = [
  {
    accessorKey: "reference_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference Code" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.reference_code}</span>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.user?.name || "N/A"}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.user?.email || row.original.user?.phone || "N/A"}
        </div>
      </div>
    ),
    meta: { headerAlign: "left" },
  },
  {
    id: "subscription.plan_type",
    accessorFn: (row) => row.subscription?.plan_type,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan Type" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.subscription ? "default" : "outline"}>
        {row.original.subscription?.plan_type
          ? row.original.subscription.plan_type.charAt(0).toUpperCase() +
            row.original.subscription.plan_type.slice(1)
          : "N/A"}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const planType = row.original.subscription?.plan_type;
      return value.includes(planType);
    },
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.currency} {row.original.amount}
      </span>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "approved"
            ? "default"
            : row.original.status === "pending"
            ? "secondary"
            : "destructive"
        }
      >
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.created_at);
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
      const payment = row.original;

      return (
        <>
          <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
            <Eye className="h-4 w-4" />
          </Button>

          <PaymentVerificationForm
            payment={payment}
            open={open}
            onOpenChange={setOpen}
          />
        </>
      );
    },
    meta: { headerAlign: "center", headerWidth: 80 },
  },
];

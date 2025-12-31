"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomColumnDef } from "@/types/data-table-columndef";
import { PaymentWithRelations } from "@/types";
import { PaymentVerificationForm } from "@/components/forms/payment-verification-form";
import { Eye } from "lucide-react";

export const invoicesPaymentsColumns: CustomColumnDef<PaymentWithRelations, any>[] = [
  {
    accessorKey: "reference_code",
    header: "Reference Code",
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
    accessorKey: "subscription",
    header: "Plan Type",
    cell: ({ row }) => (
      <Badge variant={row.original.subscription ? "default" : "outline"}>
        {row.original.subscription?.plan_type
          ? row.original.subscription.plan_type.charAt(0).toUpperCase() +
            row.original.subscription.plan_type.slice(1)
          : "N/A"}
      </Badge>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.currency} {row.original.amount}
      </span>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "status",
    header: "Status",
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
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return date.toLocaleDateString();
    },
    meta: { headerAlign: "left" },
  },
  {
    id: "actions",
    header: "Action",
    cell: function ActionsCell({ row }) {
      const [open, setOpen] = useState(false);
      const payment = row.original;

      return (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {payment.status === "pending" ? "Verify" : "View"}
          </Button>

          <PaymentVerificationForm
            payment={payment}
            open={open}
            onOpenChange={setOpen}
          />
        </>
      );
    },
    meta: { headerAlign: "left" },
  },
];

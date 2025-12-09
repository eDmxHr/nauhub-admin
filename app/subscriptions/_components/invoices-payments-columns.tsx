import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CustomColumnDef } from "@/types/data-table-columndef";
import { InvoicePayment } from "./invoices-payments-table";

export const invoicesPaymentsColumns: CustomColumnDef<InvoicePayment, any>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell: ({ row }) => row.original.id,
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.user.name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.user.email}
        </div>
      </div>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <Badge variant={row.original.plan === "Premium" ? "default" : "outline"}>
        {row.original.plan}
      </Badge>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => row.original.amount,
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "paid"
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
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => row.original.date,
    meta: { headerAlign: "left" },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Slip</DialogTitle>
            </DialogHeader>
            <img
              src={row.original.slipUrl}
              alt="Payment Slip"
              className="w-full h-auto rounded border"
              style={{ maxHeight: 400, objectFit: "contain" }}
            />
            <DialogClose asChild>
              <Button variant="outline" className="mt-4 w-full">
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      );
    },
    meta: { headerAlign: "left" },
  },
];

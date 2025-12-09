"use client";
import { DataTable } from "@/components/table/data-table";
import { invoicesPaymentsColumns } from "./invoices-payments-columns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type InvoicePayment = {
  id: string;
  user: { name: string; email: string };
  plan: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  date: string;
  slipUrl: string;
};

export function InvoicesPaymentsTable({ data }: { data: InvoicePayment[] }) {
  const table = useReactTable({
    data,
    columns: invoicesPaymentsColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <>
      <div className="flex justify-start mb-4">
        <h6>Recent Invoices</h6>
      </div>
      <DataTable table={table} columns={invoicesPaymentsColumns} />
    </>
  );
}

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
import { PaymentWithRelations } from "@/types";

interface InvoicesPaymentsTableProps {
  data: PaymentWithRelations[];
  isLoading?: boolean;
}

export function InvoicesPaymentsTable({ data, isLoading = false }: InvoicesPaymentsTableProps) {
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
        <h6>Payment Verification</h6>
      </div>
      <DataTable table={table} columns={invoicesPaymentsColumns} isLoading={isLoading} />
    </>
  );
}

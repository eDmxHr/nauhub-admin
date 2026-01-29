"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { flexRender, Row, Table } from "@tanstack/react-table";

import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CustomColumnDef,
  CustomColumnMeta,
} from "@/types/data-table-columndef";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  table: Table<TData>;
  columns: CustomColumnDef<TData, TValue>[];
  onRowClick?: (row: Row<TData>) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  table,
  isLoading,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full overflow-auto rounded-lg border border-border/50 bg-card shadow-sm">
        <TableComponent className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border/50 hover:bg-transparent">
                {headerGroup.headers.map((header, index) => {
                  const meta = header.column.columnDef.meta as CustomColumnMeta<
                    TData,
                    TValue
                  >;
                  return (
                    <TableHead
                      className={cn(
                        "h-12 whitespace-nowrap bg-muted/30 font-semibold text-muted-foreground border-b border-border/50 px-4",
                        "first:pl-6 last:pr-6",
                        {
                          "text-left": meta?.headerAlign === "left",
                          "text-center": meta?.headerAlign === "center",
                          "text-right": meta?.headerAlign === "right",
                        }
                      )}
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: meta?.headerWidth }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="border-b border-border/30">
                  <TableCell colSpan={columns.length} className="px-4 py-3">
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "border-b border-border/30 transition-colors duration-150",
                    "hover:bg-muted/40",
                    "data-[state=selected]:bg-primary/5 data-[state=selected]:border-primary/20",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isSelectCell = cell.column.id === "select";
                    const isActionCell = cell.column.id === "actions";
                    const shouldHandleClick =
                      onRowClick && !isSelectCell && !isActionCell;

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "px-4 py-3 align-middle",
                          "first:pl-6 last:pr-6",
                          shouldHandleClick && "cursor-pointer"
                        )}
                        onClick={
                          shouldHandleClick ? () => onRowClick(row) : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b border-border/30">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground px-4 py-8"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-medium">No results found</p>
                    <p className="text-xs text-muted-foreground/70">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>
    </div>
  );
}

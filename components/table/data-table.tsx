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
      <div className="w-full overflow-auto rounded-md border dark:border-sidebar-border">
        <TableComponent className="min-w-full dark:bg-card">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const meta = header.column.columnDef.meta as CustomColumnMeta<
                    TData,
                    TValue
                  >;
                  return (
                    <TableHead
                      className={cn(
                        "whitespace-nowrap bg-muted/50 dark:bg-sidebar-accent font-medium text-muted-foreground dark:text-sidebar-foreground border-b dark:border-sidebar-border",
                        index > 1 && "text-left",
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
                <TableRow key={index} className="dark:border-sidebar-border">
                  <TableCell colSpan={columns.length} className="dark:bg-card">
                    <Skeleton className="h-8 w-full dark:bg-sidebar-accent" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 dark:hover:bg-sidebar-accent transition-colors dark:border-sidebar-border dark:data-[state=selected]:bg-sidebar-primary/20"
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
                          "align-center dark:text-card-foreground dark:border-sidebar-border",
                          shouldHandleClick ? "cursor-pointer" : ""
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
              <TableRow className="dark:border-sidebar-border">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground dark:text-sidebar-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>
    </div>
  );
}

"use client";

import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Columns2, Eye, EyeOff } from "@/lib/icons";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Columns2 className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-full"
        onInteractOutside={(e) => {
          // Prevent closing when clicking on the checkbox
          if (
            e.target instanceof HTMLElement &&
            e.target.closest('[role="menuitemcheckbox"]')
          ) {
            e.preventDefault();
          }
        }}
      >
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuPrimitive.CheckboxItem
                key={column.id}
                className={`
                  relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none
                  focus:bg-accent focus:text-accent-foreground
                  data-disabled:pointer-events-none data-disabled:opacity-50
                `}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                onSelect={(e) => {
                  // Prevent menu close on selection
                  e.preventDefault();
                }}
              >
                <span className="flex-1">{column.id}</span>
                <span className="text-muted-foreground">
                  {column.getIsVisible() ? (
                    <Eye className="h-4" />
                  ) : (
                    <EyeOff className="h-4" />
                  )}
                </span>
              </DropdownMenuPrimitive.CheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

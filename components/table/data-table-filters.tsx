"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Option } from "@/types/data-table";

export interface DataTableFilterConfig {
  globalSearch?: {
    placeholder?: string;
    columnId?: string;
  };
  facetedFilters?: Array<{
    columnId: string;
    title: string;
    options: Option[];
  }>;
}

interface DataTableFiltersProps<TData> {
  table: Table<TData>;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  filters?: DataTableFilterConfig;
  showViewOptions?: boolean;
}

export function DataTableFilters<TData>({
  table,
  filters = {},
  showViewOptions = false,
}: DataTableFiltersProps<TData>) {
  const isFiltered = (() => {
    const currentFilters = table.getState().columnFilters;
    const globalFilter = table.getState().globalFilter;

    const hasGlobalFilter =
      filters.globalSearch && globalFilter && globalFilter.length > 0;

    const hasFacetedFilters =
      filters.facetedFilters?.some((configFilter) => {
        const currentFilter = currentFilters.find(
          (f) => f.id === configFilter.columnId
        );
        return (
          currentFilter &&
          currentFilter.value &&
          (Array.isArray(currentFilter.value)
            ? currentFilter.value.length > 0
            : true)
        );
      }) || false;

    return hasGlobalFilter || hasFacetedFilters;
  })();

  // Check if any columns can be hidden
  const hasHideableColumns = table
    .getAllColumns()
    .some(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    );

  const handleGlobalFilterChange = (value: string) => {
    table.setGlobalFilter(value);
  };

  const handleColumnFilterChange = (
    columnId: string,
    value: string[] | undefined
  ) => {
    const column = table.getColumn(columnId);

    if (column) {
      column.setFilterValue(value);
    }
  };

  const handleResetFilters = () => {
    if (filters.globalSearch) {
      table.setGlobalFilter("");
    }

    if (filters.facetedFilters) {
      filters.facetedFilters.forEach((configFilter) => {
        const column = table.getColumn(configFilter.columnId);
        if (column) {
          column.setFilterValue(undefined);
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        {/* Global Search */}
        {filters.globalSearch && (
          <Input
            placeholder={filters.globalSearch.placeholder || "Search..."}
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => handleGlobalFilterChange(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {/* Faceted Filters */}
        {filters.facetedFilters?.map((filter) => (
          <DataTableFacetedFilter
            key={filter.columnId}
            column={table.getColumn(filter.columnId)}
            title={filter.title}
            options={filter.options}
            onValueChange={(value) =>
              handleColumnFilterChange(filter.columnId, value)
            }
          />
        ))}

        {/* Reset Button */}
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {hasHideableColumns && showViewOptions && (
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
        </div>
      )}
    </div>
  );
}

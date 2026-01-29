"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "@/lib/icons";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { DataTable } from "@/components/table/data-table";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import BulkActions from "@/components/table/bulk-actions";
import { TableSkeletonRows } from "@/components/table/table-skeleton-rows";
import { columns, Documentary } from "./_components/columns";

// Mock data for documentaries
const documentaries: Documentary[] = [
  {
    id: 1,
    title: "Planet Earth",
    year: 2006,
    genre: "Nature",
    rating: 9.4,
    duration: "8h 58m",
  },
  {
    id: 2,
    title: "The Last Dance",
    year: 2020,
    genre: "Sports",
    rating: 9.1,
    duration: "8h 10m",
  },
  {
    id: 3,
    title: "Free Solo",
    year: 2018,
    genre: "Adventure",
    rating: 8.1,
    duration: "1h 40m",
  },
];

export default function DocumentariesPage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<
    import("@tanstack/react-table").ColumnFiltersState
  >([]);
  const [sorting, setSorting] = useState<
    import("@tanstack/react-table").SortingState
  >([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Faceted filter options (example: year)
  const yearOptions = useMemo(() => {
    return [...new Set(documentaries.map((d) => String(d.year)))]
      .sort((a, b) => Number(b) - Number(a))
      .map((y) => ({ label: y, value: y }));
  }, [documentaries]);

  const filtersConfig = {
    globalSearch: { placeholder: "Search by title..." },
    facetedFilters: [
      {
        columnId: "year",
        title: "Year",
        options: yearOptions,
      },
      {
        columnId: "genre",
        title: "Genre",
        options: [
          { label: "Nature", value: "Nature" },
          { label: "Sports", value: "Sports" },
          { label: "Adventure", value: "Adventure" },
        ],
      },
    ],
  };

  const table = useReactTable({
    data: documentaries,
    columns,
    state: {
      rowSelection,
      globalFilter,
      columnFilters,
      sorting,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
    enableRowSelection: true,
  });
  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Documentaries" }]} />
      <PageWrapper
        title="Documentaries"
        description="Browse and manage all documentaries."
        renderProps={
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Documentary
          </Button>
        }
      >
        <DataTableFilters
          table={table}
          filters={filtersConfig}
          showViewOptions={false}
        />
        <BulkActions
          table={table}
          actions={<Button variant="destructive">Delete Selected</Button>}
        />
        {isLoading ? (
          <TableSkeletonRows columns={columns} rowCount={10} />
        ) : (
          <DataTable columns={columns} table={table} isLoading={isLoading} />
        )}
        <DataTablePagination table={table} />
      </PageWrapper>
    </>
  );
}

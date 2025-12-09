"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { mockTitles } from "../../data/titles";
import { useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { DataTable } from "@/components/table/data-table";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import BulkActions from "@/components/table/bulk-actions";
import { TableSkeletonRows } from "@/components/table/table-skeleton-rows";
import columns from "./_components/columns";
import MovieGeneralInfo from "@/components/forms/movie-general-info";
import { PlusIcon } from "lucide-react";

export default function Page() {
  // Only show movies
  const [data] = useState(() =>
    mockTitles.filter((t) => t.title_type === "Movie")
  );
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
  const [open, setOpen] = useState(false);

  const table = useReactTable({
    data,
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

  // Faceted filter options (example: year)
  const yearOptions = useMemo(() => {
    return [...new Set(data.map((d) => String(d.release_year)))]
      .sort((a, b) => Number(b) - Number(a))
      .map((y) => ({ label: y, value: y }));
  }, [data]);

  const filtersConfig = {
    globalSearch: { placeholder: "Search by name or description..." },
    facetedFilters: [
      {
        columnId: "release_year",
        title: "Year",
        options: yearOptions,
      },
      {
        columnId: "age_rating",
        title: "Age Rating",
        options: [
          { label: "G", value: "G" },
          { label: "PG", value: "PG" },
          { label: "PG-13", value: "PG-13" },
          { label: "R", value: "R" },
        ],
      },
    ],
  };

  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Movies" }]} />
      <PageWrapper
        title="Movies"
        description="Manage movies in your collection"
        showButton={true}
        setOpen={setOpen}
        buttonLabel="Add Movies"
      >
        <MovieGeneralInfo open={open} onOpenChange={setOpen} />
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

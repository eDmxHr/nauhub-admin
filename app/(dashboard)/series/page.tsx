"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import columns from "./_components/columns";
import { DataTable } from "@/components/table/data-table";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import BulkActions from "@/components/table/bulk-actions";
import { TableSkeletonRows } from "@/components/table/table-skeleton-rows";
import SeriesGeneralInfo from "@/components/forms/series-general-info";
import { mockTitles } from "@/data/titles";

export default function Page() {
  // Only use titles of type 'Series'
  const seriesTitles = useMemo(
    () => mockTitles.filter((t) => t.title_type === "Series"),
    []
  );
  // Count seasons for each series
  const seriesRows = useMemo(() => {
    return seriesTitles.map((title) => {
      const seasons = Array.isArray((title as any).seasons)
        ? (title as any).seasons
        : [];
      return {
        title_id: title.title_id,
        name: title.name,
        release_year: title.release_year,
        age_rating: title.age_rating,
        number_of_seasons: seasons.length,
      };
    });
  }, [seriesTitles]);

  // Faceted filter options (example: year)
  const yearOptions = useMemo(() => {
    return [...new Set(seriesRows.map((d) => String(d.release_year)))]
      .sort((a, b) => Number(b) - Number(a))
      .map((y) => ({ label: y, value: y }));
  }, [seriesRows]);

  const filtersConfig = {
    globalSearch: { placeholder: "Search by name..." },
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
    data: seriesRows,
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
      <PageHeader breadcrumbs={[{ title: "Series" }]} />
      <PageWrapper
        title="Series"
        description="Manage series in your collection"
        showButton={true}
        setOpen={setOpen}
        buttonLabel="Add Series"
      >
        <SeriesGeneralInfo open={open} onOpenChange={setOpen} />
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

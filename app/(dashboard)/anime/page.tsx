"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { createAnimeColumns } from "./_components/columns";
import { DataTable } from "@/components/table/data-table";
import { DataTableFilters } from "@/components/table/data-table-filters";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import BulkActions from "@/components/table/bulk-actions";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import AnimeForm from "@/components/forms/anime-form";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import {
  useVideos,
  useCreateVideo,
  useUpdateVideo,
  useDeleteVideo,
} from "@/hooks/use-videos";
import { Video } from "@/types";

export default function Page() {
  const { data: anime = [], isLoading } = useVideos("anime");
  const createAnimeMutation = useCreateVideo();
  const updateAnimeMutation = useUpdateVideo();
  const deleteAnimeMutation = useDeleteVideo();

  const [open, setOpen] = useState(false);
  const [editingAnime, setEditingAnime] = useState<Video | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAnimeId, setDeleteAnimeId] = useState<string | number | null>(
    null
  );
  const [deleteAnimeTitle, setDeleteAnimeTitle] = useState("");

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const handleEditAnime = (anime: Video) => {
    setEditingAnime(anime);
    setOpen(true);
  };

  const handleDeleteAnime = (id: string | number) => {
    const animeToDelete = anime.find((a) => a.id === id);
    if (animeToDelete) {
      setDeleteAnimeId(id);
      setDeleteAnimeTitle(animeToDelete.title);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteAnimeId) return;
    try {
      await deleteAnimeMutation.mutateAsync(deleteAnimeId);
      setDeleteDialogOpen(false);
      setDeleteAnimeId(null);
      setDeleteAnimeTitle("");
    } catch (error: any) {
      console.error("Failed to delete anime:", error);
    }
  };

  const handleSubmit = async (data: Partial<Video>) => {
    try {
      if (editingAnime) {
        await updateAnimeMutation.mutateAsync({
          id: editingAnime.id,
          data,
        });
      } else {
        await createAnimeMutation.mutateAsync(data);
      }
      setOpen(false);
      setEditingAnime(null);
    } catch (error: any) {
      console.error("Failed to save anime:", error);
    }
  };

  const columns = useMemo(
    () => createAnimeColumns(handleEditAnime, handleDeleteAnime),
    []
  );

  const yearOptions = useMemo(() => {
    return [...new Set(anime.map((d) => String(d.release_year)))]
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a))
      .map((y) => ({ label: y, value: y }));
  }, [anime]);

  const filtersConfig = {
    globalSearch: { placeholder: "Search anime..." },
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
          { label: "TV-Y", value: "TV-Y" },
          { label: "TV-Y7", value: "TV-Y7" },
          { label: "TV-G", value: "TV-G" },
          { label: "TV-PG", value: "TV-PG" },
          { label: "TV-14", value: "TV-14" },
          { label: "TV-MA", value: "TV-MA" },
        ],
      },
    ],
  };

  const table = useReactTable({
    data: anime,
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
      <PageHeader breadcrumbs={[{ title: "Anime" }]} />
      <PageWrapper
        title="Anime"
        description="Manage anime in your collection"
        showButton={true}
        setOpen={() => {
          setEditingAnime(null);
          setOpen(true);
        }}
        buttonLabel="Add Anime"
      >
        <AnimeForm
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setEditingAnime(null);
          }}
          onSubmit={handleSubmit}
          editingAnime={editingAnime}
          isLoading={
            createAnimeMutation.isPending || updateAnimeMutation.isPending
          }
        />
        <DataTableFilters
          table={table}
          filters={filtersConfig}
          showViewOptions={false}
        />
        <BulkActions
          table={table}
          actions={<Button variant="destructive">Delete Selected</Button>}
        />
        <DataTable columns={columns} table={table} isLoading={isLoading} />
        <DataTablePagination table={table} />
      </PageWrapper>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Anime"
        description={`Are you sure you want to delete "${deleteAnimeTitle}"? This will also delete all seasons and episodes. This action cannot be undone.`}
        isLoading={deleteAnimeMutation.isPending}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { DataTable } from "@/components/table/data-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Video } from "@/types";
import { createSeriesColumns } from "./_components/columns";
import SeriesGeneralInfo from "@/components/forms/series-general-info";
import {
  useVideos,
  useCreateVideo,
  useUpdateVideo,
  useDeleteVideo,
} from "@/hooks/use-videos";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

export default function Page() {
  const router = useRouter();

  // API hooks - filter for series only
  const { data: series = [], isLoading } = useVideos("series");
  const createSeriesMutation = useCreateVideo();
  const updateSeriesMutation = useUpdateVideo();
  const deleteSeriesMutation = useDeleteVideo();

  // Dialog states
  const [seriesDialogOpen, setSeriesDialogOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Video | null>(null);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  // Handlers
  const handleSaveSeries = async (data: Partial<Video>) => {
    try {
      if (editingSeries) {
        await updateSeriesMutation.mutateAsync({
          id: editingSeries.id,
          data,
        });
      } else {
        await createSeriesMutation.mutateAsync({ ...data, type: "series" });
      }
      setSeriesDialogOpen(false);
      setEditingSeries(null);
    } catch (error: any) {
      console.error("Failed to save series:", error);
    }
  };

  const handleEditSeries = (series: Video) => {
    setEditingSeries(series);
    setSeriesDialogOpen(true);
  };

  const handleDeleteSeries = (id: string | number) => {
    const seriesItem = series.find((s) => s.id === id);
    if (seriesItem) {
      setDeleteId(id);
      setDeleteTitle(seriesItem.title);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSeriesMutation.mutateAsync(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
      setDeleteTitle("");
    } catch (error: any) {
      console.error("Failed to delete series:", error);
    }
  };

  const handleAddNew = () => {
    setEditingSeries(null);
    setSeriesDialogOpen(true);
  };

  // Create columns with handler functions
  const columns = createSeriesColumns(handleEditSeries, handleDeleteSeries);

  const table = useReactTable({
    data: series,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Series" }]} />
      <PageWrapper
        title="Series"
        description="Manage series in your collection"
        showButton={true}
        setOpen={handleAddNew}
        buttonLabel="Add Series"
      >
        <DataTable
          columns={columns}
          table={table}
          isLoading={isLoading}
          onRowClick={(row) => router.push(`/series/${row.original.id}`)}
        />
      </PageWrapper>

      <SeriesGeneralInfo
        open={seriesDialogOpen}
        onOpenChange={setSeriesDialogOpen}
        onSubmit={handleSaveSeries}
        editingSeries={editingSeries}
        isLoading={
          createSeriesMutation.isPending || updateSeriesMutation.isPending
        }
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Series"
        description={`Are you sure you want to delete "${deleteTitle}"? This action cannot be undone.`}
        isLoading={deleteSeriesMutation.isPending}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { DataTable } from "@/components/table/data-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Video } from "@/types";
import { createMovieColumns } from "./_components/columns";
import { MovieForm } from "./_components/movie-form";
import {
  useVideos,
  useCreateVideo,
  useUpdateVideo,
  useDeleteVideo,
} from "@/hooks/use-videos";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

export default function MoviesPage() {
  const router = useRouter();

  // API hooks - filter for movies only
  const { data: movies = [], isLoading } = useVideos("movie");
  const createMovieMutation = useCreateVideo();
  const updateMovieMutation = useUpdateVideo();
  const deleteMovieMutation = useDeleteVideo();

  // Dialog states
  const [movieDialogOpen, setMovieDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Video | null>(null);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  // Handlers
  const handleSaveMovie = async (data: Partial<Video>) => {
    try {
      if (editingMovie) {
        await updateMovieMutation.mutateAsync({
          id: editingMovie.id,
          data,
        });
      } else {
        await createMovieMutation.mutateAsync(data);
      }
      setMovieDialogOpen(false);
      setEditingMovie(null);
    } catch (error: any) {
      console.error("Failed to save movie:", error);
    }
  };

  const handleEditMovie = (movie: Video) => {
    setEditingMovie(movie);
    setMovieDialogOpen(true);
  };

  const handleDeleteMovie = (id: string | number) => {
    const movie = movies.find((m) => m.id === id);
    if (movie) {
      setDeleteId(id);
      setDeleteTitle(movie.title);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMovieMutation.mutateAsync(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
      setDeleteTitle("");
    } catch (error: any) {
      console.error("Failed to delete movie:", error);
    }
  };

  const handleAddNew = () => {
    setEditingMovie(null);
    setMovieDialogOpen(true);
  };

  // Create columns with handler functions
  const columns = createMovieColumns(handleEditMovie, handleDeleteMovie);

  const table = useReactTable({
    data: movies,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Movies", url: "/movies" }]} />
      <PageWrapper
        title="Movies"
        description="Manage movies in your collection"
        showButton={true}
        setOpen={handleAddNew}
        buttonLabel="Add Movie"
      >
        <DataTable
          columns={columns}
          table={table}
          isLoading={isLoading}
          onRowClick={(row) => router.push(`/movies/${row.original.id}`)}
        />
      </PageWrapper>

      <MovieForm
        open={movieDialogOpen}
        onOpenChange={setMovieDialogOpen}
        onSubmit={handleSaveMovie}
        editingMovie={editingMovie}
        isLoading={
          createMovieMutation.isPending || updateMovieMutation.isPending
        }
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Movie"
        description={`Are you sure you want to delete "${deleteTitle}"? This action cannot be undone.`}
        isLoading={deleteMovieMutation.isPending}
      />
    </>
  );
}

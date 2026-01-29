"use client";

import { useState } from "react";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { DataTable } from "@/components/table/data-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "@/lib/icons";
import { Category, Genre } from "@/types";
import {
  createCategoryColumns,
  createGenreColumns,
} from "./_components/columns";
import { GenreForm } from "./_components/genre-form";
import { CategoryForm } from "./_components/category-form";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import {
  useGenres,
  useCreateGenre,
  useUpdateGenre,
  useDeleteGenre,
} from "@/hooks/use-genres";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-categories";

export default function CategoriesPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState("genres");

  // React Query hooks
  const { data: genres = [], isLoading: genresLoading } = useGenres();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const createGenreMutation = useCreateGenre();
  const updateGenreMutation = useUpdateGenre();
  const deleteGenreMutation = useDeleteGenre();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Genres state
  const [genreDialogOpen, setGenreDialogOpen] = useState(false);
  const [genreFormData, setGenreFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  // Categories state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    sort_order: 0,
    is_active: true,
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"genre" | "category">("genre");
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleteName, setDeleteName] = useState("");

  // Genre handlers
  const handleSaveGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGenre) {
        await updateGenreMutation.mutateAsync({
          id: editingGenre.id,
          data: genreFormData,
        });
      } else {
        await createGenreMutation.mutateAsync(genreFormData);
      }
      setGenreDialogOpen(false);
      resetGenreForm();
    } catch (error: any) {
      console.error("Failed to save genre:", error);
    }
  };

  const handleDeleteGenre = (id: string | number) => {
    const genre = genres.find((g) => g.id === id);
    if (genre) {
      setDeleteType("genre");
      setDeleteId(id);
      setDeleteName(genre.name);
      setDeleteDialogOpen(true);
    }
  };

  const handleEditGenre = (genre: Genre) => {
    setEditingGenre(genre);
    setGenreFormData({
      name: genre.name,
      description: genre.description || "",
      is_active: genre.is_active,
    });
    setGenreDialogOpen(true);
  };

  const resetGenreForm = () => {
    setGenreFormData({
      name: "",
      description: "",
      is_active: true,
    });
    setEditingGenre(null);
  };

  // Category handlers
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          data: categoryFormData,
        });
      } else {
        await createCategoryMutation.mutateAsync(categoryFormData);
      }
      setCategoryDialogOpen(false);
      resetCategoryForm();
    } catch (error: any) {
      console.error("Failed to save category:", error);
    }
  };

  const handleDeleteCategory = (id: string | number) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setDeleteType("category");
      setDeleteId(id);
      setDeleteName(category.name);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      if (deleteType === "genre") {
        await deleteGenreMutation.mutateAsync(deleteId);
      } else {
        await deleteCategoryMutation.mutateAsync(deleteId);
      }
      setDeleteDialogOpen(false);
      setDeleteId(null);
      setDeleteName("");
    } catch (error: any) {
      console.error(`Failed to delete ${deleteType}:`, error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setCategoryDialogOpen(true);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
      sort_order: 0,
      is_active: true,
    });
    setEditingCategory(null);
  };

  // Create columns with handler functions
  const genreColumns = createGenreColumns(handleEditGenre, handleDeleteGenre);
  const categoryColumns = createCategoryColumns(
    handleEditCategory,
    handleDeleteCategory
  );

  const genreTable = useReactTable({
    data: genres,
    columns: genreColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const categoryTable = useReactTable({
    data: categories,
    columns: categoryColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ title: "Categories & Genres", url: "/categories" }]}
      />
      <PageWrapper
        title="Categories & Genres"
        description="Manage content categories and genres for your platform."
        setOpen={() => {}}
      >
        <div className="flex justify-between items-center mb-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="genres">Genres</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
              <Button
                onClick={() => {
                  if (activeTab === "genres") {
                    resetGenreForm();
                    setGenreDialogOpen(true);
                  } else {
                    resetCategoryForm();
                    setCategoryDialogOpen(true);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {activeTab === "genres" ? "Add Genre" : "Add Category"}
              </Button>
            </div>

            <TabsContent value="genres" className="space-y-4 mt-4">
              <DataTable
                columns={genreColumns}
                table={genreTable}
                isLoading={genresLoading}
              />
            </TabsContent>

            <TabsContent value="categories" className="space-y-4 mt-4">
              <DataTable
                columns={categoryColumns}
                table={categoryTable}
                isLoading={categoriesLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </PageWrapper>

      <GenreForm
        open={genreDialogOpen}
        onOpenChange={setGenreDialogOpen}
        editingGenre={editingGenre}
        formData={genreFormData}
        onFormDataChange={setGenreFormData}
        onSubmit={handleSaveGenre}
      />

      <CategoryForm
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        editingCategory={editingCategory}
        formData={categoryFormData}
        onFormDataChange={setCategoryFormData}
        onSubmit={handleSaveCategory}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={`Delete ${deleteType === "genre" ? "Genre" : "Category"}`}
        description={`Are you sure you want to delete "${deleteName}"? This action cannot be undone.`}
        isLoading={
          deleteType === "genre"
            ? deleteGenreMutation.isPending
            : deleteCategoryMutation.isPending
        }
      />
    </>
  );
}

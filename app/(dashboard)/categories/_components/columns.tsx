import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Category, Genre } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

// Genre columns factory function
export const createGenreColumns = (
  handleEditGenre: (genre: Genre) => void,
  handleDeleteGenre: (id: string | number) => void
): ColumnDef<Genre>[] => [
  {
    id: "name",
    header: "Name",
    accessorFn: (row) => row.name,
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    id: "slug",
    header: "Slug",
    accessorFn: (row) => row.slug,
    cell: ({ row }) => <span>{row.original.slug}</span>,
  },
  {
    id: "description",
    header: "Description",
    accessorFn: (row) => row.description,
    cell: ({ row }) => (
      <span className="text-muted-foreground truncate max-w-sm block">
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    id: "is_active",
    header: "Status",
    accessorFn: (row) => row.is_active,
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "secondary"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2 justify-end">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleEditGenre(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleDeleteGenre(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
    meta: { headerAlign: "right" as const },
  },
];

// Category columns factory function
export const createCategoryColumns = (
  handleEditCategory: (category: Category) => void,
  handleDeleteCategory: (id: string | number) => void
): ColumnDef<Category>[] => [
  {
    id: "name",
    header: "Name",
    accessorFn: (row) => row.name,
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    id: "description",
    header: "Description",
    accessorFn: (row) => row.description,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    id: "sort_order",
    header: "Order",
    accessorFn: (row) => row.sort_order,
    cell: ({ row }) => (
      <span className="text-center">{row.original.sort_order}</span>
    ),
  },
  {
    id: "is_active",
    header: "Status",
    accessorFn: (row) => row.is_active,
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "secondary"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2 justify-end">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleEditCategory(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleDeleteCategory(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
    meta: { headerAlign: "right" as const },
  },
];

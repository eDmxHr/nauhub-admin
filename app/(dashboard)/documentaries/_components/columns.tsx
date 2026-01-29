import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { CustomColumnDef } from "@/types/data-table-columndef";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "@/lib/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type Documentary = {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  duration: string;
};

export const columns: CustomColumnDef<Documentary>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    meta: { headerAlign: "left", headerWidth: 200 },
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
    meta: { headerAlign: "center", headerWidth: 80 },
  },
  {
    accessorKey: "genre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Genre" />
    ),
    meta: { headerAlign: "center", headerWidth: 100 },
    cell: ({ row }) => <Badge variant="outline">{row.original.genre}</Badge>,
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    meta: { headerAlign: "center", headerWidth: 80 },
    cell: ({ row }) => (
      <span className="flex items-center gap-1">
        <span className="font-semibold">{row.original.rating}</span>
        <span className="text-muted-foreground text-xs">/10</span>
      </span>
    ),
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    meta: { headerAlign: "center", headerWidth: 100 },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: { headerAlign: "center", headerWidth: 60 },
  },
];

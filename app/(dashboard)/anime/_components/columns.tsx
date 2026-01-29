import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "@/lib/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video } from "@/types";
import { useRouter } from "next/navigation";
import {
  formatBadgeStatusText,
  formatBadgeStatusVariant,
} from "@/lib/format-badge-status";

export const createAnimeColumns = (
  handleEditAnime: (anime: Video) => void,
  handleDeleteAnime: (id: string | number) => void
): ColumnDef<Video>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div
          className="font-medium cursor-pointer hover:underline"
          onClick={() => router.push(`/anime/${row.original.id}`)}
        >
          {row.getValue("title")}
        </div>
      );
    },
  },
  {
    accessorKey: "release_year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("release_year")}</div>
    ),
  },
  {
    accessorKey: "age_rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary">{row.getValue("age_rating")}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="text-center">
          <Badge variant={formatBadgeStatusVariant(status)}>
            {formatBadgeStatusText(status)}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const router = useRouter();
      const anime = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/anime/${anime.id}`)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditAnime(anime)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteAnime(anime.id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { CustomColumnDef } from "@/types/data-table-columndef";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Title } from "@/types/index";

export type SeriesRow = {
  title_id: string;
  name: string;
  release_year: number;
  age_rating: string;
  number_of_seasons: number;
};

const columns: CustomColumnDef<SeriesRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    meta: { headerAlign: "left", headerWidth: 200 },
  },
  {
    accessorKey: "release_year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
    meta: { headerAlign: "center", headerWidth: 80 },
  },
  {
    accessorKey: "age_rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    meta: { headerAlign: "center", headerWidth: 100 },
  },
  {
    accessorKey: "number_of_seasons",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seasons" />
    ),
    meta: { headerAlign: "center", headerWidth: 100 },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const router = useRouter();
      const slug = row.original.name.toLowerCase().replace(/\s+/g, "-");
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/series/${slug}`)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
    meta: { headerAlign: "center", headerWidth: 80 },
  },
];

export default columns;

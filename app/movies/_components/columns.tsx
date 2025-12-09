import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { CustomColumnDef } from "@/types/data-table-columndef";
import { Title } from "@/types/index";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const columns: CustomColumnDef<Title>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
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
      <DataTableColumnHeader column={column} title="Age Rating" />
    ),
    meta: { headerAlign: "center", headerWidth: 100 },
  },
  {
    accessorKey: "duration_minutes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration (min)" />
    ),
    meta: { headerAlign: "center", headerWidth: 120 },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
    meta: { headerAlign: "center", headerWidth: 120 },
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
            <DropdownMenuItem onClick={() => router.push(`/movies/${slug}`)}>
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

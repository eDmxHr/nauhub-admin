import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { CustomColumnDef } from "@/types/data-table-columndef";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

export type UserRow = {
  id: number;
  name: string;
  email: string;
  subscription: string;
  devices: number;
  joined: string;
  status: string;
  isBanned: boolean;
  isNew: boolean;
};

export const userColumns: CustomColumnDef<UserRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium flex items-center gap-2">
          {row.original.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    ),
    meta: { headerAlign: "left", headerWidth: 200 },
  },
  {
    accessorKey: "subscription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.subscription === "Premium" ? "default" : "secondary"
        }
      >
        {row.original.subscription}
      </Badge>
    ),
    meta: { headerAlign: "center", headerWidth: 120 },
  },
  {
    accessorKey: "devices",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Devices" />
    ),
    cell: ({ row }) => row.original.devices,
    meta: { headerAlign: "center", headerWidth: 80 },
  },
  {
    accessorKey: "joined",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => row.original.joined,
    meta: { headerAlign: "center", headerWidth: 120 },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "destructive"}
      >
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </Badge>
    ),
    meta: { headerAlign: "center", headerWidth: 100 },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
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
            <DropdownMenuItem
              onClick={() => router.push(`/user-management/${slug}`)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: { headerAlign: "center", headerWidth: 180 },
  },
];

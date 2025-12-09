import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomColumnDef } from "@/types/data-table-columndef";

export type SupportTicket = {
  id: string;
  user: { name: string; email: string };
  subject: string;
  status: "open" | "pending" | "closed";
  created: string;
};

export const ticketsColumns: CustomColumnDef<SupportTicket, any>[] = [
  {
    accessorKey: "id",
    header: "Ticket ID",
    cell: ({ row }) => row.original.id,
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.user.name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.user.email}
        </div>
      </div>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => row.original.subject,
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "open"
            ? "default"
            : row.original.status === "pending"
            ? "secondary"
            : "destructive"
        }
      >
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </Badge>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => row.original.created,
    meta: { headerAlign: "left" },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Button size="sm" variant="outline">
        View
      </Button>
    ),
    meta: { headerAlign: "left" },
  },
];

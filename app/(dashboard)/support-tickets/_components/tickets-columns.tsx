import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomColumnDef } from "@/types/data-table-columndef";
import { SupportTicketWithUser } from "@/types";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "open":
      return "default";
    case "pending":
    case "awaiting_reply":
      return "secondary";
    case "in_progress":
      return "default";
    case "resolved":
      return "outline";
    case "closed":
      return "destructive";
    default:
      return "secondary";
  }
};

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "default";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "secondary";
  }
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    movie_request: "Movie Request",
    series_request: "Series Request",
    technical_issue: "Technical Issue",
    billing: "Billing",
    account: "Account",
    feedback: "Feedback",
    other: "Other",
  };
  return labels[category] || category;
};

export const ticketsColumns: CustomColumnDef<SupportTicketWithUser, any>[] = [
  {
    accessorKey: "ticket_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket #" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">{row.original.ticket_number}</span>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.user?.name || "N/A"}</div>
        {row.original.user?.email && (
          <div className="text-xs text-muted-foreground">
            {row.original.user.email}
          </div>
        )}
      </div>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate font-medium">{row.original.subject}</div>
    ),
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.status)}>
        {row.original.status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => (
      <Badge variant={getPriorityVariant(row.original.priority)}>
        {row.original.priority.charAt(0).toUpperCase() +
          row.original.priority.slice(1)}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
    meta: { headerAlign: "left" },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => formatDate(row.original.created_at),
    meta: { headerAlign: "left" },
  },
  {
    id: "actions",
    header: "Actions",
    cell: function ActionsCell({ row }) {
      const router = useRouter();
      return (
        <Button
          size="icon"
          variant="ghost"
          onClick={() =>
            router.push(`/support-tickets/${row.original.ticket_number}`)
          }
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
    meta: { headerAlign: "center", headerWidth: 80 },
  },
];

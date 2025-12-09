import { TableItemSkeleton } from "@/components/ui/table-item-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";

interface DataTableSkeletonProps<TData = unknown> {
  columns?: ColumnDef<TData>[];
  columnCount?: number;
  rowCount?: number;
  showHeader?: boolean;
  columnHeaders?: string[];
}

function getAccessorKey<TData>(column: ColumnDef<TData>): string | null {
  const maybeColumn = column as unknown as Record<string, unknown>;
  const key = maybeColumn["accessorKey"];
  return typeof key === "string" ? key : null;
}

function getColumnHeaderTitle<TData>(column: ColumnDef<TData>): string | null {
  if (typeof column.header === "string") {
    return column.header;
  }
  if (typeof column.header === "function") {
    // For function headers, try to extract title from common patterns
    const headerString = column.header.toString();
    const titleMatch = headerString.match(/title["']?:\s*["']([^"']+)["']/);
    if (titleMatch) {
      return titleMatch[1];
    }
  }
  // Fallback to accessorKey if available
  const accessorKey = getAccessorKey(column);
  if (accessorKey) {
    return (
      accessorKey.charAt(0).toUpperCase() +
      accessorKey.slice(1).replace(/_/g, " ")
    );
  }
  return null;
}

function getSkeletonForColumn<TData>(
  column: ColumnDef<TData>,
  columnIndex: number
) {
  const accessorKey = getAccessorKey(column) ?? "";

  // Determine skeleton type based on column properties
  if (
    accessorKey === "name" ||
    accessorKey.includes("user") ||
    columnIndex === 0
  ) {
    // User/name columns with avatar and description
    return <TableItemSkeleton type="avatar" showDescription />;
  }

  if (accessorKey === "members_count" || accessorKey.includes("_count")) {
    // Count badge
    return <TableItemSkeleton type="badge" />;
  }

  if (
    accessorKey === "status" ||
    accessorKey === "is_active" ||
    accessorKey.includes("status") ||
    accessorKey.includes("active")
  ) {
    // Status badge with dot
    return <TableItemSkeleton type="status" />;
  }

  if (
    accessorKey.includes("date") ||
    accessorKey.includes("time") ||
    accessorKey.includes("at") ||
    accessorKey === "created_at" ||
    accessorKey === "updated_at" ||
    accessorKey === "last_login"
  ) {
    // Date/time columns
    return <TableItemSkeleton type="date" />;
  }

  if (
    accessorKey.includes("count") ||
    accessorKey.includes("number") ||
    accessorKey.includes("amount") ||
    accessorKey.includes("price") ||
    accessorKey.includes("total")
  ) {
    // Numeric columns
    return <TableItemSkeleton type="number" />;
  }

  if (accessorKey.includes("email")) {
    // Email columns - slightly wider text
    return <TableItemSkeleton type="text" width="w-40" />;
  }

  if (accessorKey.includes("description")) {
    // Description columns - wider with description
    return <TableItemSkeleton type="text" width="w-48" showDescription />;
  }

  // Default text skeleton
  return <TableItemSkeleton type="text" />;
}

export function DataTableSkeleton<TData>({
  columns,
  columnCount = 4,
  rowCount = 5,
  showHeader = true,
  columnHeaders = [],
}: DataTableSkeletonProps<TData>) {
  // Use columns if provided, otherwise fall back to columnCount
  const actualColumnCount = columns ? columns.length : columnCount;
  const actualColumnHeaders = columns
    ? (columns
        .map((col) => getColumnHeaderTitle(col))
        .filter(Boolean) as string[])
    : columnHeaders;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full overflow-auto rounded-md border">
        <Table className="min-w-full">
          {showHeader && (
            <TableHeader>
              <TableRow>
                {Array.from({ length: actualColumnCount }).map((_, index) => (
                  <TableHead
                    key={index}
                    className="whitespace-nowrap bg-muted/50 font-medium text-muted-foreground"
                  >
                    {actualColumnHeaders[index] ? (
                      <span className="font-medium text-sm">
                        {actualColumnHeaders[index]}
                      </span>
                    ) : (
                      <TableItemSkeleton type="text" width="w-20" />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-muted/50 transition-colors"
              >
                {Array.from({ length: actualColumnCount }).map(
                  (_, cellIndex) => (
                    <TableCell key={cellIndex} className="align-center">
                      {columns && columns[cellIndex] ? (
                        getSkeletonForColumn(columns[cellIndex], cellIndex)
                      ) : cellIndex === 0 ? (
                        // Fallback: First column - user/name with avatar and description
                        <TableItemSkeleton type="avatar" showDescription />
                      ) : cellIndex === 1 ? (
                        // Fallback: Second column - status badge with dot
                        <TableItemSkeleton type="status" />
                      ) : cellIndex === 2 ? (
                        // Fallback: Third column - date
                        <TableItemSkeleton type="date" />
                      ) : (
                        // Fallback: Other columns - date/text
                        <TableItemSkeleton type="date" />
                      )}
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

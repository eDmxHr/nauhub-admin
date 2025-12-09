import { TableRow, TableCell } from "@/components/ui/table";
import { TableItemSkeleton } from "@/components/ui/table-item-skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { CustomColumnMeta } from "@/types/data-table-columndef";

export function getColumnWidth<TData>(
  column: ColumnDef<TData>,
  columnIndex: number
): number {
  const accessorKey = getAccessorKey(column) ?? "";
  const headerTitle = getColumnHeaderTitle(column)?.toLowerCase() ?? "";
  const columnId = (column as { id?: string }).id || accessorKey;
  

  // Handle select/checkbox columns - very compact
  if (columnId === "select" || accessorKey === "select" || headerTitle === "select") {
    return 32; // Very compact for checkbox
  }

  // Handle action columns
  if (columnId === "actions" || accessorKey === "actions" || headerTitle === "actions") {
    return 80; // Action buttons
  }

  // Handle user count columns FIRST (before user avatar check)
  if (accessorKey === "users_count" || accessorKey.includes("_count") || headerTitle === "users") {
    return 80; // Very compact space for user count badges
  }

  // User/person columns with avatar and description
  if (
    accessorKey.includes("user") ||
    accessorKey.includes("customer") ||
    accessorKey.includes("member") ||
    accessorKey.includes("employee") ||
    headerTitle.includes("user") ||
    headerTitle.includes("customer") ||
    headerTitle.includes("member") ||
    headerTitle.includes("employee") ||
    (accessorKey === "name" &&
      (headerTitle === "user" ||
        headerTitle === "customer" ||
        accessorKey.includes("full_name") ||
        accessorKey.includes("user_name") ||
        accessorKey.includes("customer_name")))
  ) {
    return 220; // Avatar + name + description (more reasonable width)
  }

  // Handle nested object accessors
  if (accessorKey.includes(".")) {
    const [parentKey, childKey] = accessorKey.split(".");
    
    if (parentKey === "customer") {
      return 90; // Customer references - very compact
    }
    
    if (parentKey === "user" || parentKey === "member") {
      return 140; // User/member references with avatar (smaller)
    }
    
    if (childKey === "name") {
      return 140; // Product names, business names, etc.
    }
  }

  // Handle customer-specific columns 
  if (headerTitle.includes("customer") || accessorKey.includes("customer")) {
    return 90; // Customer columns - very compact
  }

  // Handle progress bars
  if (accessorKey === "progress" || headerTitle.includes("progress")) {
    return 160; // Progress bars (more compact)
  }

  // Handle priority columns (centered)
  if (accessorKey === "priority" || headerTitle.includes("priority")) {
    return 100; // Priority badges (centered, with some space)
  }

  // Handle assignee columns (with avatars)
  if (accessorKey === "assignee_id" || headerTitle.includes("assignee")) {
    return 140; // Assignee with avatar (compact)
  }

  // Handle name columns - give them more space especially when first column
  if (accessorKey === "name" || accessorKey.includes("name")) {
    if (columnIndex === 0) {
      // First column names should take significant space
      return 250; // More space for team names, business names, etc.
    }
    if (headerTitle.includes("business") || headerTitle.includes("product")) {
      return 200; // Business/product names with descriptions
    }
    return 160; // Simple names
  }

  // Status columns - more compact
  if (
    accessorKey === "status" ||
    accessorKey === "is_active" ||
    accessorKey.includes("status") ||
    accessorKey.includes("active")
  ) {
    return 90; // Status badges (more compact)
  }

  // Date/time columns - more compact
  if (
    accessorKey.includes("date") ||
    accessorKey.includes("time") ||
    accessorKey.includes("at") ||
    accessorKey === "created_at" ||
    accessorKey === "updated_at" ||
    accessorKey === "last_login"
  ) {
    return 100; // Date formats (more compact)
  }

  // Reference/ID columns - more compact
  if (accessorKey === "reference_no" || accessorKey.includes("reference") || accessorKey.includes("_no")) {
    return 110; // Reference numbers (more compact)
  }

  // Branch columns
  if (accessorKey === "branch" || headerTitle.includes("branch")) {
    return 160; // Branch names
  }

  // Email columns
  if (accessorKey.includes("email")) {
    return 180; // Email addresses (more reasonable)
  }

  // Description/note columns
  if (accessorKey.includes("description") || accessorKey.includes("note")) {
    return 200; // Descriptions with more content
  }


  // Badge columns (types, categories, etc.)
  if (
    accessorKey === "type" ||
    accessorKey === "category" ||
    accessorKey === "role" ||
    accessorKey === "account_type" ||
    accessorKey === "team" ||
    accessorKey === "approval_level"
  ) {
    return 100; // Badge content (more compact)
  }

  // Handle tenure specifically (it's a badge)
  if (accessorKey === "requested_tenure" || accessorKey.includes("tenure")) {
    return 100; // Tenure badge (compact)
  }

  // Handle amounts/limits (centered, formatted numbers)
  if (accessorKey === "requested_limit" || headerTitle === "amount") {
    return 110; // Amount columns (centered, formatted)
  }

  // Numeric columns
  if (
    accessorKey.includes("count") ||
    accessorKey.includes("number") ||
    accessorKey.includes("amount") ||
    accessorKey.includes("price") ||
    accessorKey.includes("total") ||
    accessorKey.includes("limit")
  ) {
    return 100; // Numbers (more compact)
  }

  // Default width
  return 100;
}

interface TableSkeletonRowsProps<TData = unknown> {
  columns?: ColumnDef<TData>[];
  columnCount?: number;
  rowCount?: number;
  useFlexibleWidths?: boolean;
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
  columnIndex: number,
  isLastColumn: boolean = false
) {
  const accessorKey = getAccessorKey(column) ?? "";
  const headerTitle = getColumnHeaderTitle(column)?.toLowerCase() ?? "";
  const columnId = (column as { id?: string }).id || accessorKey;

  // Handle last column - always right align (unless it's a special type)
  if (isLastColumn && columnId !== "select" && columnId !== "actions") {
    // For common last column types, use appropriate right-aligned skeletons
    if (accessorKey.includes("date") || accessorKey.includes("time") || accessorKey.includes("at")) {
      return <TableItemSkeleton type="text" className="flex justify-end" width="w-24" />;
    }
    if (accessorKey.includes("amount") || accessorKey.includes("price") || accessorKey.includes("total")) {
      return <TableItemSkeleton type="number-right" />;
    }
    // Default right-aligned text for last column
    return <TableItemSkeleton type="text" className="flex justify-end" width="w-20" />;
  }

  // Handle select/checkbox columns (16x16 as requested)
  if (columnId === "select" || accessorKey === "select" || headerTitle === "select") {
    return <TableItemSkeleton type="select" />;
  }

  // Handle action columns
  if (columnId === "actions" || accessorKey === "actions" || headerTitle === "actions") {
    return <TableItemSkeleton type="action" />;
  }

  // Only show avatar for clearly user-related columns (but NOT customers in general)
  if (
    (accessorKey.includes("user") && !accessorKey.includes("users_count")) ||
    accessorKey.includes("member") ||
    accessorKey.includes("employee") ||
    (headerTitle.includes("user") && !headerTitle.includes("users")) ||
    headerTitle.includes("member") ||
    headerTitle.includes("employee") ||
    (accessorKey === "name" &&
      (headerTitle === "user" ||
        accessorKey.includes("full_name") ||
        accessorKey.includes("user_name")))
  ) {
    // User/person columns with avatar and description (excluding customer lists)
    return <TableItemSkeleton type="avatar" showDescription />;
  }

  // Handle nested object accessors (like "customer.id", "product.name")
  if (accessorKey.includes(".")) {
    const [parentKey, childKey] = accessorKey.split(".");
    
    if (parentKey === "customer") {
      // Customer references - just text with description, no avatar
      return <TableItemSkeleton type="text" width="w-24" showDescription />;
    }
    
    if (parentKey === "user" || parentKey === "member") {
      // User/member references with avatar
      return <TableItemSkeleton type="avatar" showDescription />;
    }
    
    if (childKey === "name") {
      // Product names, business names, etc. with descriptions
      return <TableItemSkeleton type="text" width="w-48" showDescription />;
    }
  }

  // Handle customer-specific columns 
  if (headerTitle.includes("customer") || accessorKey.includes("customer")) {
    // Customer columns show text with descriptions, no avatar
    return <TableItemSkeleton type="text" width="w-24" showDescription />;
  }

  // Handle progress bars
  if (accessorKey === "progress" || headerTitle.includes("progress")) {
    return <TableItemSkeleton type="progress" />;
  }

  // Handle priority columns (centered)
  if (accessorKey === "priority" || headerTitle.includes("priority")) {
    return <TableItemSkeleton type="priority" />;
  }

  // Handle user count badges (not avatars) - very compact
  if (accessorKey === "users_count" || accessorKey.includes("_count") || headerTitle === "users") {
    return <TableItemSkeleton type="badge" />;
  }

  // Handle name columns that are NOT about people (teams, products, etc.)
  if (accessorKey === "name" || accessorKey.includes("name")) {
    // Check if it's likely to have a description/subtitle
    if (columnIndex === 0 || headerTitle.includes("business") || headerTitle.includes("product")) {
      // First column names or business/product names often have descriptions 
      return <TableItemSkeleton type="text" width="w-48" showDescription />;
    }
    return <TableItemSkeleton type="text" width="w-32" />;
  }

  if (
    accessorKey === "type" ||
    accessorKey === "category" ||
    accessorKey === "role" ||
    accessorKey === "account_type" ||
    accessorKey === "branch" ||
    accessorKey === "team" ||
    accessorKey === "priority" ||
    accessorKey === "approval_level"
  ) {
    // Type/category badges
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

  // Handle amounts that might be right-aligned
  if (accessorKey === "total_amount" || accessorKey.includes("total_amount")) {
    return <TableItemSkeleton type="number-right" />;
  }

  if (
    accessorKey.includes("count") ||
    accessorKey.includes("number") ||
    accessorKey.includes("amount") ||
    accessorKey.includes("price") ||
    accessorKey.includes("total") ||
    accessorKey.includes("limit") ||
    accessorKey.includes("tenure") ||
    accessorKey === "requested_limit" ||
    accessorKey === "requested_tenure" ||
    accessorKey.includes("reference") ||
    accessorKey.includes("registry")
  ) {
    // Numeric columns and reference numbers
    return <TableItemSkeleton type="number" />;
  }

  if (accessorKey.includes("email")) {
    // Email columns - slightly wider text
    return <TableItemSkeleton type="text" width="w-40" />;
  }

  if (accessorKey.includes("description") || accessorKey.includes("note")) {
    // Description columns - wider with description
    return <TableItemSkeleton type="text" width="w-48" showDescription />;
  }

  // Default text skeleton
  return <TableItemSkeleton type="text" />;
}

export function TableSkeletonRows<TData>({
  columns,
  columnCount = 4,
  rowCount = 5,
  useFlexibleWidths = false,
}: TableSkeletonRowsProps<TData>) {
  const actualColumnCount = columns ? columns.length : columnCount;

  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow
          key={`skeleton-${rowIndex}`}
          className=""
        >
          {Array.from({ length: actualColumnCount }).map((_, cellIndex) => {
            const column = columns && columns[cellIndex];
            const meta = column?.meta as CustomColumnMeta<TData, unknown>;
            
            // Get the fixed width - either from meta or calculated
            const fixedWidth = meta?.headerWidth || (column ? getColumnWidth(column, cellIndex) : 120);
            
            // Build style object conditionally
            const cellStyle = useFlexibleWidths 
              ? {} 
              : { 
                  width: `${fixedWidth}px`,
                  minWidth: `${fixedWidth}px`,
                  maxWidth: `${fixedWidth}px`
                };
            
            return (
              <TableCell 
                key={cellIndex} 
                className="align-center"
                style={cellStyle}
              >
                {column ? (
                  getSkeletonForColumn(column, cellIndex, cellIndex === actualColumnCount - 1)
                ) : cellIndex === actualColumnCount - 1 ? (
                  // Last column - right aligned
                  <TableItemSkeleton type="text" className="flex justify-end" width="w-24" />
                ) : cellIndex === 0 ? (
                  // Fallback: First column - name/title with description (no avatar)
                  <TableItemSkeleton type="text" width="w-48" showDescription />
                ) : cellIndex === 1 ? (
                  // Fallback: Second column - status badge with dot
                  <TableItemSkeleton type="status" />
                ) : cellIndex === 2 ? (
                  // Fallback: Third column - badge or date
                  <TableItemSkeleton type="badge" />
                ) : (
                  // Fallback: Other columns - date
                  <TableItemSkeleton type="date" />
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export interface TableItemSkeletonProps {
  /**
   * The type of skeleton to render
   */
  type?:
    | "checkbox"
    | "avatar"
    | "text"
    | "badge"
    | "number"
    | "number-right"
    | "date"
    | "status"
    | "status-dot"
    | "action"
    | "select"
    | "progress"
    | "priority";

  /**
   * Custom width for the skeleton (e.g., "w-20", "w-32")
   */
  width?: string;

  /**
   * Custom height for the skeleton (e.g., "h-4", "h-6")
   */
  height?: string;

  /**
   * Whether to show a description line below the main content
   */
  showDescription?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * A consistent table item skeleton component that prevents layout shifts
 * by using consistent dimensions and spacing
 */
export function TableItemSkeleton({
  type = "text",
  width,
  height,
  showDescription = false,
  className = "",
}: TableItemSkeletonProps) {
  const baseClasses = "animate-pulse bg-muted";

  switch (type) {
    case "checkbox":
      return (
        <Skeleton className={`h-4 w-4 rounded ${baseClasses} ${className}`} />
      );

    case "avatar":
      return (
        <div className={`flex items-center gap-3 ${className}`}>
          <Skeleton className={`h-8 w-8 rounded-full ${baseClasses}`} />
          <div className="flex flex-col gap-1">
            <Skeleton className={`h-4 w-24 ${baseClasses}`} />
            {showDescription && (
              <Skeleton className={`h-3 w-32 ${baseClasses}`} />
            )}
          </div>
        </div>
      );

    case "badge":
      return (
        <Skeleton
          className={`h-6 w-20 rounded-md ${baseClasses} ${className}`}
        />
      );

    case "status":
      return (
        <Skeleton
          className={`h-6 w-16 rounded-md ${baseClasses} ${className}`}
        />
      );

    case "status-dot":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <Skeleton className={`h-2 w-2 rounded-full ${baseClasses}`} />
          <Skeleton className={`h-6 w-16 rounded-md ${baseClasses}`} />
        </div>
      );

    case "number":
      return (
        <div className={`flex justify-center ${className}`}>
          <Skeleton className={`h-4 w-16 ${baseClasses}`} />
        </div>
      );

    case "number-right":
      return (
        <div className={`flex justify-end ${className}`}>
          <Skeleton className={`h-4 w-16 ${baseClasses}`} />
        </div>
      );

    case "date":
      return <Skeleton className={`h-4 w-24 ${baseClasses} ${className}`} />;

    case "action":
      return (
        <Skeleton className={`h-8 w-8 rounded ${baseClasses} ${className}`} />
      );

    case "select":
      return (
        <Skeleton className={`h-4 w-4 rounded ${baseClasses} ${className}`} />
      );

    case "progress":
      return (
        <div className={`flex gap-1 items-center justify-center ${className}`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className={`h-1.5 w-12 rounded ${baseClasses}`} />
          ))}
        </div>
      );

    case "priority":
      return (
        <div className={`flex justify-center ${className}`}>
          <Skeleton className={`h-6 w-16 rounded-full ${baseClasses}`} />
        </div>
      );

    case "text":
    default:
      return (
        <div className={className}>
          <Skeleton
            className={`${height || "h-4"} ${width || "w-20"} ${baseClasses}`}
          />
          {showDescription && (
            <Skeleton className={`h-3 w-32 mt-1 ${baseClasses}`} />
          )}
        </div>
      );
  }
}

/**
 * A table row skeleton that maintains consistent row height
 */
export function TableRowSkeleton({
  columnCount,
  types = [],
  className = "",
}: {
  columnCount: number;
  types?: TableItemSkeletonProps["type"][];
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 p-4 border-b ${className}`}>
      {Array.from({ length: columnCount }).map((_, index) => {
        const type = types[index] || "text";
        const isFirst = index === 0;

        return (
          <div key={index} className="flex-1">
            <TableItemSkeleton
              type={type}
              showDescription={isFirst}
              width={isFirst ? "w-32" : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * A table skeleton that maintains consistent layout
 */
export function TableSkeleton({
  rowCount = 5,
  columnCount = 4,
  types = [],
  className = "",
}: {
  rowCount?: number;
  columnCount?: number;
  types?: TableItemSkeletonProps["type"][];
  className?: string;
}) {
  return (
    <div className={`space-y-0 border rounded-md ${className}`}>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRowSkeleton key={index} columnCount={columnCount} types={types} />
      ))}
    </div>
  );
}

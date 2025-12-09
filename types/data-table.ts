import {
  ColumnFiltersState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

export interface RowAction<TData> {
  row: Row<TData>;
  variant: "update" | "delete";
}

export interface Option {
  label: string;
  value: string | number | boolean;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

import { Table } from "@tanstack/react-table";
import { CustomColumnDef } from "./data-table-columndef";

export interface DataTableProps<TData, TValue> {
  columns: CustomColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pageCount?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  manualPagination?: boolean;
  initialPageIndex?: number;
  initialPageSize?: number;
  renderTopBar?: (table: Table<TData>) => React.ReactNode;
  onRowClick?: (row: TData) => void;
  setIsRowSelected?: (boolean: boolean) => void;
  enableRowSelection?: boolean;
  initialSorting?: SortingState;
  initialColumnVisibility?: VisibilityState;
  initialColumnFilters?: ColumnFiltersState;
  initialRowSelection?: RowSelectionState;
}

import { ColumnDef, ColumnMeta } from "@tanstack/react-table";

export interface CustomColumnMeta<TData, TValue>
  extends ColumnMeta<TData, TValue> {
  isVisible?: boolean;
  headerAlign?: "left" | "center" | "right";
  headerWidth?: number;
}

export type CustomColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  accessorKey?: string;
  meta?: CustomColumnMeta<TData, TValue>;
};

import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export default function BulkActions({
  table,
  actions,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>;
  actions: React.ReactNode;
}) {
  return (
    table.getSelectedRowModel().rows.length > 0 && (
      <div className="sticky bottom-12 flex items-center justify-center z-50">
        <div className="bg-background border shadow-xl py-2 px-4 rounded-xl">
          <div className="flex items-center justify-between gap-x-4 min-w-xl">
            <div className="flex gap-2 items-center px-1">
              <p className="text-sm font-medium whitespace-nowrap">
                {table.getSelectedRowModel().rows.length}{" "}
                {table.getSelectedRowModel().rows.length === 1 ? "row" : "rows"}{" "}
                selected
              </p>
            </div>

            <div className="flex items-center">
              <div className="flex items-center space-x-2 flex-shrink-0 border-r pr-4">
                {actions}
              </div>
              <div className="flex items-center gap-2 pl-4">
                <Button
                  variant="ghost"
                  className="border-none"
                  onClick={() => table.toggleAllRowsSelected(true)}
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  className="border-none"
                  onClick={() => table.resetRowSelection()}
                >
                  <X />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

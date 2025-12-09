// Category table columns for DataTable

export const categoryColumns = [
  {
    id: "name",
    header: "Name",
    accessorFn: (row: { name: string }) => row.name,
    cell: ({ row }: any) => (
      <div className="flex items-center h-full">{row.getValue("name")}</div>
    ),
    meta: { headerAlign: "left" as const },
  },
  {
    id: "items",
    header: "Items",
    accessorFn: (row: { items: number }) => row.items,
    cell: ({ row }: any) => (
      <div className="flex items-center justify-center h-full">
        {row.getValue("items")}
      </div>
    ),
    meta: { headerAlign: "center" as const },
  },
  // The actions column should be imported and extended in the page file for access to state
];

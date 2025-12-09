"use client";

import React, { useState } from "react";
import { categoryColumns } from "./_components/columns";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { DataTable } from "@/components/table/data-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const mockContent = [
  { id: 1, name: "The Last Eclipse" },
  { id: 2, name: "Galactic Frontier" },
  { id: 3, name: "Comedy Nights" },
  { id: 4, name: "Romance in Paris" },
  { id: 5, name: "Action Heroes" },
];

export default function Categories() {
  const [categories, setCategories] = useState([
    { name: "Trending Now", items: 12 },
    { name: "Top Rated", items: 8 },
    { name: "New Releases", items: 5 },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  type Category = { name: string; items: number };
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedContent, setSelectedContent] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  function handleAddCategory() {
    if (newCategory && !categories.some((c) => c.name === newCategory)) {
      setCategories([...categories, { name: newCategory, items: 0 }]);
      setNewCategory("");
    }
  }

  const columns = [
    ...categoryColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const cat = row.original;
        return (
          <div className="flex items-center justify-end h-full">
            <Dialog
              open={addDialogOpen && selectedCategory?.name === cat.name}
              onOpenChange={setAddDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedContent([]);
                    setAddDialogOpen(true);
                  }}
                >
                  Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-full">
                <DialogHeader>
                  <DialogTitle>Add Content to {cat.name}</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Search content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="max-h-48 overflow-y-auto mb-4">
                  {mockContent
                    .filter((c) =>
                      c.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((content) => (
                      <label
                        key={content.id}
                        className="flex items-center gap-2 py-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedContent.includes(content.id)}
                          onChange={(e) => {
                            setSelectedContent((prev) =>
                              e.target.checked
                                ? [...prev, content.id]
                                : prev.filter((id) => id !== content.id)
                            );
                          }}
                        />
                        <span>{content.name}</span>
                      </label>
                    ))}
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      if (!cat) return;
                      setCategories((prev) =>
                        prev.map((category) =>
                          category.name === cat.name
                            ? {
                                ...category,
                                items:
                                  (category.items || 0) +
                                  selectedContent.length,
                              }
                            : category
                        )
                      );
                      setAddDialogOpen(false);
                    }}
                    disabled={selectedContent.length === 0}
                  >
                    Add Selected
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
      meta: { headerAlign: "right" as const },
    },
  ];

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Categories", url: "/categories" }]} />
      <PageWrapper
        title="Categories"
        description="Manage your content categories."
        setOpen={() => {}}
      >
        <div className="container mx-auto">
          <DataTable columns={columns} table={table} />
          <div className="flex gap-2 mt-4">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category"
              className="w-64"
            />
            <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
              Add Category
            </Button>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import FormSheet from "@/components/form-sheet";
import { Category } from "@/types";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  formData: {
    name: string;
    description: string;
    sort_order: number;
    is_active: boolean;
  };
  onFormDataChange: (data: {
    name: string;
    description: string;
    sort_order: number;
    is_active: boolean;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CategoryForm({
  open,
  onOpenChange,
  editingCategory,
  formData,
  onFormDataChange,
  onSubmit,
}: CategoryFormProps) {
  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={editingCategory ? "Edit Category" : "Add New Category"}
      description={
        editingCategory
          ? "Update category information"
          : "Create a new category for content organization"
      }
      onSubmit={onSubmit}
      submitButtonText={editingCategory ? "Update Category" : "Create Category"}
      disabled={!formData.name.trim()}
      className="max-w-xl"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category-name">Name</Label>
          <Input
            id="category-name"
            value={formData.name}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                name: e.target.value,
              })
            }
            placeholder="Trending Now"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category-description">Description</Label>
          <Textarea
            id="category-description"
            value={formData.description}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                description: e.target.value,
              })
            }
            placeholder="Currently trending content..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category-order">Sort Order</Label>
          <Input
            id="category-order"
            type="number"
            value={formData.sort_order}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                sort_order: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="category-active"
            checked={formData.is_active}
            onCheckedChange={(checked) =>
              onFormDataChange({
                ...formData,
                is_active: checked,
              })
            }
          />
          <Label htmlFor="category-active">Active</Label>
        </div>
      </div>
    </FormSheet>
  );
}

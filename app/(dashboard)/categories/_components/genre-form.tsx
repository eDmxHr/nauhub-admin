import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import FormSheet from "@/components/form-sheet";
import { Genre } from "@/types";

interface GenreFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGenre: Genre | null;
  formData: {
    name: string;
    description: string;
    is_active: boolean;
  };
  onFormDataChange: (data: {
    name: string;
    description: string;
    is_active: boolean;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function GenreForm({
  open,
  onOpenChange,
  editingGenre,
  formData,
  onFormDataChange,
  onSubmit,
}: GenreFormProps) {
  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={editingGenre ? "Edit Genre" : "Add New Genre"}
      description={
        editingGenre
          ? "Update genre information"
          : "Create a new genre for content classification"
      }
      onSubmit={onSubmit}
      submitButtonText={editingGenre ? "Update Genre" : "Create Genre"}
      disabled={!formData.name.trim()}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="genre-name">Name</Label>
          <Input
            id="genre-name"
            value={formData.name}
            onChange={(e) =>
              onFormDataChange({ ...formData, name: e.target.value })
            }
            placeholder="Action"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="genre-description">Description</Label>
          <Textarea
            id="genre-description"
            value={formData.description}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                description: e.target.value,
              })
            }
            placeholder="Action-packed content with thrilling sequences..."
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="genre-active"
            checked={formData.is_active}
            onCheckedChange={(checked) =>
              onFormDataChange({ ...formData, is_active: checked })
            }
          />
          <Label htmlFor="genre-active">Active</Label>
        </div>
      </div>
    </FormSheet>
  );
}

"use client";

import FormSheet from "../form-sheet";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Season } from "@/hooks/use-seasons";
import { useState, useEffect } from "react";

interface SeasonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Season>) => void;
  editingSeason?: Season | null;
  isLoading?: boolean;
}

export default function SeasonForm({
  open,
  onOpenChange,
  onSubmit,
  editingSeason,
  isLoading = false,
}: SeasonFormProps) {
  const [formData, setFormData] = useState<Partial<Season>>({
    season_number: 1,
    title: "",
    description: "",
    release_year: new Date().getFullYear(),
    thumbnail: "",
    is_published: false,
  });

  useEffect(() => {
    if (editingSeason) {
      setFormData(editingSeason);
    } else {
      setFormData({
        season_number: 1,
        title: "",
        description: "",
        release_year: new Date().getFullYear(),
        thumbnail: "",
        is_published: false,
      });
    }
  }, [editingSeason, open]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={editingSeason ? "Edit Season" : "Add New Season"}
      description="Fill in the season details."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={editingSeason ? "Update Season" : "Create Season"}
      className="sm:max-w-2xl"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="season_number">Season Number</Label>
            <Input
              id="season_number"
              type="number"
              value={formData.season_number || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  season_number: parseInt(e.target.value),
                })
              }
              placeholder="1"
              min={1}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Season title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter season description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="release_year">Release Year</Label>
              <Input
                id="release_year"
                type="number"
                value={formData.release_year || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    release_year: parseInt(e.target.value),
                  })
                }
                min={1900}
                max={2100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="is_published">Published</Label>
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_published: checked })
              }
            />
          </div>
        </div>
      </div>
    </FormSheet>
  );
}

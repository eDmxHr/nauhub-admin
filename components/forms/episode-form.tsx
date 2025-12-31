"use client";

import FormSheet from "../form-sheet";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Episode } from "@/hooks/use-episodes";
import { useState, useEffect } from "react";

interface EpisodeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Episode>) => void;
  editingEpisode?: Episode | null;
  isLoading?: boolean;
}

export default function EpisodeForm({
  open,
  onOpenChange,
  onSubmit,
  editingEpisode,
  isLoading = false,
}: EpisodeFormProps) {
  const [formData, setFormData] = useState<Partial<Episode>>({
    episode_number: 1,
    title: "",
    description: "",
    duration: 0,
    thumbnail: "",
    magnet_url: "",
    status: "pending",
    release_date: new Date().toISOString().split("T")[0],
    is_published: false,
  });

  useEffect(() => {
    if (editingEpisode) {
      setFormData(editingEpisode);
    } else {
      setFormData({
        episode_number: 1,
        title: "",
        description: "",
        duration: 0,
        thumbnail: "",
        magnet_url: "",
        status: "pending",
        release_date: new Date().toISOString().split("T")[0],
        is_published: false,
      });
    }
  }, [editingEpisode, open]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={editingEpisode ? "Edit Episode" : "Add New Episode"}
      description="Fill in the episode details. Magnet URL will trigger video processing."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={editingEpisode ? "Update Episode" : "Create Episode"}
      className="sm:max-w-2xl"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="episode_number">Episode Number</Label>
              <Input
                id="episode_number"
                type="number"
                value={formData.episode_number || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    episode_number: parseInt(e.target.value),
                  })
                }
                placeholder="1"
                min={1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
                placeholder="45"
                min={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Episode Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Episode title"
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
              placeholder="Enter episode description"
              rows={3}
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

          <div className="space-y-2">
            <Label htmlFor="magnet_url">
              Magnet URL {!editingEpisode && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="magnet_url"
              value={formData.magnet_url || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  magnet_url: e.target.value,
                })
              }
              placeholder="magnet:?xt=urn:btih:..."
              required={!editingEpisode}
            />
            <p className="text-xs text-muted-foreground">
              {editingEpisode
                ? "Leave empty to keep existing video"
                : "Backend will process the video and assign Cloudflare Video UID"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status || "pending"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="ready">Ready</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="release_date">Release Date</Label>
              <Input
                id="release_date"
                type="date"
                value={formData.release_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, release_date: e.target.value })
                }
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

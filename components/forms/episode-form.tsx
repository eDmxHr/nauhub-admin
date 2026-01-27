"use client";

import FormSheet from "../form-sheet";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Episode } from "@/hooks/use-episodes";
import { useState, useEffect } from "react";
import { StreamUploader } from "@/components/stream-uploader";
import { toast } from "sonner";
import { videoQualityOptions } from "@/data/qualities";
import { toDateInputValue } from "@/lib/utils";

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
  const [formData, setFormData] = useState<
    Partial<Episode> & { quality?: string }
  >({
    episode_number: 1,
    title: "",
    description: "",
    duration: 0,
    thumbnail: "",
    magnet_url: "",
    status: "pending",
    release_date: toDateInputValue(),
    is_published: false,
    quality: "",
  });
  const [uploadedVideoUid, setUploadedVideoUid] = useState<
    string | undefined
  >();
  const [isUploadInProgress, setIsUploadInProgress] = useState(false);

  useEffect(() => {
    if (editingEpisode) {
      setFormData({
        ...editingEpisode,
        release_date: toDateInputValue(editingEpisode.release_date),
        status: editingEpisode.status || "pending",
      });
      setUploadedVideoUid(editingEpisode.cloudflare_video_uid);
    } else {
      setFormData({
        episode_number: 1,
        title: "",
        description: "",
        duration: 0,
        thumbnail: "",
        magnet_url: "",
        status: "pending",
        release_date: toDateInputValue(),
        is_published: false,
        quality: "",
      });
      setUploadedVideoUid(undefined);
      setIsUploadInProgress(false);
    }
  }, [editingEpisode, open]);

  const handleSubmit = () => {
    // Validate that either magnet_url, uploaded video, or upload in progress
    const hasMagnetUrl =
      formData.magnet_url && formData.magnet_url.trim() !== "";
    const hasUploadedVideo = uploadedVideoUid !== undefined;

    if (
      !editingEpisode &&
      !hasMagnetUrl &&
      !hasUploadedVideo &&
      !isUploadInProgress
    ) {
      toast.error("Please provide either a Magnet URL or upload a video file");
      return;
    }

    // Include cloudflare_video_uid if file was uploaded (or will be uploaded)
    const submitData = {
      ...formData,
      ...(uploadedVideoUid && { cloudflare_video_uid: uploadedVideoUid }),
    };

    // Close the modal after submission
    onSubmit(submitData);
    onOpenChange(false);
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
              Magnet URL{" "}
              {!editingEpisode && (
                <span className="text-muted-foreground">
                  (or upload file below)
                </span>
              )}
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
            />
            <p className="text-xs text-muted-foreground">
              {editingEpisode
                ? "Leave empty to keep existing video"
                : "Provide a magnet URL or upload a video file below"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Or Upload Video File{" "}
              {!editingEpisode && (
                <span className="text-muted-foreground">
                  (or magnet URL above)
                </span>
              )}
            </Label>
            <StreamUploader
              title={formData.title || ""}
              description={formData.description || ""}
              onUploadStart={() => {
                setIsUploadInProgress(true);
              }}
              onUploadComplete={(file) => {
                setIsUploadInProgress(false);
                if (file.uid) {
                  setUploadedVideoUid(file.uid);
                  toast.success("Video uploaded successfully");
                }
              }}
              onUploadError={(error) => {
                setIsUploadInProgress(false);
                toast.error(error.message || "Upload failed");
                setUploadedVideoUid(undefined);
              }}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {uploadedVideoUid
                ? `Video uploaded (UID: ${uploadedVideoUid})`
                : isUploadInProgress
                  ? "Upload in progress... You can submit the form and the upload will continue in the background."
                  : editingEpisode
                    ? "Upload a new video file to replace the existing one"
                    : "Upload a video file directly or provide a magnet URL above"}
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

            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <select
                id="quality"
                value={formData.quality || ""}
                onChange={(e) =>
                  setFormData({ ...formData, quality: e.target.value })
                }
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Select quality</option>
                {videoQualityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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

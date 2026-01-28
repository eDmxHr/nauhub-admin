"use client";

import { useState } from "react";
import FormSheet from "@/components/form-sheet";
import { StreamUploader } from "@/components/stream-uploader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface VideoUploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId?: number;
}

export function VideoUploadForm({ open, onOpenChange, videoId }: VideoUploadFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    // The upload will be triggered when files are selected in StreamUploader
    // We just need to validate the form here
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadComplete = async () => {
    setIsUploading(false);
    // Toast is handled by StreamUploader through notifyUploadComplete
    // Reset form
    setTitle("");
    setDescription("");
    setUploaderKey((prev) => prev + 1); // Force re-render of uploader
    onOpenChange(false);
  };

  const handleUploadError = (error: Error, file: any) => {
    setIsUploading(false);
    toast.error(error.message || "Upload failed");
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          // Reset form when closing
          setTitle("");
          setDescription("");
          setUploaderKey((prev) => prev + 1);
          setIsUploading(false);
        }
        onOpenChange(open);
      }}
      title="Upload Video File"
      description="Upload a video file with title and description"
      onSubmit={handleSubmit}
      isLoading={isUploading}
      submitButtonText="Upload"
      className="max-w-2xl"
      disabled={isUploading}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            required
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description (optional)"
            rows={4}
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label>Video File</Label>
          <StreamUploader
            key={uploaderKey}
            title={title}
            description={description}
            modelType="video"
            modelId={videoId}
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            className="w-full"
          />
        </div>
      </div>
    </FormSheet>
  );
}


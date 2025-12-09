"use client";

import { useState, useRef } from "react";
import * as tus from "tus-js-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, CheckCircle2, AlertCircle, File, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "completed" | "error" | "paused";
  error?: string;
  uid?: string;
}

interface StreamUploaderProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: Error, file: UploadedFile) => void;
  maxFileSize?: number;
  className?: string;
}

export function StreamUploader({
  onUploadComplete,
  onUploadError,
  maxFileSize = 2 * 1024 * 1024 * 1024, // 2GB default
  className,
}: StreamUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadsRef = useRef<Map<string, tus.Upload>>(new Map());

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size exceeds maximum of ${formatFileSize(maxFileSize)}`;
    }

    // Check if it's a video file
    if (!file.type.startsWith("video/")) {
      return "Only video files are allowed";
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const fileId = `${Date.now()}-${file.name}`;

    const validationError = validateFile(file);
    if (validationError) {
      const errorFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "error",
        error: validationError,
      };
      setFiles((prev) => [...prev, errorFile]);
      return;
    }

    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
    };

    setFiles((prev) => [...prev, uploadedFile]);

    try {
      // Get upload URL from our backend
      const response = await fetch("/api/stream/direct-upload", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error response:", errorData);
        throw new Error(
          `Failed to get upload URL: ${response.status} - ${
            errorData.error || errorData.details || "Unknown error"
          }`
        );
      }

      const { uploadURL, uid } = await response.json();

      if (!uploadURL) {
        throw new Error("No upload URL received from server");
      }

      // Upload using FormData (Cloudflare direct upload doesn't support TUS)
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, progress: percentage } : f
            )
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const completedFile = {
            ...uploadedFile,
            status: "completed" as const,
            progress: 100,
            uid,
          };

          setFiles((prev) =>
            prev.map((f) => (f.id === fileId ? completedFile : f))
          );

          if (onUploadComplete) {
            onUploadComplete(completedFile);
          }
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "error" as const,
                    error: `Upload failed: ${xhr.status}`,
                  }
                : f
            )
          );
          if (onUploadError) {
            onUploadError(
              new Error(`Upload failed: ${xhr.status}`),
              uploadedFile
            );
          }
        }
      };

      xhr.onerror = () => {
        const error = new Error("Upload failed");
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: "error" as const, error: error.message }
              : f
          )
        );
        if (onUploadError) {
          onUploadError(error, uploadedFile);
        }
      };

      xhr.open("POST", uploadURL);
      xhr.send(formData);
    } catch (error) {
      console.error("Failed to start upload:", error);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
      if (onUploadError && error instanceof Error) {
        onUploadError(error, uploadedFile);
      }
    }
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    Array.from(fileList).forEach((file) => {
      uploadFile(file);
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const removeFile = (fileId: string) => {
    const upload = uploadsRef.current.get(fileId);
    if (upload) {
      upload.abort();
      uploadsRef.current.delete(fileId);
    }
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const retryUpload = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file && file.status === "error") {
      // Find the original file and retry
      // Note: In a real implementation, you might want to store the original File object
      console.log(
        "Retry not implemented - would need to store original File object"
      );
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-6", className)}>
      <Card>
        <CardHeader className="sr-only">Video Upload</CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-gray-300 hover:border-gray-400"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-200 mb-2">
              Drop video files here or click to browse
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Supports MP4, MOV, AVI and other video formats
            </p>
            <p className="text-xs text-gray-400">
              Maximum file size: {formatFileSize(maxFileSize)}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <File className="h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                        {file.uid && (
                          <span className="ml-2 text-green-600">
                            ID: {file.uid}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === "completed" && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {file.status === "error" && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retryUpload(file.id)}
                        >
                          Retry
                        </Button>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {file.status === "uploading" && (
                  <div className="space-y-1">
                    <Progress value={file.progress} className="w-full" />
                    <p className="text-xs text-gray-500 text-right">
                      {file.progress}%
                    </p>
                  </div>
                )}

                {file.status === "error" && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {file.error}
                  </div>
                )}

                {file.status === "completed" && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    Upload completed successfully!
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

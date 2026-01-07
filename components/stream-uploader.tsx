"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, CheckCircle2, AlertCircle, File, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadStore } from "@/stores/upload-store";

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
  onUploadStart?: (file: UploadedFile) => void;
  maxFileSize?: number;
  className?: string;
  title?: string;
  description?: string;
}

export function StreamUploader({
  onUploadComplete,
  onUploadError,
  onUploadStart,
  maxFileSize = 5 * 1024 * 1024 * 1024, // 5GB default
  className,
  title,
  description,
}: StreamUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadsRef = useRef<Map<string, XMLHttpRequest>>(new Map());
  const { addUpload, updateUpload } = useUploadStore();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
  
    // Cap the display to maxFileSize (5 GB)
    if (bytes >= maxFileSize) return "5 GB";
  
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

    // Check if it's a video file by MIME type
    const isVideoByMimeType = file.type.startsWith("video/");
    
    // Fallback: check file extension if MIME type is not available or not recognized
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv", ".wmv", ".m4v", ".3gp", ".ogv"];
    const fileName = file.name.toLowerCase();
    const isVideoByExtension = videoExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isVideoByMimeType && !isVideoByExtension) {
      return "Only video files are allowed";
    }

    return null;
  };
  

  const uploadFile = async (file: File) => {
    const fileId = `${Date.now()}-${file.name}`;

    // Validate title is provided
    if (!title || !title.trim()) {
      const errorFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "error",
        error: "Title is required before uploading",
      };
      setFiles((prev) => [...prev, errorFile]);
      return;
    }

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
    
    if (onUploadStart) {
      onUploadStart(uploadedFile);
    }

    try {
      // Step 1: Get direct upload URL from backend
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.7:8000/api";
      const createUploadUrlEndpoint = `${baseURL}/admin/cloudflare/create-direct-upload-url`;

      // Get auth token from cookies
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin_auth_token="))
        ?.split("=")[1];

      // Request direct upload URL
      const createUrlResponse = await fetch(createUploadUrlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          max_duration_seconds: 21600, // 6 hours default
        }),
      });

      if (!createUrlResponse.ok) {
        const errorData = await createUrlResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || `Failed to create upload URL: ${createUrlResponse.status}`
        );
      }

      const { upload_url, video_uid } = await createUrlResponse.json();

      if (!upload_url || !video_uid) {
        throw new Error("Invalid response: missing upload_url or video_uid");
      }

      // Register upload for tracking in sidebar
      addUpload(video_uid, file.name, file.size);

      // Step 2: Upload file directly to Cloudflare
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
          // Update progress in store
          updateUpload(video_uid, { progress: percentage });
        }
      };

      xhr.onload = () => {
        // Clean up xhr reference
        uploadsRef.current.delete(fileId);
        
        if (xhr.status === 200 || xhr.status === 201) {
          const completedFile = {
            ...uploadedFile,
            status: "completed" as const,
            progress: 100,
            uid: video_uid,
          };

          setFiles((prev) =>
            prev.map((f) => (f.id === fileId ? completedFile : f))
          );

          // Update store - upload to Cloudflare is complete, but processing may still be in progress
          // The polling in upload-progress page will update the final status
          updateUpload(video_uid, { 
            progress: 100,
            state: "inprogress" // Still processing on Cloudflare side
          });

          if (onUploadComplete) {
            onUploadComplete(completedFile);
          }
        } else {
          let errorMessage = `Upload failed: ${xhr.status}`;
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            // Use default error message
          }

          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "error" as const,
                    error: errorMessage,
                  }
                : f
            )
          );
          // Update store with error
          updateUpload(video_uid, {
            state: "error",
            error: errorMessage,
          });
          if (onUploadError) {
            onUploadError(new Error(errorMessage), uploadedFile);
          }
        }
      };

      xhr.onerror = () => {
        // Clean up xhr reference
        uploadsRef.current.delete(fileId);
        
        const error = new Error("Upload failed");
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: "error" as const, error: error.message }
              : f
          )
        );
        // Update store with error
        updateUpload(video_uid, {
          state: "error",
          error: error.message,
        });
        if (onUploadError) {
          onUploadError(error, uploadedFile);
        }
      };

      xhr.open("POST", upload_url);
      
      // Store xhr for potential abort
      uploadsRef.current.set(fileId, xhr);
      
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
    const xhr = uploadsRef.current.get(fileId);
    if (xhr) {
      xhr.abort();
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
              Supports MP4, MOV, AVI, MKV and other video formats
            </p>
            <p className="text-xs text-gray-400">
              Maximum file size: {formatFileSize(maxFileSize)}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,.mkv,.mp4,.mov,.avi,.webm,.flv,.wmv,.m4v,.3gp,.ogv"
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

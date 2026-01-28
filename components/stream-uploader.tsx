"use client";

import { useState, useRef } from "react";
import * as tus from "tus-js-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, CheckCircle2, AlertCircle, File, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadStore } from "@/stores/upload-store";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

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
  modelType?: "video" | "episode";
  modelId?: number;
}

export function StreamUploader({
  onUploadComplete,
  onUploadError,
  onUploadStart,
  maxFileSize = 5 * 1024 * 1024 * 1024, // 5GB default
  className,
  title,
  description,
  modelType,
  modelId,
}: StreamUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadsRef = useRef<Map<string, XMLHttpRequest | tus.Upload>>(
    new Map(),
  );
  const { addUpload, updateUpload } = useUploadStore();

  // 200MB threshold for TUS vs basic upload
  const TUS_THRESHOLD = 200 * 1024 * 1024; // 200MB

  // Notify backend that upload is complete (for TUS uploads)
  const notifyUploadComplete = async (
    videoUid: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.post("/admin/cloudflare/upload-complete", {
        video_uid: videoUid,
        model_type: modelType,
        model_id: modelId,
      });
      const message = response.data?.message || "Upload completed successfully";
      toast.success(message);
      return { success: true, message };
    } catch (error: any) {
      console.error("Error notifying upload complete:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to complete upload";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

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
    const videoExtensions = [
      ".mp4",
      ".mov",
      ".avi",
      ".mkv",
      ".webm",
      ".flv",
      ".wmv",
      ".m4v",
      ".3gp",
      ".ogv",
    ];
    const fileName = file.name.toLowerCase();
    const isVideoByExtension = videoExtensions.some((ext) =>
      fileName.endsWith(ext),
    );

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
      const baseURL =
        process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.7:8000/api";
      const createUploadUrlEndpoint = `${baseURL}/admin/cloudflare/create-direct-upload-url`;

      // Get auth token from cookies
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin_auth_token="))
        ?.split("=")[1];

      // Determine if we need TUS (files >= 200MB)
      const useTus = file.size >= TUS_THRESHOLD;

      // Request direct upload URL
      const createUrlResponse = await fetch(createUploadUrlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          max_duration_seconds: 21600, // 6 hours default
          use_tus: useTus, // Indicate if TUS is needed
          file_size: file.size, // Send file size for backend to determine method
          title: title, // Pass title for file uploads
        }),
      });

      if (!createUrlResponse.ok) {
        const errorData = await createUrlResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.error ||
            `Failed to create upload URL: ${createUrlResponse.status}`,
        );
      }

      const responseData = await createUrlResponse.json();
      const { upload_url, video_uid, tus_endpoint } = responseData;

      if (!video_uid) {
        throw new Error("Invalid response: missing video_uid");
      }

      // Register upload for tracking in sidebar
      addUpload(video_uid, file.name, file.size);

      // Step 2: Upload file directly to Cloudflare
      // Use TUS for files >= 200MB, basic upload for smaller files
      if (useTus) {
        // For TUS, use tus_endpoint from backend
        if (!tus_endpoint) {
          throw new Error(
            "Large file upload requires TUS protocol. Backend should return 'tus_endpoint' for files >= 200MB.",
          );
        }

        // Use TUS protocol for resumable uploads (files >= 200MB)
        // The tus-js-client handles chunking, resumability, and retries automatically
        // Use smaller chunk size (10MB) for better reliability with Cloudflare
        // Cloudflare recommends 10-20MB chunks
        const chunkSize = 10 * 1024 * 1024; // 10MB chunks

        const tusUpload = new tus.Upload(file, {
          endpoint: tus_endpoint,
          chunkSize: chunkSize,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          removeFingerprintOnSuccess: false, // Keep fingerprint for potential resume
          metadata: {
            filename: file.name,
            filetype: file.type,
          },
          onBeforeRequest: (req) => {
            // Log request for debugging
            console.log(`TUS ${req.getMethod()} to ${req.getURL()}`);
          },
          onAfterResponse: (req, res) => {
            // Log response for debugging
            console.log(
              `TUS response: ${res.getStatus()} for ${req.getMethod()} ${req.getURL()}`,
            );
          },
          onError: (error) => {
            console.error("TUS upload error:", error);
            console.error("Error details:", {
              message: error.message,
              error: error,
            });

            // Don't immediately fail - TUS client will retry automatically
            // Only mark as error if it's a fatal error (403, 404, or explicit abort)
            const errorAny = error as any;
            const status = errorAny.originalRequest?.status;
            const isFatalError =
              status === 403 ||
              status === 404 ||
              error.message?.toLowerCase().includes("abort");

            if (isFatalError) {
              uploadsRef.current.delete(fileId);

              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileId
                    ? {
                        ...f,
                        status: "error" as const,
                        error: error.message || "Upload failed",
                      }
                    : f,
                ),
              );

              updateUpload(video_uid, {
                state: "error",
                error: error.message || "Upload failed",
              });

              toast.error(error.message || "Upload failed");

              if (onUploadError) {
                onUploadError(error, uploadedFile);
              }
            } else {
              // Non-fatal error - TUS client will retry automatically
              // Don't update UI state, let it retry
              console.log("TUS upload error (will retry):", error.message);
            }
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, progress: percentage } : f,
              ),
            );
            updateUpload(video_uid, { progress: percentage });
          },
          onSuccess: () => {
            uploadsRef.current.delete(fileId);

            const completedFile = {
              ...uploadedFile,
              status: "completed" as const,
              progress: 100,
              uid: video_uid,
            };

            setFiles((prev) =>
              prev.map((f) => (f.id === fileId ? completedFile : f)),
            );

            updateUpload(video_uid, {
              progress: 100,
              state: "inprogress", // Still processing on Cloudflare side
            });

            // Only notify upload-complete if modelId is provided (editing existing record)
            // For new records, the parent will call upload-complete after creating the record
            if (modelId) {
              notifyUploadComplete(video_uid);
            } else {
              // For new records, just show a simple upload complete toast
              toast.success("File uploaded to Cloudflare successfully");
              notifyUploadComplete(video_uid);
            }

            if (onUploadComplete) {
              onUploadComplete(completedFile);
            }
          },
        });

        // Store tus upload for potential abort
        uploadsRef.current.set(fileId, tusUpload);

        // Start the upload
        tusUpload.start();
      } else {
        // Use basic FormData upload for files < 200MB
        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, progress: percentage } : f,
              ),
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
              prev.map((f) => (f.id === fileId ? completedFile : f)),
            );

            // Update store - upload to Cloudflare is complete, but processing may still be in progress
            // The polling in upload-progress page will update the final status
            updateUpload(video_uid, {
              progress: 100,
              state: "inprogress", // Still processing on Cloudflare side
            });

            if (onUploadComplete) {
              onUploadComplete(completedFile);
            }
          } else {
            let errorMessage = `Upload failed: ${xhr.status}`;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage =
                errorData.message || errorData.error || errorMessage;
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
                  : f,
              ),
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
                : f,
            ),
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
      }
    } catch (error) {
      console.error("Failed to start upload:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error" as const,
                error: errorMessage,
              }
            : f,
        ),
      );
      toast.error(errorMessage);
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
      if (upload instanceof XMLHttpRequest) {
        upload.abort();
      } else if (upload instanceof tus.Upload) {
        upload.abort();
      }
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
        "Retry not implemented - would need to store original File object",
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
                : "border-gray-300 hover:border-gray-400",
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

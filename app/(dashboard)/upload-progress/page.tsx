"use client";

import { useEffect, useState } from "react";
import { UploadStatus, useUploadStore } from "@/stores/upload-store";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatFileSize } from "@/lib/utils";

export default function UploadProgressPage() {
  const { updateUpload, removeUpload, getUploads, getActiveUploads } = useUploadStore();
  const [activeUploads, setActiveUploads] = useState<UploadStatus[]>([]);
  const [allUploads, setAllUploads] = useState<UploadStatus[]>([]);

  // Subscribe to store changes
  useEffect(() => {
    const updateFromStore = () => {
      const store = useUploadStore.getState();
      setActiveUploads(store.getActiveUploads());
      setAllUploads(store.getUploads());
    };

    // Initial load
    updateFromStore();

    // Subscribe to changes
    const unsubscribe = useUploadStore.subscribe(() => {
      updateFromStore();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (activeUploads.length === 0) {
      return;
    }

    const pollInterval = setInterval(async () => {
      const currentActiveUploads = useUploadStore.getState().getActiveUploads();
      for (const upload of currentActiveUploads) {
        try {
          const response = await api.get(
            `/admin/cloudflare/video/${upload.video_uid}/status`
          );

          const data = response.data;

          if (data.status) {
            updateUpload(upload.video_uid, {
              state: data.status.state === "ready" ? "ready" : "inprogress",
              ready: data.status.ready || false,
              progress: data.status.progress || 0,
              duration: data.status.duration || null,
              size: data.status.size || upload.size,
            });

            // If ready, stop polling for this upload after a delay
            if (data.status.ready) {
              setTimeout(() => {
                removeUpload(upload.video_uid);
              }, 5000); // Remove after 5 seconds of being ready
            }
          }
        } catch (error: any) {
          console.error(`Error polling status for ${upload.video_uid}:`, error);
          updateUpload(upload.video_uid, {
            state: "error",
            error: error.response?.data?.message || "Failed to check status",
          });
        }
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [activeUploads.length, updateUpload, removeUpload]);

  const breadcrumbs = [{ title: "Upload Progress" }];

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageWrapper
        title="Upload Progress"
        description="Track the progress of your video uploads"
      >
        {allUploads.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No active uploads. Start uploading a video to see progress here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {allUploads.map((upload) => (
              <Card key={upload.video_uid}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {upload.fileName}
                      </CardTitle>
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span>Size: {formatFileSize(upload.size)}</span>
                        {upload.duration && (
                          <span>
                            Duration: {Math.floor(upload.duration / 60)}m{" "}
                            {upload.duration % 60}s
                          </span>
                        )}
                        <span>UID: {upload.video_uid}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpload(upload.video_uid)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {upload.state === "ready" && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {upload.state === "error" && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    {upload.state === "inprogress" && (
                      <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    )}
                    <span className="text-sm font-medium">
                      {upload.progress}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {upload.state === "ready"
                        ? "Ready"
                        : upload.state === "error"
                        ? "Error"
                        : "Processing"}
                    </span>
                  </div>

                  {upload.state === "inprogress" && (
                    <Progress value={upload.progress} className="h-2" />
                  )}

                  {upload.state === "ready" && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                      Upload and processing completed successfully!
                    </div>
                  )}

                  {upload.state === "error" && upload.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      {upload.error}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageWrapper>
    </>
  );
}


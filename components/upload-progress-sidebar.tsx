"use client";

import { useUploadStore } from "@/stores/upload-store";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, AlertCircle, Upload } from "lucide-react";

export function UploadProgressSidebar() {
  const { uploads, removeUpload } = useUploadStore();

  const allUploads = Array.from(uploads.values());

  if (allUploads.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        Upload Progress
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {allUploads.map((upload) => (
            <SidebarMenuItem key={upload.video_uid}>
              <div className="space-y-2 p-2 rounded-md bg-sidebar-accent/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {upload.fileName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {upload.state === "ready" && (
                        <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0" />
                      )}
                      {upload.state === "error" && (
                        <AlertCircle className="h-3 w-3 text-red-600 shrink-0" />
                      )}
                      {upload.state === "inprogress" && (
                        <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {upload.progress}%
                      </span>
                      {upload.duration && (
                        <span className="text-xs text-muted-foreground">
                          • {Math.floor(upload.duration / 60)}m
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => removeUpload(upload.video_uid)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {upload.state === "inprogress" && (
                  <Progress value={upload.progress} className="h-1.5" />
                )}

                {upload.state === "ready" && (
                  <div className="text-xs text-green-600">Upload complete</div>
                )}

                {upload.state === "error" && upload.error && (
                  <div className="text-xs text-red-600">{upload.error}</div>
                )}
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

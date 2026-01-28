"use client";

import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { useActiveUploadJobs } from "@/hooks/use-upload-jobs";
import { getUploadJobStatusIcon } from "@/lib/upload-job-status";

export default function UploadProgressPage() {
  const { data: uploadJobs = [], isLoading } = useActiveUploadJobs();

  const breadcrumbs = [{ title: "Upload Progress" }];

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageWrapper
        title="Upload Progress"
        description="Track the progress of your video uploads"
      >
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading upload jobs...</p>
            </CardContent>
          </Card>
        ) : uploadJobs.length === 0 ? (
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
            {uploadJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span>
                          {formatFileSize(job.bytes_transferred)} /{" "}
                          {formatFileSize(job.bytes_total)}
                        </span>
                        <span className="capitalize">{job.upload_method}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getUploadJobStatusIcon(job.status)}
                    <span className="text-sm font-medium">
                      {job.progress_percent}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {job.phase_label}
                    </span>
                  </div>

                  {job.status !== "completed" && job.status !== "error" && (
                    <Progress value={job.progress_percent} className="h-2" />
                  )}

                  {job.status === "completed" && (
                    <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
                      Upload and processing completed successfully!
                    </div>
                  )}

                  {job.status === "error" && (
                    <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-md">
                      {job.phase_label}
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

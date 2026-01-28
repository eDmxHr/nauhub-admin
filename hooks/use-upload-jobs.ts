import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { UploadJobStatus } from "@/lib/upload-job-status";

export interface UploadJob {
  id: number;
  title: string;
  upload_method: string;
  status: UploadJobStatus;
  status_label: string;
  phase_label: string;
  progress_percent: number;
  bytes_transferred: number;
  bytes_total: number;
  created_at: string;
}

interface UploadJobsResponse {
  data: UploadJob[];
}

// Fetch active upload jobs with polling
export function useActiveUploadJobs(pollingInterval = 3000) {
  return useQuery({
    queryKey: ["upload-jobs", "active"],
    queryFn: async () => {
      try {
        const response = await api.get<UploadJobsResponse>(
          "admin/cloudflare/upload-jobs/active"
        );
        return response.data.data ?? [];
      } catch (error) {
        console.error("Error fetching active upload jobs:", error);
        return [];
      }
    },
    refetchInterval: pollingInterval,
  });
}

// Fetch all upload jobs (paginated)
export function useUploadJobs() {
  return useQuery({
    queryKey: ["upload-jobs"],
    queryFn: async () => {
      try {
        const response = await api.get<UploadJobsResponse>(
          "admin/cloudflare/upload-jobs"
        );
        return response.data.data ?? [];
      } catch (error) {
        console.error("Error fetching upload jobs:", error);
        return [];
      }
    },
  });
}

// Fetch single upload job
export function useUploadJob(id: number) {
  return useQuery({
    queryKey: ["upload-jobs", id],
    queryFn: async () => {
      const response = await api.get<{ data: UploadJob }>(
        `admin/cloudflare/upload-jobs/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
    refetchInterval: 3000,
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Video } from "@/types";

// Fetch all videos (with optional type filter)
export function useVideos(type?: "movie" | "series" | "anime") {
  return useQuery({
    queryKey: ["videos", type],
    queryFn: async () => {
      try {
        const url = type ? `admin/videos?type=${type}` : "admin/videos";
        const response = await api.get<{ data: Video[] }>(url);
        const data = response.data.data;

        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching videos:", error);
        return [];
      }
    },
  });
}

// Fetch single video (with seasons and episodes for series)
export function useVideo(id: number) {
  return useQuery({
    queryKey: ["videos", id],
    queryFn: async () => {
      const response = await api.get<{ video: Video }>(`videos/${id}`);
      return response.data.video;
    },
    enabled: !!id,
  });
}

// Create video
export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Video>) => {
      const response = await api.post("/admin/videos", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

// Update video
export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: Partial<Video>;
    }) => {
      const response = await api.put(`/admin/videos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

// Delete video
export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete(`/admin/videos/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

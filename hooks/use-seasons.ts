import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface Season {
  id: string | number;
  video_id: string | number;
  season_number: number;
  title: string;
  description?: string;
  thumbnail?: string;
  release_year?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Create season for a series
export function useCreateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoId,
      data,
    }: {
      videoId: string | number;
      data: Partial<Season>;
    }) => {
      const response = await api.post(
        `/admin/videos/${videoId}/seasons`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["videos", variables.videoId] });
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
    },
  });
}

// Update season
export function useUpdateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: Partial<Season>;
    }) => {
      const response = await api.put(`/admin/seasons/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
    },
  });
}

// Delete season (cascades to episodes)
export function useDeleteSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete(`/admin/seasons/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
    },
  });
}
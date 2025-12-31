import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface Episode {
  id: string | number;
  season_id: string | number;
  episode_number: number;
  title: string;
  description?: string;
  thumbnail?: string;
  cloudflare_video_uid?: string;
  magnet_url?: string;
  status?: string;
  duration?: number;
  release_date?: string;
  is_published?: boolean;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Create episode for a season
export function useCreateEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      seasonId,
      data,
    }: {
      seasonId: string | number;
      data: Partial<Episode>;
    }) => {
      const response = await api.post(
        `/admin/seasons/${seasonId}/episodes`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
  });
}

// Update episode
export function useUpdateEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: Partial<Episode>;
    }) => {
      const response = await api.put(`/admin/episodes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
  });
}

// Delete episode
export function useDeleteEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete(`/admin/episodes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
  });
}
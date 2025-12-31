import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Genre } from "@/types";

// Fetch all genres
export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      try {
        const response = await api.get<{ genres: Genre[] }>("/genres");
        const data = response.data.genres;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching genres:", error);
        return [];
      }
    },
  });
}

// Create genre
export function useCreateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Genre>) => {
      const response = await api.post("/admin/genres", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });
}

// Update genre
export function useUpdateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: Partial<Genre>;
    }) => {
      const response = await api.put(`/admin/genres/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });
}

// Delete genre
export function useDeleteGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete(`/admin/genres/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });
}

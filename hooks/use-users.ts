import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { User, UserWithRelations, UserStats, UserRole } from "@/types";

// Response types
interface UsersResponse {
  data: User[];
}

// Fetch all users
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await api.get<UsersResponse>("/admin/users");
        const data = response.data.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
  });
}

// Fetch user statistics
export function useUserStats() {
  return useQuery({
    queryKey: ["users", "stats"],
    queryFn: async () => {
      try {
        const response = await api.get<UserStats>("/admin/users/stats");
        return response.data;
      } catch (error) {
        console.error("Error fetching user stats:", error);
        throw error;
      }
    },
  });
}

// Fetch single user with relations
export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await api.get<{ user: UserWithRelations }>(`/admin/users/${id}`);
      return response.data.user;
    },
    enabled: !!id,
  });
}

// Change user role
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: number; role: UserRole }) => {
      const response = await api.put(`/admin/users/${id}/role`, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// Toggle user active status (block/unblock)
export function useToggleUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.put(`/admin/users/${id}/toggle-active`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// Plan type for backend API
export interface Plan {
  id: number;
  plan_id: string;
  tier: "basic" | "standard" | "premium";
  name: string;
  duration: "monthly" | "annual";
  price: string;
  currency: string;
  duration_days: number;
  features: string[];
  is_popular: boolean;
  savings_text: string | null;
  discount_text: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Response types
interface PlansResponse {
  plans: Plan[];
}

interface PlanResponse {
  plans: Plan;
  message?: string;
}

interface MessageResponse {
  message: string;
}

// Create/Update plan payload
export interface PlanFormData {
  plan_id: string;
  tier: "basic" | "standard" | "premium";
  name: string;
  duration: "monthly" | "annual";
  price: string;
  currency?: string;
  duration_days: number;
  features: string[];
  is_popular?: boolean;
  savings_text?: string | null;
  discount_text?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

// Fetch all plans (with optional filters)
export function usePlans(filters?: {
  is_active?: boolean;
  duration?: string;
  tier?: string;
}) {
  return useQuery({
    queryKey: ["plans", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.is_active !== undefined) {
          params.append("is_active", String(filters.is_active));
        }
        if (filters?.duration) {
          params.append("duration", filters.duration);
        }
        if (filters?.tier) {
          params.append("tier", filters.tier);
        }

        const url = `/admin/plans${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const response = await api.get<PlansResponse>(url);
        const data = response.data.plans;

        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching plans:", error);
        return [];
      }
    },
  });
}

// Fetch single plan
export function usePlan(id: number) {
  return useQuery({
    queryKey: ["plans", id],
    queryFn: async () => {
      const response = await api.get<PlanResponse>(`/admin/plans/${id}`);
      return response.data.plans;
    },
    enabled: !!id,
  });
}

// Create plan
export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PlanFormData) => {
      const response = await api.post<PlanResponse>("/admin/plans", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

// Update plan
export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PlanFormData }) => {
      const response = await api.put<PlanResponse>(`/admin/plans/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

// Delete plan
export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<MessageResponse>(`/admin/plans/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

// Toggle plan active status
export function useTogglePlanActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.put<MessageResponse>(
        `/admin/plans/${id}/toggle-active`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

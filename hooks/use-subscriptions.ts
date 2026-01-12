import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { SubscriptionWithUser } from "@/types";

// Response types
interface SubscriptionsResponse {
  data: SubscriptionWithUser[];
}

interface SubscriptionResponse {
  data: SubscriptionWithUser;
}

interface SubscriptionStatsResponse {
  data: {
    total_subscriptions: number;
    active_subscriptions: number;
    expired_subscriptions: number;
    cancelled_subscriptions: number;
    total_revenue: string;
    monthly_revenue: string;
    annual_revenue: string;
  };
}

// Fetch all subscriptions
export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      try {
        const response = await api.get<SubscriptionsResponse>("/admin/subscriptions/all");
        const data = response.data.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return [];
      }
    },
  });
}

// Fetch subscription statistics
export function useSubscriptionStats() {
  return useQuery({
    queryKey: ["subscriptions", "stats"],
    queryFn: async () => {
      try {
        const response = await api.get<SubscriptionStatsResponse>(
          "/admin/subscriptions/stats"
        );
        return response.data.data;
      } catch (error) {
        console.error("Error fetching subscription stats:", error);
        throw error;
      }
    },
  });
}

// Fetch single subscription details
export function useSubscription(id: number) {
  return useQuery({
    queryKey: ["subscriptions", id],
    queryFn: async () => {
      try {
        const response = await api.get<SubscriptionResponse>(
          `/admin/subscriptions/${id}`
        );
        return response.data.data;
      } catch (error) {
        console.error("Error fetching subscription:", error);
        throw error;
      }
    },
    enabled: !!id,
  });
}

// Extend/Renew subscription
export function useExtendSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      days,
      planId,
      reason,
      isFree = false,
    }: {
      id: number;
      days?: number;
      planId?: string;
      reason?: string;
      isFree?: boolean;
    }) => {
      const response = await api.post(`/admin/subscriptions/${id}/extend`, {
        days,
        plan_id: planId,
        reason,
        is_free: isFree,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

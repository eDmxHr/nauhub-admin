import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { SubscriptionWithUser } from "@/types";

// Response types
interface SubscriptionsResponse {
  data: SubscriptionWithUser[];
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

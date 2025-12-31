import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Payment, PaymentWithRelations } from "@/types";

// Response types
interface PaymentsResponse {
  data: PaymentWithRelations[];
}

// Fetch all pending payments
export function usePendingPayments() {
  return useQuery({
    queryKey: ["payments", "pending"],
    queryFn: async () => {
      try {
        const response = await api.get<PaymentsResponse>("/admin/payments/pending");
        const data = response.data.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching pending payments:", error);
        return [];
      }
    },
  });
}

// Fetch all payments
export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      try {
        const response = await api.get<PaymentsResponse>("/admin/payments/all");
        const data = response.data.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching payments:", error);
        return [];
      }
    },
  });
}

// Approve payment
export function useApprovePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, admin_notes }: { id: number; admin_notes?: string }) => {
      const response = await api.post(`/admin/payments/${id}/approve`, { admin_notes });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// Reject payment
export function useRejectPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, admin_notes }: { id: number; admin_notes: string }) => {
      const response = await api.post(`/admin/payments/${id}/reject`, { admin_notes });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

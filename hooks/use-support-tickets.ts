import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import {
  SupportTicket,
  SupportTicketWithUser,
  SupportTicketReply,
  SupportTicketStats,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/types";

// Response types
interface SupportTicketsResponse {
  message: string;
  tickets: SupportTicketWithUser[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

interface SupportTicketResponse {
  message: string;
  ticket: SupportTicketWithUser;
  categories?: Record<TicketCategory, string>;
  priorities?: Record<TicketPriority, string>;
  statuses?: Record<TicketStatus, string>;
}

interface SupportTicketStatsResponse {
  data: SupportTicketStats;
}

interface TicketCategoriesResponse {
  categories: TicketCategory[];
  priorities: TicketPriority[];
}

// Fetch ticket statistics
export function useSupportTicketStats() {
  return useQuery({
    queryKey: ["support-tickets", "stats"],
    queryFn: async () => {
      try {
        const response = await api.get<SupportTicketStatsResponse>(
          "/admin/support/stats"
        );
        return response.data?.data || {
          total: 0,
          open: 0,
          pending: 0,
          in_progress: 0,
          resolved: 0,
          closed: 0,
          by_category: {} as Record<TicketCategory, number>,
          by_priority: {} as Record<TicketPriority, number>,
        };
      } catch (error) {
        console.error("Error fetching ticket stats:", error);
        // Return default stats object instead of throwing
        return {
          total: 0,
          open: 0,
          pending: 0,
          in_progress: 0,
          resolved: 0,
          closed: 0,
          by_category: {} as Record<TicketCategory, number>,
          by_priority: {} as Record<TicketPriority, number>,
        };
      }
    },
  });
}

// Fetch ticket categories and priorities
export function useTicketCategories() {
  return useQuery({
    queryKey: ["support-tickets", "categories"],
    queryFn: async () => {
      try {
        const response = await api.get<TicketCategoriesResponse>(
          "/admin/support/categories"
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching ticket categories:", error);
        throw error;
      }
    },
  });
}

// Fetch all tickets with filters
export function useSupportTickets(filters?: {
  status?: TicketStatus;
  category?: TicketCategory;
  priority?: TicketPriority;
  assigned_to?: number;
}) {
  return useQuery({
    queryKey: ["support-tickets", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.status) params.append("status", filters.status);
        if (filters?.category) params.append("category", filters.category);
        if (filters?.priority) params.append("priority", filters.priority);
        if (filters?.assigned_to)
          params.append("assigned_to", filters.assigned_to.toString());

        const url = `/admin/support/tickets${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const response = await api.get<SupportTicketsResponse>(url);
        const data = response.data.tickets || [];
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching support tickets:", error);
        return [];
      }
    },
  });
}

// Fetch single ticket details
export function useSupportTicket(ticketNumber: string) {
  return useQuery({
    queryKey: ["support-tickets", ticketNumber],
    queryFn: async () => {
      try {
        const response = await api.get<SupportTicketResponse>(
          `/admin/support/tickets/${ticketNumber}`
        );
        return response.data.ticket;
      } catch (error) {
        console.error("Error fetching support ticket:", error);
        throw error;
      }
    },
    enabled: !!ticketNumber,
  });
}

// Assign ticket to admin
export function useAssignTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketNumber,
      adminId,
    }: {
      ticketNumber: string;
      adminId: number;
    }) => {
      const response = await api.post(
        `/admin/support/tickets/${ticketNumber}/assign`,
        { admin_id: adminId }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["support-tickets", variables.ticketNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["support-tickets", "stats"] });
    },
  });
}

// Update ticket status
export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketNumber,
      status,
    }: {
      ticketNumber: string;
      status: TicketStatus;
    }) => {
      const response = await api.put(
        `/admin/support/tickets/${ticketNumber}/status`,
        { status }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["support-tickets", variables.ticketNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["support-tickets", "stats"] });
    },
  });
}

// Update ticket priority
export function useUpdateTicketPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketNumber,
      priority,
    }: {
      ticketNumber: string;
      priority: TicketPriority;
    }) => {
      const response = await api.put(
        `/admin/support/tickets/${ticketNumber}/priority`,
        { priority }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["support-tickets", variables.ticketNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["support-tickets", "stats"] });
    },
  });
}

// Add admin reply to ticket
export function useAddTicketReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketNumber,
      message,
      attachments,
      isInternalNote = false,
    }: {
      ticketNumber: string;
      message: string;
      attachments?: string[];
      isInternalNote?: boolean;
    }) => {
      const response = await api.post(
        `/admin/support/tickets/${ticketNumber}/reply`,
        {
          message,
          attachments: attachments || [],
          is_internal_note: isInternalNote,
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["support-tickets", variables.ticketNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["support-tickets", "stats"] });
    },
  });
}

// Resolve ticket
export function useResolveTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketNumber,
      resolutionNotes,
    }: {
      ticketNumber: string;
      resolutionNotes?: string;
    }) => {
      const response = await api.post(
        `/admin/support/tickets/${ticketNumber}/resolve`,
        { resolution_notes: resolutionNotes }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["support-tickets", variables.ticketNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["support-tickets", "stats"] });
    },
  });
}

// Close ticket
export function useCloseTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketNumber }: { ticketNumber: string }) => {
      const response = await api.post(
        `/admin/support/tickets/${ticketNumber}/close`
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["support-tickets", variables.ticketNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["support-tickets", "stats"] });
    },
  });
}

// Bulk update tickets
export function useBulkUpdateTickets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketNumbers,
      updates,
    }: {
      ticketNumbers: string[];
      updates: {
        status?: TicketStatus;
        priority?: TicketPriority;
        assigned_to?: number;
      };
    }) => {
      const response = await api.post(`/admin/support/tickets/bulk-update`, {
        ticket_numbers: ticketNumbers,
        ...updates,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets", "stats"] });
    },
  });
}

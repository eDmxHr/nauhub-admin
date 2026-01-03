import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// Notification types
export type NotificationType =
  | "system_error"
  | "pending_payment"
  | "new_user"
  | "failed_login"
  | "expiring_subscription"
  | "upload_failure";

export type NotificationPriority = "low" | "medium" | "high" | "critical";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  action_url: string | null;
  priority: NotificationPriority;
  is_read: boolean;
  read_at: string | null;
  related_activity_log_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationStats {
  total_notifications: number;
  unread_count: number;
  by_type: Array<{ type: string; count: number }>;
  by_priority: Array<{ priority: string; count: number }>;
  critical_count: number;
  high_priority_count: number;
  recent_unread: Notification[];
}

interface NotificationStatsAPIResponse {
  total: number;
  unread: number;
  by_type: Record<string, number>;
  by_priority: Record<string, number>;
  critical_unread: number;
  high_priority_count: number;
  recent_unread: Notification[];
}

export interface NotificationsFilters {
  is_read?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
  critical?: boolean;
  per_page?: number;
  page?: number;
}

export interface NotificationsResponse {
  data: Notification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Fetch notifications with filters
export function useNotifications(filters: NotificationsFilters = {}) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await api.get<{ data: NotificationsResponse }>(
        `/admin/notifications?${params.toString()}`
      );

      return response.data;
    },
  });
}

// Fetch notification statistics
export function useNotificationStats() {
  return useQuery({
    queryKey: ["notifications", "stats"],
    queryFn: async () => {
      const response = await api.get<{ stats: NotificationStatsAPIResponse }>(
        "/admin/notifications/stats"
      );

      // Transform API response to match expected format
      return {
        total_notifications: response.data.stats.total,
        unread_count: response.data.stats.unread,
        by_type: Object.entries(response.data.stats.by_type).map(
          ([type, count]) => ({
            type,
            count,
          })
        ),
        by_priority: Object.entries(response.data.stats.by_priority).map(
          ([priority, count]) => ({
            priority,
            count,
          })
        ),
        critical_count: response.data.stats.critical_unread,
        high_priority_count: response.data.stats.high_priority_count,
        recent_unread: response.data.stats.recent_unread,
      } as NotificationStats;
    },
  });
}

// Fetch single notification (auto-marks as read)
export function useNotification(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["notifications", id],
    queryFn: async () => {
      const response = await api.get<{ data: Notification }>(
        `/admin/notifications/${id}`
      );
      // Since viewing auto-marks as read, invalidate the stats and list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Mark notification as read
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.put<{ message: string; data: Notification }>(
        `/admin/notifications/${id}/read`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Mark notification as unread
export function useMarkNotificationUnread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.put<{ message: string; data: Notification }>(
        `/admin/notifications/${id}/unread`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Mark all notifications as read
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.put<{ message: string; marked_count: number }>(
        "/admin/notifications/mark-all-read"
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Delete notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<{ message: string }>(
        `/admin/notifications/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Cleanup old read notifications
export function useCleanupNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (days: number = 30) => {
      const response = await api.delete<{
        message: string;
        deleted_count: number;
      }>(`/admin/notifications/cleanup?days=${days}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

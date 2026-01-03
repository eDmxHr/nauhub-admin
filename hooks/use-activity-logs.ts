import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// Activity log types
export interface ActivityLog {
  id: number;
  user_id: number | null;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  action: string;
  description: string;
  entity_type: string | null;
  entity_id: number | null;
  metadata: any;
  severity: "info" | "warning" | "error" | "critical";
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ActivityLogStats {
  by_action: Array<{ action: string; count: number }>;
  by_severity: Array<{ severity: string; count: number }>;
  by_entity_type: Array<{ entity_type: string; count: number }>;
  most_active_users: Array<{
    user: {
      id: number;
      name: string;
      email: string;
    };
    activity_count: number;
  }>;
  critical_count: number;
  error_count: number;
}

interface ActivityLogStatsAPIResponse {
  message: string;
  date_range: {
    start: string;
    end: string;
  };
  stats: {
    total_activities: number;
    by_action: Record<string, number>;
    by_severity: Record<string, number>;
    by_entity_type: Record<string, number>;
    most_active_users: Array<{
      user: {
        id: number;
        name: string;
        email: string;
      };
      activity_count: number;
    }>;
    critical_activities: number;
    error_activities: number;
  };
}

export interface ActivityLogsFilters {
  user_id?: number;
  action?: string;
  entity_type?: string;
  entity_id?: number;
  severity?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ActivityLogsResponse {
  data: ActivityLog[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Fetch activity logs with filters and pagination
export function useActivityLogs(filters: ActivityLogsFilters = {}) {
  return useQuery({
    queryKey: ["activity-logs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await api.get<{ data: ActivityLogsResponse }>(
        `/admin/activity-logs?${params.toString()}`
      );

      return response.data;
    },
  });
}

// Fetch activity log statistics
export function useActivityLogStats(filters?: {
  start_date?: string;
  end_date?: string;
}) {
  return useQuery({
    queryKey: ["activity-logs", "stats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.start_date) params.append("start_date", filters.start_date);
      if (filters?.end_date) params.append("end_date", filters.end_date);

      const response = await api.get<ActivityLogStatsAPIResponse>(
        `/admin/activity-logs/stats?${params.toString()}`
      );

      // Transform API response to match expected format
      const apiStats = response.data.stats;
      return {
        by_action: Object.entries(apiStats.by_action).map(
          ([action, count]) => ({
            action,
            count,
          })
        ),
        by_severity: Object.entries(apiStats.by_severity).map(
          ([severity, count]) => ({
            severity,
            count,
          })
        ),
        by_entity_type: Object.entries(apiStats.by_entity_type).map(
          ([entity_type, count]) => ({
            entity_type,
            count,
          })
        ),
        most_active_users: apiStats.most_active_users,
        critical_count: apiStats.critical_activities,
        error_count: apiStats.error_activities,
      } as ActivityLogStats;
    },
  });
}

// Fetch critical activity logs
export function useCriticalActivityLogs(limit: number = 10) {
  return useQuery({
    queryKey: ["activity-logs", "critical", limit],
    queryFn: async () => {
      const response = await api.get<ActivityLog[]>(
        `/admin/activity-logs/critical?limit=${limit}`
      );
      return response.data;
    },
  });
}

// Fetch single activity log
export function useActivityLog(id: number) {
  return useQuery({
    queryKey: ["activity-logs", id],
    queryFn: async () => {
      const response = await api.get<{ data: ActivityLog }>(
        `/admin/activity-logs/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Fetch activity logs for a specific entity
export function useEntityActivityLogs(
  entityType: string,
  entityId: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["activity-logs", "entity", entityType, entityId],
    queryFn: async () => {
      const response = await api.get<{ data: ActivityLog[] }>(
        `/admin/activity-logs/entity/${entityType}/${entityId}`
      );
      return response.data.data;
    },
    enabled: enabled && !!entityType && !!entityId,
  });
}

// Cleanup old activity logs
export function useCleanupActivityLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete<{
        message: string;
        deleted_count: number;
      }>("/admin/activity-logs/cleanup");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}

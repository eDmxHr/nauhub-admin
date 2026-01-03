import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// Dashboard statistics types
export interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    subscribed: number;
    admins: number;
    new_today: number;
    new_this_week: number;
    new_this_month: number;
  };
  revenue: {
    total_revenue: string;
    revenue_this_month: string;
    revenue_this_year: string;
    pending_payments: number;
    pending_amount: number;
    approved_payments: number;
    rejected_payments: number;
    awaiting_verification: number;
  };
  content: {
    total_videos: number;
    movies: number;
    series: number;
    anime: number;
    total_seasons: number;
    total_episodes: number;
    categories: number;
    genres: number;
    videos_by_status: {
      processing: number;
      ready: number;
      failed: number;
    };
  };
  subscriptions: {
    total: number;
    active: number;
    expired: number;
    cancelled: number;
    expiring_soon: number;
    new_this_month: number;
    auto_renew_enabled: number;
  };
  recent_activity: {
    recent_users: RecentUser[];
    recent_subscriptions: RecentSubscription[];
    pending_payments: any[];
    recent_videos: RecentVideo[];
  };
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface RecentSubscription {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  plan_type: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface RecentVideo {
  id: number;
  title: string;
  type: string;
  status: string;
  created_at: string;
}

// Chart data types
export interface RevenueChartDataPoint {
  date: string;
  label: string;
  revenue: number;
}

export interface UserGrowthChartDataPoint {
  date: string;
  label: string;
  new_users: number;
  total_users: number;
}

// Fetch dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await api.get<{ data: DashboardStats }>(
        "/admin/dashboard"
      );
      return response.data.data;
    },
  });
}

// Fetch revenue chart data
export function useRevenueChart(period: "week" | "month" | "year" = "month") {
  return useQuery({
    queryKey: ["dashboard", "revenue-chart", period],
    queryFn: async () => {
      const response = await api.get<{ data: RevenueChartDataPoint[] }>(
        `/admin/dashboard/revenue-chart?period=${period}`
      );
      console.log("Revenue chart response:", response.data);
      return response.data.data;
    },
  });
}

// Fetch user growth chart data
export function useUserGrowthChart(
  period: "week" | "month" | "year" = "month"
) {
  return useQuery({
    queryKey: ["dashboard", "user-growth-chart", period],
    queryFn: async () => {
      const response = await api.get<{ data: UserGrowthChartDataPoint[] }>(
        `/admin/dashboard/user-growth-chart?period=${period}`
      );
      console.log("User growth chart response:", response.data);
      return response.data.data;
    },
  });
}

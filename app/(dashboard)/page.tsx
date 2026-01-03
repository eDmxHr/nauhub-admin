"use client";

import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  useDashboardStats,
  useRevenueChart,
  useUserGrowthChart,
} from "@/hooks/use-dashboard";
import LoadingState from "@/components/loading-state";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [revenuePeriod, setRevenuePeriod] = useState<"week" | "month" | "year">(
    "month"
  );
  const [userGrowthPeriod, setUserGrowthPeriod] = useState<
    "week" | "month" | "year"
  >("month");

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueChart, isLoading: revenueLoading } =
    useRevenueChart(revenuePeriod);
  const { data: userGrowthChart, isLoading: userGrowthLoading } =
    useUserGrowthChart(userGrowthPeriod);

  if (statsLoading || !stats) {
    return (
      <>
        <PageHeader breadcrumbs={[{ title: "Dashboard" }]} />
        <PageWrapper
          title="Dashboard"
          description="Overview and quick actions for your admin portal."
        >
          <LoadingState />
        </PageWrapper>
      </>
    );
  }

  // Prepare chart data
  const revenueChartData = {
    labels: revenueChart?.map((d) => d.label) || [],
    datasets: [
      {
        label: "Revenue (MVR)",
        data: revenueChart?.map((d) => d.revenue) || [],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const userGrowthChartData = {
    labels: userGrowthChart?.map((d) => d.label) || [],
    datasets: [
      {
        label: "New Users",
        data: userGrowthChart?.map((d) => d.new_users) || [],
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Total Users",
        data: userGrowthChart?.map((d) => d.total_users) || [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Dashboard" }]} />
      <PageWrapper
        title="Dashboard"
        description="Overview and quick actions for your admin portal."
      >
        {/* User & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Total Users</span>
            <span className="text-2xl font-bold">
              {stats.users.total.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Active: {stats.users.active.toLocaleString()}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              Subscribed Users
            </span>
            <span className="text-2xl font-bold">
              {stats.users.subscribed.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              New Today: {stats.users.new_today.toLocaleString()}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Total Revenue</span>
            <span className="text-2xl font-bold">
              MVR {stats.revenue.total_revenue}
            </span>
            <span className="text-xs text-muted-foreground">
              This Month: MVR {stats.revenue.revenue_this_month}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              Active Subscriptions
            </span>
            <span className="text-2xl font-bold">
              {stats.subscriptions.active.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Expiring Soon:{" "}
              {stats.subscriptions.expiring_soon.toLocaleString()}
            </span>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6 flex flex-col gap-4 items-stretch">
            <div className="flex items-center justify-between">
              <span className="font-semibold mb-1 block">Revenue Chart</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={revenuePeriod === "week" ? "default" : "outline"}
                  onClick={() => setRevenuePeriod("week")}
                >
                  Week
                </Button>
                <Button
                  size="sm"
                  variant={revenuePeriod === "month" ? "default" : "outline"}
                  onClick={() => setRevenuePeriod("month")}
                >
                  Month
                </Button>
                <Button
                  size="sm"
                  variant={revenuePeriod === "year" ? "default" : "outline"}
                  onClick={() => setRevenuePeriod("year")}
                >
                  Year
                </Button>
              </div>
            </div>
            <div className="w-full h-64 md:h-80">
              {revenueLoading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingState />
                </div>
              ) : (
                <Line
                  data={revenueChartData}
                  options={{ maintainAspectRatio: false }}
                />
              )}
            </div>
          </Card>
          <Card className="p-6 flex flex-col gap-4 items-stretch">
            <div className="flex items-center justify-between">
              <span className="font-semibold mb-1 block">
                User Growth Chart
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={userGrowthPeriod === "week" ? "default" : "outline"}
                  onClick={() => setUserGrowthPeriod("week")}
                >
                  Week
                </Button>
                <Button
                  size="sm"
                  variant={userGrowthPeriod === "month" ? "default" : "outline"}
                  onClick={() => setUserGrowthPeriod("month")}
                >
                  Month
                </Button>
                <Button
                  size="sm"
                  variant={userGrowthPeriod === "year" ? "default" : "outline"}
                  onClick={() => setUserGrowthPeriod("year")}
                >
                  Year
                </Button>
              </div>
            </div>
            <div className="w-full h-64 md:h-80">
              {userGrowthLoading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingState />
                </div>
              ) : (
                <Line
                  data={userGrowthChartData}
                  options={{ maintainAspectRatio: false }}
                />
              )}
            </div>
          </Card>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Total Videos</span>
            <span className="text-2xl font-bold">
              {stats.content.total_videos.toLocaleString()}
            </span>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>Movies: {stats.content.movies}</span>
              <span>Series: {stats.content.series}</span>
            </div>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              Episodes & Seasons
            </span>
            <span className="text-2xl font-bold">
              {stats.content.total_episodes.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Seasons: {stats.content.total_seasons.toLocaleString()}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Categories</span>
            <span className="text-2xl font-bold">
              {stats.content.categories.toLocaleString()}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Genres</span>
            <span className="text-2xl font-bold">
              {stats.content.genres.toLocaleString()}
            </span>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="font-semibold mb-2 block">Recent Users</span>
            <div className="w-full space-y-2">
              {stats.recent_activity.recent_users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center pb-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(user.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="font-semibold mb-2 block">
              Recent Subscriptions
            </span>
            <div className="w-full space-y-2">
              {stats.recent_activity.recent_subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex justify-between items-center pb-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{sub.user.name}</p>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs text-muted-foreground capitalize">
                        {sub.plan_type}
                      </span>
                      <Badge
                        variant={
                          sub.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {sub.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">MVR {sub.amount}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(sub.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="font-semibold mb-2 block">Pending Payments</span>
            <div className="w-full space-y-2">
              {stats.recent_activity.pending_payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No pending payments
                </p>
              ) : (
                stats.recent_activity.pending_payments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center pb-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        MVR {payment.amount}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="font-semibold mb-2 block">Recent Videos</span>
            <div className="w-full space-y-2">
              {stats.recent_activity.recent_videos.map((video) => (
                <div
                  key={video.id}
                  className="flex justify-between items-center pb-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{video.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {video.type}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(video.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageWrapper>
    </>
  );
}

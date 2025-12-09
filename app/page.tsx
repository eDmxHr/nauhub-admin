"use client";

import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// --- Dashboard Data (from provided JSON) ---
const userMetrics = {
  daily_active_users: [
    { date: "2025-11-30", dau: 1245000 },
    { date: "2025-12-01", dau: 1272000 },
    { date: "2025-12-02", dau: 1308000 },
    { date: "2025-12-03", dau: 1291000 },
    { date: "2025-12-04", dau: 1316000 },
    { date: "2025-12-05", dau: 1329000 },
    { date: "2025-12-06", dau: 1354000 },
  ],
  new_signups: [
    { date: "2025-11-30", signups: 42000 },
    { date: "2025-12-01", signups: 46000 },
    { date: "2025-12-02", signups: 54000 },
    { date: "2025-12-03", signups: 38000 },
    { date: "2025-12-04", signups: 50000 },
    { date: "2025-12-05", signups: 52000 },
    { date: "2025-12-06", signups: 57000 },
  ],
};
const subscriptionMetrics = {
  breakdown: [
    { plan: "Basic", count: 420000 },
    { plan: "Standard", count: 830000 },
    { plan: "Premium", count: 1040000 },
  ],
  churn_by_week: [
    { week: "2025-W47", churn_rate: 0.015 },
    { week: "2025-W48", churn_rate: 0.0145 },
    { week: "2025-W49", churn_rate: 0.016 },
    { week: "2025-W50", churn_rate: 0.014 },
  ],
  mrr: [
    { month: "2025-08", mrr: 48200000 },
    { month: "2025-09", mrr: 48950000 },
    { month: "2025-10", mrr: 49200000 },
    { month: "2025-11", mrr: 49820000 },
  ],
};
const contentEngagement = {
  top_titles_week: [
    {
      title: "Spacebound",
      views: 3450000,
      avg_watch_time_min: 62,
      completion_rate: 0.72,
    },
    {
      title: "Kitchen Whiz S2E3",
      views: 2100000,
      avg_watch_time_min: 28,
      completion_rate: 0.85,
    },
    {
      title: "Rogue Seas",
      views: 1950000,
      avg_watch_time_min: 44,
      completion_rate: 0.65,
    },
    {
      title: "Neo City Documentary",
      views: 1700000,
      avg_watch_time_min: 50,
      completion_rate: 0.78,
    },
    {
      title: "Late Night Special",
      views: 1600000,
      avg_watch_time_min: 34,
      completion_rate: 0.57,
    },
  ],
  watch_time_by_day: [
    { date: "2025-12-01", watch_minutes: 98200000 },
    { date: "2025-12-02", watch_minutes: 101200000 },
    { date: "2025-12-03", watch_minutes: 98000000 },
    { date: "2025-12-04", watch_minutes: 103400000 },
    { date: "2025-12-05", watch_minutes: 104100000 },
    { date: "2025-12-06", watch_minutes: 106900000 },
  ],
};

// --- Derived Data for Charts ---
const dauChartData = {
  labels: userMetrics.daily_active_users.map((d) => d.date),
  datasets: [
    {
      label: "Daily Active Users",
      data: userMetrics.daily_active_users.map((d) => d.dau),
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};
const signupsChartData = {
  labels: userMetrics.new_signups.map((d) => d.date),
  datasets: [
    {
      label: "New Signups",
      data: userMetrics.new_signups.map((d) => d.signups),
      backgroundColor: "#10b981",
      borderRadius: 4,
    },
  ],
};
const mrrChartData = {
  labels: subscriptionMetrics.mrr.map((m) => m.month),
  datasets: [
    {
      label: "MRR (MVR)",
      data: subscriptionMetrics.mrr.map((m) => m.mrr),
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};
const topTitles = contentEngagement.top_titles_week;
// Mock genre data for top titles
const genreViews = [
  { genre: "Sci-Fi", views: 3450000 },
  { genre: "Cooking", views: 2100000 },
  { genre: "Adventure", views: 1950000 },
  { genre: "Documentary", views: 1700000 },
  { genre: "Comedy", views: 1600000 },
];
const mostWatchedGenre = genreViews.reduce(
  (max, g) => (g.views > max.views ? g : max),
  genreViews[0]
);

// Mock least watched videos
const leastWatched = [
  { title: "Quiet Lake", views: 12000 },
  { title: "Hidden Alley", views: 15000 },
  { title: "Old Town Mystery", views: 18000 },
];
const watchTimeChartData = {
  labels: contentEngagement.watch_time_by_day.map((d) => d.date),
  datasets: [
    {
      label: "Watch Time (min)",
      data: contentEngagement.watch_time_by_day.map((d) => d.watch_minutes),
      borderColor: "#f59e42",
      backgroundColor: "rgba(245,158,66,0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Dashboard" }]} />
      <PageWrapper
        title="Dashboard"
        description="Overview and quick actions for your admin portal."
      >
        {/* User & Device Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              Total Active Users
            </span>
            <span className="text-2xl font-bold">
              {userMetrics.daily_active_users.at(-1)?.dau.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Last 7d peak:{" "}
              {Math.max(
                ...userMetrics.daily_active_users.map((d) => d.dau)
              ).toLocaleString()}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              New Signups (Last 7d)
            </span>
            <span className="text-2xl font-bold">
              {userMetrics.new_signups
                .reduce((a, b) => a + b.signups, 0)
                .toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Yesterday:{" "}
              {userMetrics.new_signups.at(-1)?.signups.toLocaleString()}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              Active Subscriptions
            </span>
            <span className="text-2xl font-bold">
              {subscriptionMetrics.breakdown
                .reduce((a, b) => a + b.count, 0)
                .toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Premium:{" "}
              {subscriptionMetrics.breakdown
                .find((p) => p.plan === "Premium")
                ?.count.toLocaleString()}
            </span>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              Monthly Recurring Revenue
            </span>
            <span className="text-2xl font-bold">
              MVR{" "}
              {((subscriptionMetrics.mrr.at(-1)?.mrr ?? 0) / 1_000_000).toFixed(
                1
              )}
              M
            </span>
            <span className="text-xs text-muted-foreground">
              Last month: MVR{" "}
              {((subscriptionMetrics.mrr.at(-2)?.mrr ?? 0) / 1_000_000).toFixed(
                1
              )}
              M
            </span>
          </Card>
        </div>

        {/* User & Engagement Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6 flex flex-col gap-4 items-stretch">
            <span className="font-semibold mb-1 block">Daily Active Users</span>
            <div className="w-full h-64 md:h-80">
              <Line
                data={dauChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </Card>
          <Card className="p-6 flex flex-col gap-4 items-stretch">
            <span className="font-semibold mb-1 block">New Signups</span>
            <div className="w-full h-64 md:h-80">
              <Bar
                data={signupsChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6 flex flex-col gap-4 items-stretch">
            <span className="font-semibold mb-1 block">
              Monthly Recurring Revenue
            </span>
            <div className="w-full h-64 md:h-80">
              <Line
                data={mrrChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </Card>
          <Card className="p-6 flex flex-col gap-4 items-stretch">
            <span className="font-semibold mb-1 block">Watch Time by Day</span>
            <div className="w-full h-64 md:h-80">
              <Line
                data={watchTimeChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </Card>
        </div>
        {/* Additional Stats: Most Watched Genre & Least Watched Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">Genre Stats</span>
            <table className="min-w-full text-sm mt-2">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="px-2 py-1 text-left">Genre</th>
                  <th className="px-2 py-1 text-right">Views</th>
                </tr>
              </thead>
              <tbody>
                {genreViews.map((g) => (
                  <tr key={g.genre}>
                    <td className="px-2 py-1 font-medium">{g.genre}</td>
                    <td className="px-2 py-1 text-right">
                      {g.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card className="p-6 flex flex-col items-start gap-2">
            <span className="text-xs text-muted-foreground">
              Least Watched Videos
            </span>
            <ul className="mt-2 space-y-1">
              {leastWatched.map((v) => (
                <li key={v.title} className="flex justify-between">
                  <span>{v.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {v.views.toLocaleString()} views
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        {/* Top Titles Table */}
        <div className="mb-8">
          <Card className="p-6">
            <span className="font-semibold mb-2 block">
              Trending Titles (This Week)
            </span>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="px-2 py-1 text-left">Title</th>
                    <th className="px-2 py-1 text-right">Views</th>
                    <th className="px-2 py-1 text-right">
                      Avg. Watch Time (min)
                    </th>
                    <th className="px-2 py-1 text-right">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {topTitles.map((t) => (
                    <tr key={t.title}>
                      <td className="px-2 py-1 font-medium">{t.title}</td>
                      <td className="px-2 py-1 text-right">
                        {t.views.toLocaleString()}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {t.avg_watch_time_min}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {(t.completion_rate * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </PageWrapper>
    </>
  );
}

"use client";

import * as React from "react";
import {
  LayoutDashboard,
  CreditCard,
  DollarSignIcon,
  VideoIcon,
  FilmIcon,
  Users2,
  TicketIcon,
  BellIcon,
  ShieldIcon,
  Settings2,
  OrigamiIcon,
  VideotapeIcon,
  WrenchIcon,
  ActivityIcon,
  Upload,
} from "@/lib/icons";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import SidebarNavGroup from "@/components/ui/sidebar-group";

// Navigation groups with better organization and visual hierarchy
const navigationGroups = {
  overview: {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  operations: {
    label: "Library",
    items: [
      {
        title: "Movies  ",
        url: "/movies",
        icon: FilmIcon,
      },
      {
        title: "Series",
        url: "/series",
        icon: VideoIcon,
      },
      {
        title: "Anime",
        url: "/anime",
        icon: OrigamiIcon,
      },
      {
        title: "Documentaries",
        url: "/documentaries",
        icon: VideotapeIcon,
      },
      {
        title: "Categories",
        url: "/categories",
        icon: CreditCard,
      },
    ],
  },
  management: {
    label: "Management",
    items: [
      {
        title: "User Management",
        url: "/user-management",
        icon: Users2,
      },
      {
        title: "Subscriptions",
        url: "/subscriptions",
        icon: DollarSignIcon,
      },
      {
        title: "Support Tickets",
        url: "/support-tickets",
        icon: TicketIcon,
      },
    ],
  },
  system: {
    label: "System",
    items: [
      {
        title: "Notifications",
        url: "/notifications",
        icon: BellIcon,
      },
      {
        title: "Upload Progress",
        url: "/upload-progress",
        icon: Upload,
      },
      {
        title: "Security",
        url: "/security",
        icon: ShieldIcon,
      },
      {
        title: "Activity Logs",
        url: "/activity-logs",
        icon: ActivityIcon,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
      {
        title: "Integrations",
        url: "/integrations",
        icon: WrenchIcon,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="gap-1">
        {Object.entries(navigationGroups).map(([key, group]) => (
          <SidebarNavGroup key={key} items={group.items} label={group.label} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import {
  LayoutDashboard,
  CreditCard,
  UsersIcon,
  Settings2Icon,
  DollarSignIcon,
  VideoIcon,
  FilmIcon,
  Users2,
  TicketIcon,
  BellIcon,
  HardDrive,
  ShieldIcon,
  Settings2,
  OrigamiIcon,
  VideotapeIcon,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import SidebarNavGroup from "@/components/ui/sidebar-group";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
        title: "Security",
        url: "/security",
        icon: ShieldIcon,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

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

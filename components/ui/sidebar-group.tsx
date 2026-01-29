import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SidebarGroupProps {
  label: string;
  items: SidebarItem[];
}

export default function SidebarNavGroup({ label, items }: SidebarGroupProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/50">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const baseUrl = item.url.split("?")[0].replace("/", "");

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={(() => {
                    if (item.url === "/") {
                      return pathname === "/";
                    }

                    // Extract the base path from item.url (remove query params)
                    const itemBasePath = item.url.split("?")[0];
                    // Extract the base path from current pathname (remove query params)
                    const currentBasePath = pathname.split("?")[0];

                    // Check for exact match or nested routes
                    return (
                      currentBasePath === itemBasePath ||
                      currentBasePath.startsWith(`${itemBasePath}/`)
                    );
                  })()}
                  tooltip={item.title}
                  className="group/button h-9 justify-start px-3 font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Link
                    href={item.url}
                    className="flex items-center w-full gap-2"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <item.icon
                        size={18}
                        className="text-muted-foreground group-hover/button:text-sidebar-accent-foreground group-data-[active=true]/button:text-primary transition-colors"
                      />
                      <span className="text-sm text-sidebar-foreground group-hover/button:text-sidebar-accent-foreground  transition-colors font-medium">
                        {item.title}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

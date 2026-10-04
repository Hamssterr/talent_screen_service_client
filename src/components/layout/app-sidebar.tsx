"use client";

import * as React from "react";
import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  workspaceNavigation,
  NavigationSection,
  NavigationItem,
} from "./navigation.config";
import { SidebarNavItem } from "./sidebar-nav-item";
import { useSession } from "@/providers/session-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AppSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function AppSidebar({
  collapsed = false,
  onToggleCollapse,
  className,
}: AppSidebarProps) {
  const { can, canAny } = useSession();

  // Filter sections and items by user permissions
  const filteredSections = React.useMemo(() => {
    return workspaceNavigation
      .map((section: NavigationSection) => {
        // Section level check
        if (section.permission && !can(section.permission)) return null;
        if (section.anyOf && !canAny(section.anyOf)) return null;

        // Filter items
        const visibleItems = section.items.filter((item: NavigationItem) => {
          if (item.permission && !can(item.permission)) return false;
          if (item.anyOf && !canAny(item.anyOf)) return false;
          return true;
        });

        if (visibleItems.length === 0) return null;

        return {
          ...section,
          items: visibleItems,
        };
      })
      .filter((section): section is NavigationSection => section !== null);
  }, [can, canAny]);

  return (
    <aside
      data-slot="app-sidebar"
      aria-label="Thanh điều hướng chính"
      className={cn(
        "relative hidden md:flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 ease-in-out select-none",
        collapsed ? "w-18" : "w-64",
        className,
      )}>
      {/* Sidebar Header: Logo & Branding */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2.5 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            collapsed && "justify-center w-full",
          )}>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xs transition-transform hover:scale-105">
            TS
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm leading-tight tracking-tight text-sidebar-foreground">
                TalentScreen
              </span>
              <span className="text-[10px] text-sidebar-foreground/60 leading-tight">
                Hệ thống tuyển dụng AI
              </span>
            </div>
          )}
        </Link>

        {onToggleCollapse && !collapsed && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggleCollapse}
            aria-label="Thu gọn thanh điều hướng"
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <PanelLeftClose className="size-4" />
          </Button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {filteredSections.map((section) => (
          <div key={section.id} className="space-y-1.5">
            {section.title && !collapsed && (
              <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer: Toggle when collapsed */}
      {onToggleCollapse && collapsed && (
        <div className="p-3 border-t border-sidebar-border flex justify-center">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggleCollapse}
            aria-label="Mở rộng thanh điều hướng"
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <PanelLeftOpen className="size-4" />
          </Button>
        </div>
      )}
    </aside>
  );
}

export default AppSidebar;

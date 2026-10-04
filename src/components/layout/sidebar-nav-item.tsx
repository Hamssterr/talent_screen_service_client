"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationItem } from "./navigation.config";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface SidebarNavItemProps {
  item: NavigationItem;
  collapsed?: boolean;
  onSelect?: () => void;
}

export function SidebarNavItem({
  item,
  collapsed = false,
  onSelect,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

  const navLink = (
    <Link
      href={item.href}
      onClick={onSelect}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 outline-none select-none",
        "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar",
        isActive &&
          "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs",
        collapsed && "justify-center px-0 py-2.5 size-10 mx-auto",
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-transform duration-150 group-hover:scale-105",
          isActive ? "text-primary" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground",
        )}
      />

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span
              className={cn(
                "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-sidebar-accent/80 text-sidebar-foreground/90",
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={navLink} />
        <TooltipContent side="right" sideOffset={10}>
          <p className="font-medium text-xs">{item.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return navLink;
}

export default SidebarNavItem;

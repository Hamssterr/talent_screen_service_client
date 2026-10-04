"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { workspaceNavigation, NavigationSection, NavigationItem } from "./navigation.config";
import { SidebarNavItem } from "./sidebar-nav-item";
import { useSession } from "@/providers/session-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { can, canAny } = useSession();

  const filteredSections = React.useMemo(() => {
    return workspaceNavigation
      .map((section: NavigationSection) => {
        if (section.permission && !can(section.permission)) return null;
        if (section.anyOf && !canAny(section.anyOf)) return null;

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Mở danh mục điều hướng"
            className="md:hidden"
          >
            <Menu className="size-5" />
          </Button>
        }
      />

      <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        {/* Header */}
        <SheetHeader className="h-16 px-4 border-b border-sidebar-border flex flex-row items-center justify-between space-y-0 text-left">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xs">
              TS
            </div>
            <div className="flex flex-col">
              <SheetTitle className="font-bold text-sm leading-tight text-sidebar-foreground">
                TalentScreen
              </SheetTitle>
              <span className="text-[10px] text-sidebar-foreground/60 leading-tight">
                Hệ thống tuyển dụng AI
              </span>
            </div>
          </Link>
        </SheetHeader>

        {/* Nav list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {filteredSections.map((section) => (
            <div key={section.id} className="space-y-1.5">
              {section.title && (
                <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.id}
                    item={item}
                    onSelect={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;

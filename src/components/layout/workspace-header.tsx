"use client";

import * as React from "react";
import { MobileNav } from "./mobile-nav";
import { AppBreadcrumb } from "./app-breadcrumb";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function WorkspaceHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md transition-colors sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <AppBreadcrumb />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

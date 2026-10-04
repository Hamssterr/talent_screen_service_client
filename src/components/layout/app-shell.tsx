"use client";

import * as React from "react";
import { AppSidebar } from "./app-sidebar";
import { WorkspaceHeader } from "./workspace-header";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className="relative flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop App Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 flex-col min-w-0 min-h-screen overflow-x-hidden">
        <WorkspaceHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

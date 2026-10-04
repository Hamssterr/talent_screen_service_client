"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Video,
  Award,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkspaceTab {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface ApplicationWorkspaceNavProps {
  applicationId: string;
}

export function ApplicationWorkspaceNav({ applicationId }: ApplicationWorkspaceNavProps) {
  const pathname = usePathname();

  const tabs: WorkspaceTab[] = React.useMemo(
    () => [
      {
        id: "overview",
        label: "Tổng quan",
        href: `/applications/${applicationId}/overview`,
        icon: LayoutDashboard,
      },
      {
        id: "cv",
        label: "Hồ sơ & CV",
        href: `/applications/${applicationId}/cv`,
        icon: FileText,
      },
      {
        id: "questions",
        label: "Bộ câu hỏi",
        href: `/applications/${applicationId}/questions`,
        icon: HelpCircle,
      },
      {
        id: "interviews",
        label: "Phỏng vấn AI",
        href: `/applications/${applicationId}/interviews`,
        icon: Video,
      },
      {
        id: "review",
        label: "Đánh giá & Quyết định",
        href: `/applications/${applicationId}/review`,
        icon: Award,
      },
    ],
    [applicationId],
  );

  return (
    <nav
      aria-label="Điều hướng Workspace hồ sơ ứng tuyển"
      className="flex items-center gap-1.5 overflow-x-auto border-b border-border/60 pb-px text-xs font-medium scrollbar-none"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg transition-colors border-b-2 whitespace-nowrap",
              isActive
                ? "border-primary text-primary font-semibold bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

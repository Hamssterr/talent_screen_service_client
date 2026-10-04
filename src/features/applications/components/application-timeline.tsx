"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, CircleDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Application } from "../types/application.types";
import { cn } from "@/lib/utils";

export interface ApplicationTimelineProps {
  application: Application;
  className?: string;
}

interface MilestoneStep {
  id: string;
  label: string;
  description: string;
  status: "completed" | "current" | "upcoming" | "terminal_danger" | "terminal_neutral";
  timestamp?: string | null;
}

export function ApplicationTimeline({ application, className }: ApplicationTimelineProps) {
  const steps: MilestoneStep[] = React.useMemo(() => {
    const s = application.status;

    const base: MilestoneStep[] = [
      {
        id: "created",
        label: "Nộp hồ sơ ứng tuyển",
        description: "Hồ sơ ứng viên được nộp vào vị trí tuyển dụng",
        status: "completed",
        timestamp: application.createdAt,
      },
      {
        id: "screening",
        label: "Sàng lọc CV & Hồ sơ",
        description: application.currentCvVersionId
          ? "Đã có bản CV được liên kết vào hồ sơ"
          : "Đang chờ tải lên và sàng lọc CV",
        status:
          s === "withdrawn"
            ? "terminal_neutral"
            : s === "shortlisted"
            ? "current"
            : ["interviewing", "under_review", "approved", "rejected"].includes(s)
            ? "completed"
            : "upcoming",
      },
      {
        id: "interviewing",
        label: "Phỏng vấn AI",
        description: "Ứng viên thực hiện bài phỏng vấn thoại tương tác AI",
        status:
          s === "withdrawn"
            ? "terminal_neutral"
            : s === "interviewing"
            ? "current"
            : ["under_review", "approved", "rejected"].includes(s)
            ? "completed"
            : "upcoming",
      },
      {
        id: "review",
        label: "Đánh giá & Quyết định",
        description:
          s === "approved"
            ? "Hồ sơ được phê duyệt tuyển dụng"
            : s === "rejected"
            ? "Hồ sơ không đạt yêu cầu"
            : s === "withdrawn"
            ? "Hồ sơ đã chủ động rút khỏi quy trình"
            : s === "under_review"
            ? "Đang chờ chuyên viên HR xem xét và ra quyết định"
            : "Chờ hoàn thành phỏng vấn",
        status:
          s === "approved"
            ? "completed"
            : s === "rejected"
            ? "terminal_danger"
            : s === "withdrawn"
            ? "terminal_neutral"
            : s === "under_review"
            ? "current"
            : "upcoming",
        timestamp:
          s === "withdrawn"
            ? application.withdrawnAt
            : ["approved", "rejected"].includes(s)
            ? application.updatedAt
            : undefined,
      },
    ];

    return base;
  }, [application]);

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Tiến trình tuyển dụng</CardTitle>
        <CardDescription className="text-xs">
          Các giai đoạn trong quy trình xử lý hồ sơ ứng viên
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-border/80 ml-3.5 space-y-6">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isTerminalDanger = step.status === "terminal_danger";
            const isTerminalNeutral = step.status === "terminal_neutral";

            return (
              <li key={step.id} className="ml-6">
                <span
                  className={cn(
                    "absolute -left-3.5 flex size-7 items-center justify-center rounded-full ring-4 ring-background text-xs font-bold",
                    isCompleted
                      ? "bg-emerald-600 text-white dark:bg-emerald-500"
                      : isCurrent
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : isTerminalDanger
                      ? "bg-destructive text-destructive-foreground"
                      : isTerminalNeutral
                      ? "bg-neutral-500 text-white"
                      : "bg-muted text-muted-foreground border border-border",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="size-4" />
                  ) : isCurrent ? (
                    <CircleDot className="size-4" />
                  ) : isTerminalDanger ? (
                    <AlertCircle className="size-4" />
                  ) : isTerminalNeutral ? (
                    "✕"
                  ) : (
                    idx + 1
                  )}
                </span>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <h4
                      className={cn(
                        "text-xs sm:text-sm font-semibold",
                        isCurrent
                          ? "text-primary font-bold"
                          : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </h4>
                    {step.timestamp && (
                      <span className="text-[11px] text-muted-foreground">
                        ({new Date(step.timestamp).toLocaleDateString("vi-VN")})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

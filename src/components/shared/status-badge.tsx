import * as React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { StatusTone, StatusPresentation } from "@/lib/status/status.types";
import { getJobStatusPresentation, JobStatus } from "@/lib/status/job-status";
import { getApplicationStatusPresentation, ApplicationStatus } from "@/lib/status/application-status";
import { getInterviewStatusPresentation, InterviewStatus } from "@/lib/status/interview-status";
import { getNotificationStatusPresentation, NotificationStatus } from "@/lib/status/notification-status";
import {
  getAiRunStatusPresentation,
  getCvExtractionStatusPresentation,
  AiRunStatus,
  CvExtractionStatus,
} from "@/lib/status/ai-status";
import { cn } from "@/lib/utils";

export type StatusDomain =
  | "job"
  | "application"
  | "interview"
  | "notification"
  | "ai"
  | "cv";

export interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  domain?: StatusDomain;
  status?: string;
  presentation?: StatusPresentation;
  tone?: StatusTone;
  label?: string;
  icon?: React.ReactNode;
}

function resolvePresentation(
  domain?: StatusDomain,
  status?: string,
  explicitPresentation?: StatusPresentation,
): StatusPresentation | undefined {
  if (explicitPresentation) return explicitPresentation;
  if (!domain || !status) return undefined;

  switch (domain) {
    case "job":
      return getJobStatusPresentation(status as JobStatus);
    case "application":
      return getApplicationStatusPresentation(status as ApplicationStatus);
    case "interview":
      return getInterviewStatusPresentation(status as InterviewStatus);
    case "notification":
      return getNotificationStatusPresentation(status as NotificationStatus);
    case "ai":
      return getAiRunStatusPresentation(status as AiRunStatus);
    case "cv":
      return getCvExtractionStatusPresentation(status as CvExtractionStatus);
    default:
      return undefined;
  }
}

export function StatusBadge({
  domain,
  status,
  presentation,
  tone,
  label,
  icon,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const resolved = resolvePresentation(domain, status, presentation);

  const finalTone: StatusTone = tone || resolved?.tone || "neutral";
  const finalLabel = children || label || resolved?.label || status || "";

  const toneVariantMap: Record<StatusTone, BadgeProps["variant"]> = {
    neutral: "muted",
    info: "info",
    success: "success",
    warning: "warning",
    danger: "danger",
    ai: "ai",
    peach: "peach",
  };

  return (
    <Badge
      variant={toneVariantMap[finalTone] || "muted"}
      className={cn("font-medium", className)}
      {...props}
    >
      {icon}
      <span>{finalLabel}</span>
    </Badge>
  );
}

export default StatusBadge;

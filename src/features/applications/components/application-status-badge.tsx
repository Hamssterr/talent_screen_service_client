"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import {
  getApplicationStatusPresentation,
  ApplicationStatusKey,
} from "@/lib/status/application-status";

export interface ApplicationStatusBadgeProps {
  status?: string | null;
  className?: string;
}

export function ApplicationStatusBadge({
  status,
  className,
}: ApplicationStatusBadgeProps) {
  const presentation = getApplicationStatusPresentation(status as ApplicationStatusKey);

  return (
    <StatusBadge
      label={presentation.label}
      tone={presentation.tone}
      className={className}
    />
  );
}

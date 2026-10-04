"use client";

import * as React from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { JobStatus } from "../types/job.types";

export interface JobStatusBadgeProps {
  status: JobStatus | string;
  className?: string;
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  return (
    <StatusBadge
      domain="job"
      status={status}
      className={className}
    />
  );
}

export default JobStatusBadge;

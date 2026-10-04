"use client";

import * as React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobsQuery } from "@/features/jobs";
import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import { cn } from "@/lib/utils";

export interface JobSelectProps {
  value: string;
  onChange: (jobId: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function JobSelect({
  value,
  onChange,
  disabled = false,
  error,
  className,
}: JobSelectProps) {
  // Fetch open jobs that are accepting applications (limit 50)
  const { data, isLoading, isError, error: fetchError } = useJobsQuery({
    status: "open",
    limit: 50,
  });

  const jobs = data?.data || [];

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="relative">
        <Select
          value={value}
          onValueChange={(val) => onChange(val || "")}
          disabled={disabled || isLoading || isError}
        >
          <SelectTrigger
            className={cn(
              "h-9 text-xs",
              error ? "border-destructive focus-visible:ring-destructive/20" : "",
            )}
            aria-label="Chọn vị trí tuyển dụng"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Đang tải danh sách vị trí...</span>
              </div>
            ) : (
              <SelectValue placeholder="Chọn vị trí tuyển dụng đang mở..." />
            )}
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {jobs.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                Không có vị trí tuyển dụng nào đang mở (Open).
              </div>
            ) : (
              jobs.map((job) => (
                <SelectItem key={job.id} value={job.id} className="text-xs">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span className="font-medium text-foreground truncate max-w-[280px]">
                      {job.title}
                    </span>
                    <JobStatusBadge status={job.status} />
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="size-3" />
          <span>{fetchError?.message || "Không thể tải danh sách vị trí tuyển dụng."}</span>
        </p>
      )}

      {error && !isError && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

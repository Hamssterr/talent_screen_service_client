import * as React from "react";
import { Loader2, CheckCircle2, AlertCircle, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CvExtractionStatus } from "../types/cv.types";
import { cn } from "@/lib/utils";

export interface CvExtractionStatusBadgeProps {
  status: CvExtractionStatus;
  className?: string;
}

const EXTRACTION_STATUS_CONFIG: Record<
  CvExtractionStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  pending: {
    label: "Chờ trích xuất",
    icon: Clock,
    className: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  },
  processing: {
    label: "Đang phân tích AI...",
    icon: Loader2,
    className: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300 animate-pulse",
  },
  ready: {
    label: "Đã trích xuất",
    icon: CheckCircle2,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  failed: {
    label: "Trích xuất lỗi",
    icon: AlertCircle,
    className: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  needs_manual_input: {
    label: "Cần nhập thủ công",
    icon: AlertTriangle,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
};

export function CvExtractionStatusBadge({ status, className }: CvExtractionStatusBadgeProps) {
  const config = EXTRACTION_STATUS_CONFIG[status] || EXTRACTION_STATUS_CONFIG.pending;
  const Icon = config.icon;
  const isSpinning = status === "processing";

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium text-[11px] px-2 py-0.5 inline-flex items-center",
        config.className,
        className,
      )}
    >
      <Icon className={cn("size-3", isSpinning && "animate-spin")} />
      <span>{config.label}</span>
    </Badge>
  );
}

import * as React from "react";
import { CheckCheck, FileEdit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CvProfileStatus } from "../types/cv.types";
import { cn } from "@/lib/utils";

export interface CvProfileStatusBadgeProps {
  status: CvProfileStatus;
  version?: number;
  className?: string;
}

export function CvProfileStatusBadge({
  status,
  version,
  className,
}: CvProfileStatusBadgeProps) {
  if (status === "approved") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium text-[11px] px-2 py-0.5 inline-flex items-center",
          className,
        )}
      >
        <CheckCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
        <span>Đã duyệt{version ? ` (v${version})` : ""}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium text-[11px] px-2 py-0.5 inline-flex items-center",
        className,
      )}
    >
      <FileEdit className="size-3 text-amber-600 dark:text-amber-400" />
      <span>Bản nháp{version ? ` (v${version})` : ""}</span>
    </Badge>
  );
}

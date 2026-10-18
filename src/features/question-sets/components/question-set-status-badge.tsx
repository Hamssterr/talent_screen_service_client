import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, FileEdit, Loader2 } from "lucide-react";
import { QuestionSetStatus } from "../types/question-set.types";
import { cn } from "@/lib/utils";

interface QuestionSetStatusBadgeProps {
  status: QuestionSetStatus;
  className?: string;
}

export function QuestionSetStatusBadge({ status, className }: QuestionSetStatusBadgeProps) {
  switch (status) {
    case "generating":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-medium animate-pulse",
            className,
          )}
        >
          <Loader2 className="size-3 animate-spin text-purple-600 dark:text-purple-400" />
          <span>Đang sinh câu hỏi AI...</span>
        </Badge>
      );
    case "approved":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium",
            className,
          )}
        >
          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
          <span>Đã duyệt (Approved)</span>
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-medium",
            className,
          )}
        >
          <AlertCircle className="size-3 text-rose-600 dark:text-rose-400" />
          <span>Sinh AI thất bại</span>
        </Badge>
      );
    case "draft":
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium",
            className,
          )}
        >
          <FileEdit className="size-3 text-amber-600 dark:text-amber-400" />
          <span>Bản nháp (Draft)</span>
        </Badge>
      );
  }
}

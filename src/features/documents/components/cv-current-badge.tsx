import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CvCurrentBadgeProps {
  className?: string;
}

export function CvCurrentBadge({ className }: CvCurrentBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-[11px] px-2 py-0.5",
        className,
      )}
    >
      <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
      <span>CV hiện tại</span>
    </Badge>
  );
}

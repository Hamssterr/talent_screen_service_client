import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, User } from "lucide-react";
import { QuestionSource } from "../types/question-set.types";
import { cn } from "@/lib/utils";

interface QuestionSourceBadgeProps {
  source?: QuestionSource;
  className?: string;
}

export function QuestionSourceBadge({ source = "manual", className }: QuestionSourceBadgeProps) {
  if (source === "ai") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-medium text-[11px] px-2 py-0.5",
          className,
        )}
      >
        <Sparkles className="size-3 text-purple-600 dark:text-purple-400" />
        <span>Sinh bởi AI</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300 font-medium text-[11px] px-2 py-0.5",
        className,
      )}
    >
      <User className="size-3 text-slate-600 dark:text-slate-400" />
      <span>Thủ công</span>
    </Badge>
  );
}

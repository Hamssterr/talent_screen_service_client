import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { QuestionDifficulty } from "../types/question-set.types";
import { cn } from "@/lib/utils";

interface QuestionDifficultyBadgeProps {
  difficulty?: QuestionDifficulty;
  className?: string;
}

export function QuestionDifficultyBadge({ difficulty = "intermediate", className }: QuestionDifficultyBadgeProps) {
  switch (difficulty) {
    case "basic":
      return (
        <Badge
          variant="outline"
          className={cn(
            "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-medium text-[11px] px-2 py-0.5",
            className,
          )}
        >
          Cơ bản
        </Badge>
      );
    case "advanced":
      return (
        <Badge
          variant="outline"
          className={cn(
            "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium text-[11px] px-2 py-0.5",
            className,
          )}
        >
          Nâng cao
        </Badge>
      );
    case "intermediate":
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium text-[11px] px-2 py-0.5",
            className,
          )}
        >
          Trung cấp
        </Badge>
      );
  }
}

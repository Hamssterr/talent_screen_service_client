import * as React from "react";
import { JobSnapshotCriterion } from "../types/question-set.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, HelpCircle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface RubricCoverageSummaryProps {
  evaluationCriteria?: JobSnapshotCriterion[];
  items: Array<{ evaluationCriterionId?: string | null }>;
  className?: string;
}

export function RubricCoverageSummary({
  evaluationCriteria = [],
  items = [],
  className,
}: RubricCoverageSummaryProps) {
  // Count questions per criterion
  const countsByCriterion = React.useMemo(() => {
    const map = new Map<string, number>();
    let unassignedCount = 0;

    items.forEach((item) => {
      if (item.evaluationCriterionId) {
        map.set(item.evaluationCriterionId, (map.get(item.evaluationCriterionId) || 0) + 1);
      } else {
        unassignedCount++;
      }
    });

    return { map, unassignedCount };
  }, [items]);

  const totalCriteria = evaluationCriteria.length;
  const coveredCriteriaCount = evaluationCriteria.filter((c) =>
    (countsByCriterion.map.get(c.id) || 0) > 0,
  ).length;

  const coveragePercent =
    totalCriteria > 0 ? Math.round((coveredCriteriaCount / totalCriteria) * 100) : 100;

  return (
    <Card className={cn("border border-border/80 bg-card/60 shadow-xs", className)}>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-medium text-xs">
            <Target className="size-4" />
            <CardTitle className="text-xs font-semibold tracking-wide uppercase">
              Độ phủ tiêu chí đánh giá (Rubric Coverage)
            </CardTitle>
          </div>
          <span className="text-xs font-semibold tabular-nums text-foreground">
            {coveredCriteriaCount}/{totalCriteria} tiêu chí ({coveragePercent}%)
          </span>
        </div>
        <Progress value={coveragePercent} className="h-1.5 mt-2" />
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-1 space-y-2.5 text-xs">
        {totalCriteria === 0 ? (
          <p className="text-muted-foreground text-xs italic">
            Vị trí tuyển dụng không thiết lập tiêu chí đánh giá Rubric cụ thể.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {evaluationCriteria.map((criterion) => {
              const count = countsByCriterion.map.get(criterion.id) || 0;
              const isCovered = count > 0;

              return (
                <div
                  key={criterion.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border text-xs transition-colors",
                    isCovered
                      ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                      : "border-amber-500/30 bg-amber-500/[0.04]",
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    {isCovered ? (
                      <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                    <span className="font-medium truncate text-foreground">
                      {criterion.name}
                    </span>
                    {criterion.weight !== undefined && (
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        (Trọng số: {criterion.weight})
                      </span>
                    )}
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold shrink-0 tabular-nums px-1.5 py-0.5",
                      isCovered
                        ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10"
                        : "border-muted-foreground/30 text-muted-foreground",
                    )}
                  >
                    {count} câu hỏi
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        {countsByCriterion.unassignedCount > 0 && (
          <div className="flex items-center justify-between pt-1 border-t border-dashed text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="size-3" />
              Câu hỏi chung (chưa gán tiêu chí cụ thể):
            </span>
            <span className="font-semibold text-foreground">
              {countsByCriterion.unassignedCount} câu
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

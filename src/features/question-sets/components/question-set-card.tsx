import * as React from "react";
import Link from "next/link";
import { QuestionSetSummary } from "../types/question-set.types";
import { QuestionSetStatusBadge } from "./question-set-status-badge";
import { QuestionSourceBadge } from "./question-source-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Copy,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { CloneQuestionSetDialog } from "./clone-question-set-dialog";
import { DeleteQuestionSetDialog } from "./delete-question-set-dialog";
import { PermissionGate } from "@/features/authorization";
import { Permissions } from "@/features/authorization/permission.constants";

interface QuestionSetCardProps {
  questionSet: QuestionSetSummary;
  applicationId: string;
  className?: string;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function QuestionSetCard({
  questionSet,
  applicationId,
  className,
}: QuestionSetCardProps) {
  const [cloneOpen, setCloneOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const formattedDate = React.useMemo(
    () => formatDate(questionSet.createdAt),
    [questionSet.createdAt],
  );

  const formattedApprovedDate = React.useMemo(
    () => formatDate(questionSet.approvedAt),
    [questionSet.approvedAt],
  );

  const isApproved = questionSet.status === "approved";

  return (
    <>
      <Card className={`border hover:border-primary/40 transition-all duration-150 shadow-xs bg-card ${className || ""}`}>
        <CardContent className="p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            {/* Header badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground">
                  Bộ câu hỏi v{questionSet.version}
                </span>
                <QuestionSetStatusBadge status={questionSet.status} />
                {questionSet.isStale && (
                  <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10 text-[10px] gap-1">
                    <AlertTriangle className="size-3" />
                    <span>Stale</span>
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <QuestionSourceBadge source={questionSet.mode} />
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  {questionSet.language}
                </Badge>
              </div>
            </div>

            {/* Content Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-1 text-xs text-muted-foreground border-y border-dashed">
              <div>
                <span className="text-[11px] block">Số lượng câu hỏi:</span>
                <span className="font-semibold text-foreground text-sm tabular-nums">
                  {questionSet.itemCount} câu
                </span>
              </div>

              <div>
                <span className="text-[11px] block">Khởi tạo lúc:</span>
                <span className="font-medium text-foreground text-xs">{formattedDate}</span>
              </div>

              {isApproved && formattedApprovedDate && (
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[11px] block text-emerald-600 dark:text-emerald-400">
                    Phê duyệt lúc:
                  </span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-300 text-xs">
                    {formattedApprovedDate}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1">
              <PermissionGate permission={Permissions.QuestionSetsCreate}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCloneOpen(true)}
                  className="h-8 text-xs gap-1"
                  title="Nhân bản bộ câu hỏi thành draft mới"
                >
                  <Copy className="size-3.5" />
                  <span>Clone</span>
                </Button>
              </PermissionGate>

              <PermissionGate permission={Permissions.QuestionSetsManage}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                  className="h-8 text-xs text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                  title="Xóa bộ câu hỏi này"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </PermissionGate>
            </div>

            <Link href={`/applications/${applicationId}/questions/${questionSet.id}`}>
              <Button size="sm" className="h-8 text-xs gap-1.5 shadow-xs">
                <span>{isApproved ? "Xem chi tiết" : "Mở & Chỉnh sửa"}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CloneQuestionSetDialog
        questionSetId={questionSet.id}
        applicationId={applicationId}
        open={cloneOpen}
        onOpenChange={setCloneOpen}
      />

      <DeleteQuestionSetDialog
        questionSetId={questionSet.id}
        applicationId={applicationId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

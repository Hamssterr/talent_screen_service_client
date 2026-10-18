import * as React from "react";
import Link from "next/link";
import { useQuestionSetsQuery } from "../hooks/use-question-sets-query";
import { QuestionSetCard } from "./question-set-card";
import { QuestionSetSummary } from "../types/question-set.types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { PlusCircle, HelpCircle, Sparkles } from "lucide-react";
import { PermissionGate } from "@/features/authorization";
import { Permissions } from "@/features/authorization/permission.constants";

interface QuestionSetListProps {
  applicationId: string;
  isPrerequisiteMet: boolean;
  className?: string;
}

export function QuestionSetList({
  applicationId,
  isPrerequisiteMet,
  className,
}: QuestionSetListProps) {
  const [page, setPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuestionSetsQuery(applicationId, { page, limit: 10 });

  const questionSets: QuestionSetSummary[] = React.useMemo(
    () => result?.data || [],
    [result?.data],
  );
  const meta = result?.meta;

  const filteredSets = React.useMemo(() => {
    if (statusFilter === "all") return questionSets;
    return questionSets.filter(
      (qs: QuestionSetSummary) => qs.status === statusFilter,
    );
  }, [questionSets, statusFilter]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Không thể tải danh sách bộ câu hỏi"
        message={
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi khi tải dữ liệu."
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className={`space-y-5 ${className || ""}`}>
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/40 border text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === "all"
                ? "bg-background font-semibold text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}>
            Tất cả ({questionSets.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("approved")}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === "approved"
                ? "bg-background font-semibold text-emerald-700 dark:text-emerald-300 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}>
            Đã duyệt (
            {
              questionSets.filter(
                (q: QuestionSetSummary) => q.status === "approved",
              ).length
            }
            )
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === "draft"
                ? "bg-background font-semibold text-amber-700 dark:text-amber-300 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}>
            Bản nháp (
            {
              questionSets.filter(
                (q: QuestionSetSummary) => q.status === "draft",
              ).length
            }
            )
          </button>
        </div>

        {/* Create CTA */}
        <PermissionGate permission={Permissions.QuestionSetsCreate}>
          <Link href={`/applications/${applicationId}/questions/new`}>
            <Button
              size="sm"
              disabled={!isPrerequisiteMet}
              className="gap-1.5 shadow-sm">
              <PlusCircle className="size-4" />
              <span>Tạo bộ câu hỏi mới</span>
            </Button>
          </Link>
        </PermissionGate>
      </div>

      {/* List / Empty State */}
      {filteredSets.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title={
            statusFilter === "all"
              ? "Chưa có Bộ câu hỏi nào"
              : "Không có bộ câu hỏi phù hợp bộ lọc"
          }
          description={
            statusFilter === "all"
              ? "Hãy tạo bộ câu hỏi phỏng vấn đầu tiên (bằng AI Gemini hoặc thủ công) cho hồ sơ ứng tuyển này."
              : "Vui lòng chọn bộ lọc khác để xem danh sách."
          }
          primaryAction={
            statusFilter === "all" && isPrerequisiteMet ? (
              <PermissionGate permission={Permissions.QuestionSetsCreate}>
                <Link href={`/applications/${applicationId}/questions/new`}>
                  <Button size="sm" className="gap-1.5 mt-2">
                    <Sparkles className="size-3.5" />
                    <span>Tạo bộ câu hỏi ngay</span>
                  </Button>
                </Link>
              </PermissionGate>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredSets.map((qs: QuestionSetSummary) => (
            <QuestionSetCard
              key={qs.id}
              questionSet={qs}
              applicationId={applicationId}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>
            Trang {meta.page} / {meta.totalPages} (Tổng số {meta.totalItems} bộ
            câu hỏi)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}>
              Trang sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { UploadCloud, FileText, RefreshCw, AlertCircle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { useCvVersionsQuery } from "../hooks/use-cv-versions-query";
import { CvVersionSafe } from "../types/cv.types";
import { CvVersionCard } from "./cv-version-card";
import { cn } from "@/lib/utils";

export interface CvVersionListProps {
  applicationId: string;
  currentCvVersionId?: string | null;
  selectedCvId?: string | null;
  onSelectCv?: (cv: CvVersionSafe) => void;
  onOpenUpload?: () => void;
  canUpload?: boolean;
  isShortlisted?: boolean;
  className?: string;
}

export function CvVersionList({
  applicationId,
  currentCvVersionId,
  selectedCvId,
  onSelectCv,
  onOpenUpload,
  canUpload = false,
  isShortlisted = true,
  className,
}: CvVersionListProps) {
  const [page, setPage] = React.useState(1);
  const limit = 5;

  const { data, isLoading, isError, error, refetch } = useCvVersionsQuery(applicationId, {
    page,
    limit,
  });

  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between pb-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 border rounded-lg bg-destructive/5 text-destructive text-xs space-y-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span className="font-semibold">Không thể tải danh sách phiên bản CV</span>
        </div>
        <p className="text-muted-foreground">{String((error as Error)?.message || "Lỗi máy chủ")}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="h-7 text-xs gap-1.5"
        >
          <RefreshCw className="size-3" />
          <span>Thử lại</span>
        </Button>
      </div>
    );
  }

  const versions = data?.data || [];
  const meta = data?.meta;

  if (versions.length === 0) {
    return (
      <div className={cn("border rounded-lg p-6 bg-card", className)}>
        <EmptyState
          icon={FileText}
          title="Chưa có phiên bản CV nào"
          description="Hồ sơ ứng tuyển này đã được tạo nhưng ứng viên chưa có tệp CV PDF nào được tải lên."
          primaryAction={
            canUpload && isShortlisted && onOpenUpload ? (
              <Button size="sm" onClick={onOpenUpload} className="h-8 text-xs gap-1.5">
                <UploadCloud className="size-3.5" />
                <span>Tải lên CV PDF đầu tiên</span>
              </Button>
            ) : undefined
          }
          className="py-6"
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Layers className="size-4 text-primary" />
          <span>Lịch sử phiên bản CV ({meta?.totalItems ?? versions.length})</span>
        </div>

        {canUpload && isShortlisted && onOpenUpload && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenUpload}
            className="h-7 text-xs gap-1.5"
          >
            <UploadCloud className="size-3.5 text-primary" />
            <span>Tải bản mới</span>
          </Button>
        )}
      </div>

      <div className="space-y-2.5">
        {versions.map((cv) => {
          const isCurrent = currentCvVersionId === cv.id;
          const isSelected = selectedCvId === cv.id;

          return (
            <CvVersionCard
              key={cv.id}
              cv={cv}
              isCurrent={isCurrent}
              isSelected={isSelected}
              onSelect={() => onSelectCv?.(cv)}
            />
          );
        })}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="pt-2 border-t">
          <PaginationBar
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

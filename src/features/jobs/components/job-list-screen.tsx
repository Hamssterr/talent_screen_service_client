"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Plus, Briefcase, RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { OffsetPagination } from "@/components/shared/offset-pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { useJobsQuery } from "../hooks/use-jobs-query";
import { JobListParams, JobListScope, JobStatus } from "../types/job.types";
import { JobFilterBar } from "./job-filter-bar";
import { JobTable } from "./job-table";
import { cn } from "@/lib/utils";

export function JobListScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { can } = useSession();

  // Parse filters from URL
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const statusParam = searchParams.get("status");
  const scopeParam = searchParams.get("scope");

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : 10;
  const status: JobStatus | "all" =
    statusParam === "draft" || statusParam === "open" || statusParam === "closed"
      ? statusParam
      : "all";
  const scope: JobListScope =
    scopeParam === "mine" || scopeParam === "shared"
      ? scopeParam
      : "all";

  // Build query params object
  const queryParams: JobListParams = React.useMemo(() => {
    const p: JobListParams = { page, limit };
    if (status !== "all") {
      p.status = status;
    }
    if (scope !== "all") {
      p.scope = scope;
    }
    return p;
  }, [page, limit, status, scope]);

  const { data, isLoading, isError, error, refetch, isFetching } = useJobsQuery(queryParams);

  // URL updater helper
  const updateUrlParams = React.useCallback(
    (updates: Partial<{ page: number; limit: number; status: string; scope: string }>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "all" || (key === "page" && val === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });

      // If updating status or scope, reset page to 1
      if (updates.status !== undefined || updates.scope !== undefined) {
        if (updates.page === undefined) {
          params.delete("page");
        }
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const handleStatusChange = (newStatus: JobStatus | "") => {
    updateUrlParams({ status: newStatus || "all" });
  };

  const handleScopeChange = (newScope: JobListScope) => {
    updateUrlParams({ scope: newScope });
  };

  const handleResetFilters = () => {
    updateUrlParams({ status: "all", scope: "all", page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const hasActiveFilters = status !== "all" || scope !== "all";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vị trí tuyển dụng"
        description="Quản lý các vị trí tuyển dụng, theo dõi trạng thái và thiết lập khung tiêu chí đánh giá cho từng vị trí."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
            {can(Permissions.JobsCreate) && (
              <Link
                href="/jobs/new"
                className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
              >
                <Plus className="h-4 w-4" />
                Tạo vị trí mới
              </Link>
            )}
          </div>
        }
      />

      {/* Filter Bar */}
      <JobFilterBar
        status={status === "all" ? "" : status}
        scope={scope}
        onStatusChange={handleStatusChange}
        onScopeChange={handleScopeChange}
        onReset={handleResetFilters}
      />

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Không thể tải danh sách vị trí tuyển dụng"
          message={error instanceof Error ? error.message : "Đã có lỗi xảy ra."}
          onRetry={() => refetch()}
        />
      ) : !data || data.data.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={Briefcase}
            title="Không tìm thấy vị trí tuyển dụng phù hợp"
            description="Không có vị trí nào thỏa mãn bộ lọc hiện tại. Thử thay đổi trạng thái hoặc phạm vi lọc."
            primaryAction={
              <Button variant="outline" onClick={handleResetFilters}>
                Xóa bộ lọc
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Briefcase}
            title="Chưa có vị trí tuyển dụng nào"
            description="Bắt đầu tạo vị trí tuyển dụng đầu tiên để quản lý hồ sơ ứng viên và câu hỏi đánh giá."
            primaryAction={
              can(Permissions.JobsCreate) ? (
                <Button onClick={() => router.push("/jobs/new")}>
                  Tạo vị trí mới
                </Button>
              ) : undefined
            }
          />
        )
      ) : (
        <div className="space-y-4">
          <JobTable jobs={data.data} />

          <OffsetPagination
            page={data.meta.page}
            limit={data.meta.limit}
            totalItems={data.meta.totalItems}
            totalPages={data.meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

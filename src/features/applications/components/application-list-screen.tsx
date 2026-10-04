"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FilePlus, Briefcase, RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { OffsetPagination } from "@/components/shared/offset-pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { useApplicationsQuery } from "../hooks/use-applications-query";
import {
  ApplicationListScope,
  ApplicationStatus,
  ListApplicationsParams,
} from "../types/application.types";
import { ApplicationFilterBar } from "./application-filter-bar";
import { ApplicationTable } from "./application-table";
import { cn } from "@/lib/utils";

export function ApplicationListScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { can } = useSession();

  const canCreate = can(Permissions.ApplicationsCreate);

  // Read URL params
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const statusParam = searchParams.get("status");
  const scopeParam = searchParams.get("scope");
  const jobIdParam = searchParams.get("jobId") || undefined;
  const candidateIdParam = searchParams.get("candidateId") || undefined;

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : 10;
  const status: ApplicationStatus | "" =
    statusParam &&
    ["shortlisted", "interviewing", "under_review", "approved", "rejected", "withdrawn"].includes(
      statusParam,
    )
      ? (statusParam as ApplicationStatus)
      : "";
  const scope: ApplicationListScope =
    scopeParam && ["all", "mine", "job-owned"].includes(scopeParam)
      ? (scopeParam as ApplicationListScope)
      : "all";

  const queryParams: ListApplicationsParams = React.useMemo(() => {
    const p: ListApplicationsParams = { page, limit };
    if (status) p.status = status;
    if (scope && scope !== "all") p.scope = scope;
    if (jobIdParam) p.jobId = jobIdParam;
    if (candidateIdParam) p.candidateId = candidateIdParam;
    return p;
  }, [page, limit, status, scope, jobIdParam, candidateIdParam]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useApplicationsQuery(queryParams);

  const updateUrlParams = React.useCallback(
    (updates: Partial<{ page: number; limit: number; status: string; scope: string }>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "" || val === "all" || (key === "page" && val === 1)) {
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

  const handleStatusChange = (newStatus: ApplicationStatus | "") => {
    updateUrlParams({ status: newStatus });
  };

  const handleScopeChange = (newScope: ApplicationListScope) => {
    updateUrlParams({ scope: newScope });
  };

  const handleResetFilters = () => {
    updateUrlParams({ status: "", scope: "all", page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const hasActiveFilters = Boolean(status || (scope && scope !== "all") || jobIdParam || candidateIdParam);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Hồ sơ Ứng tuyển"
        description="Theo dõi toàn bộ quy trình từ sơ tuyển, phỏng vấn AI đến thẩm định và quyết định tuyển dụng."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
            {canCreate && (
              <Link
                href="/applications/new"
                className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
              >
                <FilePlus className="size-4" />
                <span>Nộp hồ sơ mới</span>
              </Link>
            )}
          </div>
        }
      />

      {/* Filter Bar */}
      <ApplicationFilterBar
        status={status}
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
        </div>
      ) : isError ? (
        <ErrorState
          title="Không thể tải danh sách hồ sơ ứng tuyển"
          message={error instanceof Error ? error.message : "Đã có lỗi xảy ra."}
          onRetry={() => refetch()}
        />
      ) : !data || data.data.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={Briefcase}
            title="Không tìm thấy hồ sơ phù hợp"
            description="Không có hồ sơ nào thỏa mãn bộ lọc hiện tại. Thử thay đổi trạng thái hoặc phạm vi lọc."
            primaryAction={
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Xóa bộ lọc
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Briefcase}
            title="Chưa có hồ sơ ứng tuyển nào"
            description="Bắt đầu nộp hồ sơ ứng viên vào một vị trí tuyển dụng đang mở để bắt đầu quy trình."
            primaryAction={
              canCreate ? (
                <Link
                  href="/applications/new"
                  className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
                >
                  <FilePlus className="size-4" />
                  <span>Nộp hồ sơ ứng tuyển đầu tiên</span>
                </Link>
              ) : undefined
            }
          />
        )
      ) : (
        <div className="space-y-4">
          <ApplicationTable applications={data.data} onRefresh={() => refetch()} />

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

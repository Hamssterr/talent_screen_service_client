"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { PageHeader } from "@/components/shared/page-header";
import { OffsetPagination } from "@/components/shared/offset-pagination";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import {
  useAdminAuditLogsQuery,
  AuditLogTable,
} from "@/features/admin";

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data, isLoading, isError, error, refetch } = useAdminAuditLogsQuery({
    page,
    limit: 10,
  });

  const logs = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return (
    <RequirePermission permission={Permissions.AuditRead}>
      <div className="space-y-6">
        <PageHeader
          title="Nhật ký kiểm toán hệ thống"
          description="Truy vết toàn bộ các hành động quản trị, thay đổi phân quyền và truy cập quan trọng trên hệ thống."
        />

        {isLoading ? (
          <LoadingState mode="skeleton" rows={5} />
        ) : isError ? (
          <ErrorState
            title="Không thể tải nhật ký kiểm toán"
            message={
              error?.message ||
              "Đã xảy ra lỗi khi truy xuất dữ liệu nhật ký kiểm toán."
            }
            onRetry={() => refetch()}
          />
        ) : (
          <div className="space-y-4">
            <AuditLogTable logs={logs} isLoading={isLoading} />

            <OffsetPagination
              page={meta.page}
              limit={meta.limit}
              totalItems={meta.totalItems}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </RequirePermission>
  );
}

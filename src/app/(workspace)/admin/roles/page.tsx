"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { useCan } from "@/features/authorization/hooks/use-can";
import { Permissions } from "@/features/authorization/permission.constants";
import { PageHeader } from "@/components/shared/page-header";
import { OffsetPagination } from "@/components/shared/offset-pagination";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";
import {
  useAdminRolesQuery,
  RoleTable,
  CreateRoleDialog,
} from "@/features/admin";
import { Plus } from "lucide-react";

export default function AdminRolesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const canCreateRoles = useCan(Permissions.RolesCreate);
  const [createRoleOpen, setCreateRoleOpen] = React.useState(false);

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data, isLoading, isError, error, refetch } = useAdminRolesQuery({
    page,
    limit: 10,
  });

  const roles = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return (
    <RequirePermission permission={Permissions.RolesRead}>
      <div className="space-y-6">
        <PageHeader
          title="Quản lý vai trò"
          description="Danh sách các nhóm vai trò trong hệ thống và định nghĩa quyền hạn tương ứng."
          actions={
            canCreateRoles && (
              <Button onClick={() => setCreateRoleOpen(true)} className="gap-2">
                <Plus className="size-4" />
                <span>Tạo vai trò mới</span>
              </Button>
            )
          }
        />

        {isLoading ? (
          <LoadingState mode="skeleton" rows={4} />
        ) : isError ? (
          <ErrorState
            title="Không thể tải danh sách vai trò"
            message={
              error?.message || "Đã xảy ra lỗi khi truy xuất danh mục vai trò."
            }
            onRetry={() => refetch()}
          />
        ) : (
          <div className="space-y-4">
            <RoleTable roles={roles} isLoading={isLoading} />

            <OffsetPagination
              page={meta.page}
              limit={meta.limit}
              totalItems={meta.totalItems}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Create Role Dialog */}
        <CreateRoleDialog
          open={createRoleOpen}
          onOpenChange={setCreateRoleOpen}
        />
      </div>
    </RequirePermission>
  );
}

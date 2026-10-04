"use client";

import * as React from "react";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { useCan } from "@/features/authorization/hooks/use-can";
import { Permissions } from "@/features/authorization/permission.constants";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useAdminPermissionsQuery,
  useAdminRolesQuery,
  PermissionList,
  PermissionMatrix,
} from "@/features/admin";
import { Grid3X3, ListFilter } from "lucide-react";

export default function AdminPermissionsPage() {
  const canManageRolePermissions = useCan(Permissions.RolePermissionsManage);

  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
    error: permissionsError,
    refetch: refetchPermissions,
  } = useAdminPermissionsQuery({
    limit: 100,
  });

  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useAdminRolesQuery({
    limit: 50,
  });

  const isLoading = isLoadingPermissions || isLoadingRoles;
  const isError = isErrorPermissions || isErrorRoles;
  const permissions = permissionsData?.data || [];
  const roles = rolesData?.data || [];

  return (
    <RequirePermission permission={Permissions.PermissionsRead}>
      <div className="space-y-6">
        <PageHeader
          title="Ma trận & Danh mục quyền hạn"
          description="Kiểm soát toàn bộ quyền hạn phân tán trong hệ thống và thiết lập ma trận phân quyền cho từng vai trò."
        />

        {isLoading ? (
          <LoadingState mode="skeleton" rows={6} />
        ) : isError ? (
          <ErrorState
            title="Không thể tải dữ liệu phân quyền"
            message={
              permissionsError?.message ||
              rolesError?.message ||
              "Đã xảy ra lỗi khi truy xuất ma trận phân quyền."
            }
            onRetry={() => {
              refetchPermissions();
              refetchRoles();
            }}
          />
        ) : (
          <Tabs defaultValue="matrix" className="space-y-4">
            <TabsList>
              <TabsTrigger value="matrix" className="gap-2">
                <Grid3X3 className="size-4" />
                <span>Ma trận phân quyền (Matrix)</span>
              </TabsTrigger>
              <TabsTrigger value="catalog" className="gap-2">
                <ListFilter className="size-4" />
                <span>Danh mục quyền hạn ({permissions.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matrix" className="space-y-4">
              <PermissionMatrix
                roles={roles}
                permissions={permissions}
                canEdit={canManageRolePermissions}
              />
            </TabsContent>

            <TabsContent value="catalog" className="space-y-4">
              <PermissionList permissions={permissions} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </RequirePermission>
  );
}

"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { useAdminUserDetailQuery, UserDetail } from "@/features/admin";

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const { data: user, isLoading, isError, error, refetch } =
    useAdminUserDetailQuery(id);

  return (
    <RequirePermission permission={Permissions.UsersRead}>
      {isLoading ? (
        <LoadingState mode="skeleton" rows={4} />
      ) : isError || !user ? (
        <ErrorState
          title="Không tìm thấy người dùng"
          message={
            error?.message ||
            "Không thể tải thông tin chi tiết người dùng hoặc người dùng không tồn tại."
          }
          onRetry={() => refetch()}
        />
      ) : (
        <UserDetail user={user} />
      )}
    </RequirePermission>
  );
}

"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { useApplicationQuery, ApplicationHeader, ApplicationWorkspaceNav } from "@/features/applications";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";

export default function ApplicationWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ applicationId: string }>();
  const applicationId = params?.applicationId || "";

  const {
    data: application,
    isLoading,
    isError,
    error,
    refetch,
  } = useApplicationQuery(applicationId);

  return (
    <RequirePermission permission={Permissions.ApplicationsRead}>
      {isLoading ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-10 w-96 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : isError || !application ? (
        <ErrorState
          title="Không tìm thấy hồ sơ ứng tuyển"
          message={
            error instanceof Error
              ? error.message
              : "Hồ sơ ứng tuyển không tồn tại hoặc bạn không có quyền truy cập."
          }
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-6">
          {/* Workspace Header */}
          <ApplicationHeader application={application} onRefresh={() => refetch()} />

          {/* Tab Navigation */}
          <ApplicationWorkspaceNav applicationId={application.id} />

          {/* Tab Content */}
          <div>{children}</div>
        </div>
      )}
    </RequirePermission>
  );
}

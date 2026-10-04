"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { JobForm, useJobQuery } from "@/features/jobs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";

export default function EditJobPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params?.jobId || "";

  const { data: job, isLoading, isError, error, refetch } = useJobQuery(jobId);

  return (
    <RequirePermission permission={Permissions.JobsUpdate}>
      {isLoading ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : isError || !job ? (
        <ErrorState
          title="Không thể tải thông tin vị trí tuyển dụng"
          message={error instanceof Error ? error.message : "Đã có lỗi xảy ra."}
          onRetry={() => refetch()}
        />
      ) : (
        <JobForm mode="edit" job={job} onReload={() => refetch()} />
      )}
    </RequirePermission>
  );
}

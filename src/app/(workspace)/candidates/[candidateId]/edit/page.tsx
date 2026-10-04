"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { CandidateForm, useCandidateQuery } from "@/features/candidates";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";

export default function EditCandidatePage() {
  const params = useParams<{ candidateId: string }>();
  const candidateId = params?.candidateId || "";

  const { data: candidate, isLoading, isError, error, refetch } = useCandidateQuery(candidateId);

  return (
    <RequirePermission permission={Permissions.CandidatesUpdate}>
      {isLoading ? (
        <div className="space-y-6 max-w-3xl mx-auto">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : isError || !candidate ? (
        <ErrorState
          title="Không tìm thấy ứng viên"
          message={error instanceof Error ? error.message : "Đã có lỗi xảy ra."}
          onRetry={() => refetch()}
        />
      ) : (
        <CandidateForm mode="edit" candidate={candidate} />
      )}
    </RequirePermission>
  );
}

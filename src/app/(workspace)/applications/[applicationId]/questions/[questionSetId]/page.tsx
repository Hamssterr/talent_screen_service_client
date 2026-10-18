"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuestionSetQuery, QuestionSetEditor } from "@/features/question-sets";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";

export default function QuestionSetDetailPage() {
  const params = useParams();

  const applicationId = typeof params.applicationId === "string" ? params.applicationId : "";
  const questionSetId = typeof params.questionSetId === "string" ? params.questionSetId : "";

  const {
    data: questionSet,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuestionSetQuery(questionSetId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !questionSet) {
    return (
      <RequirePermission permission={Permissions.QuestionSetsRead}>
        <ErrorState
          title="Không tìm thấy bộ câu hỏi"
          message={
            error instanceof Error
              ? error.message
              : "Bộ câu hỏi không tồn tại hoặc bạn không có quyền xem."
          }
          onRetry={() => refetch()}
        />
      </RequirePermission>
    );
  }

  return (
    <RequirePermission permission={Permissions.QuestionSetsRead}>
      <QuestionSetEditor
        key={`${questionSet.id}-${questionSet.version}-${questionSet.items?.length ?? 0}`}
        questionSet={questionSet}
        applicationId={applicationId}
      />
    </RequirePermission>
  );
}

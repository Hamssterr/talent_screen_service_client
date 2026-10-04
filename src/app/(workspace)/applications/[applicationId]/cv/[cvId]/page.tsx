"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useApplicationQuery } from "@/features/applications/hooks/use-application-query";
import { CvWorkspace } from "@/features/documents/components/cv-workspace";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { AlertCircle } from "lucide-react";

export default function ApplicationCvDetailPage() {
  const params = useParams();
  const applicationId = typeof params.applicationId === "string" ? params.applicationId : "";
  const cvId = typeof params.cvId === "string" ? params.cvId : "";

  const { data: application, isLoading, isError, error, refetch } = useApplicationQuery(applicationId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[450px] w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Không tìm thấy hồ sơ ứng tuyển"
        description={String((error as Error)?.message || "Hồ sơ ứng tuyển không tồn tại hoặc bạn không có quyền truy cập.")}
        primaryAction={
          <Button size="sm" onClick={() => refetch()} className="h-8 text-xs">
            Thử lại
          </Button>
        }
        className="py-12"
      />
    );
  }

  return (
    <CvWorkspace
      application={application}
      initialCvId={cvId}
      onRefreshApplication={refetch}
    />
  );
}

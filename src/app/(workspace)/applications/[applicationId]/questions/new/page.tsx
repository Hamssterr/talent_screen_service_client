"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, AlertTriangle, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplicationQuery } from "@/features/applications/hooks/use-application-query";
import { useCvVersionQuery } from "@/features/documents/hooks/use-cv-version-query";
import { CreateQuestionSetForm } from "@/features/question-sets";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";

export default function NewQuestionSetPage() {
  const params = useParams();
  const applicationId = typeof params.applicationId === "string" ? params.applicationId : "";

  const { data: application, isLoading: isAppLoading } = useApplicationQuery(applicationId);
  const currentCvId = application?.currentCvVersionId || undefined;

  const { data: currentCv, isLoading: isCvLoading } = useCvVersionQuery(currentCvId, {
    enabled: Boolean(currentCvId),
  });

  if (isAppLoading || (currentCvId && isCvLoading)) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const isShortlisted = application?.status === "shortlisted";
  const isCvApproved = currentCv && currentCv.profileStatus === "approved";
  const isPrerequisiteMet = Boolean(isShortlisted && isCvApproved);

  return (
    <RequirePermission permission={Permissions.QuestionSetsCreate}>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href={`/applications/${applicationId}/questions`}
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Quay lại danh sách Bộ câu hỏi</span>
          </Link>
        </div>

        {/* Prerequisite Warnings */}
        {!isShortlisted ? (
          <Card className="border-amber-500/30 bg-amber-500/5 max-w-2xl mx-auto">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  Không thể tạo: Hồ sơ ứng viên chưa ở trạng thái Shortlisted
                </p>
                <p className="text-muted-foreground">
                  Hồ sơ cần được chuyển trạng thái sang Shortlisted trước khi tạo bộ câu hỏi phỏng vấn.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : !isCvApproved ? (
          <Card className="border-amber-500/30 bg-amber-500/5 max-w-2xl mx-auto">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <p className="font-semibold text-amber-800 dark:text-amber-300">
                    Không thể tạo: Hồ sơ CV chưa được phê duyệt
                  </p>
                  <p className="text-muted-foreground">
                    Cần phê duyệt bản CV tại tab CV để có hồ sơ trích xuất hợp lệ cho AI/Manual question generation.
                  </p>
                </div>
              </div>

              <Link href={`/applications/${applicationId}/cv`} className="shrink-0">
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10">
                  <FileText className="size-3.5" />
                  <span>Tới Tab CV</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}

        {/* Create Form */}
        <CreateQuestionSetForm
          applicationId={applicationId}
          currentCvVersionId={currentCvId}
          isPrerequisiteMet={isPrerequisiteMet}
        />
      </div>
    </RequirePermission>
  );
}

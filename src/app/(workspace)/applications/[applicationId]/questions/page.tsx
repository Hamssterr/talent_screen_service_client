"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplicationQuery } from "@/features/applications/hooks/use-application-query";
import { useCvVersionQuery } from "@/features/documents/hooks/use-cv-version-query";
import { QuestionSetList } from "@/features/question-sets";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";

export default function ApplicationQuestionsPage() {
  const params = useParams();
  const applicationId =
    typeof params.applicationId === "string" ? params.applicationId : "";

  const { data: application, isLoading: isAppLoading } =
    useApplicationQuery(applicationId);
  const currentCvId = application?.currentCvVersionId || undefined;

  const { data: currentCv, isLoading: isCvLoading } = useCvVersionQuery(
    currentCvId,
    {
      enabled: Boolean(currentCvId),
    },
  );

  if (isAppLoading || (currentCvId && isCvLoading)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const isShortlisted = application?.status === "shortlisted";
  const isCvApproved = currentCv && currentCv.profileStatus === "approved";
  const isPrerequisiteMet = Boolean(isShortlisted && isCvApproved);

  return (
    <RequirePermission permission={Permissions.QuestionSetsRead}>
      <div className="space-y-6">
        {/* Prerequisite Check Banners */}
        {!isShortlisted ? (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <p className="font-semibold text-amber-800 dark:text-amber-300">
                    Điều kiện tiên quyết: Hồ sơ ứng viên cần ở trạng thái
                    Shortlisted
                  </p>
                  <p className="text-muted-foreground">
                    Theo quy trình tuyển dụng, chỉ những hồ sơ đã được duyệt vào
                    danh sách sàng lọc (Shortlisted) mới được tạo Bộ câu hỏi
                    phỏng vấn.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !isCvApproved ? (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <p className="font-semibold text-amber-800 dark:text-amber-300">
                    Điều kiện tiên quyết: Hồ sơ CV chưa được phê duyệt
                  </p>
                  <p className="text-muted-foreground">
                    Để thiết lập Bộ câu hỏi phỏng vấn (Question Sets), hồ sơ ứng
                    tuyển cần có một bản CV PDF đã được trích xuất và phê duyệt
                    (approved) tại tab CV.
                  </p>
                </div>
              </div>

              <Link
                href={`/applications/${applicationId}/cv`}
                className="shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10">
                  <FileText className="size-3.5" />
                  <span>Chuyển tới Tab CV</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-emerald-500/30 bg-emerald-500/[0.03]">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="space-y-0.5 text-xs">
                <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                  Điều kiện tiên quyết đạt chuẩn: Hồ sơ Shortlisted & Bản CV v
                  {currentCv?.version} đã được duyệt
                </p>
                <p className="text-muted-foreground">
                  Hồ sơ trích xuất CV (profile.v1) và tiêu chí Job đã sẵn sàng
                  làm cơ sở sinh bộ câu hỏi.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Sets List */}
        <QuestionSetList
          applicationId={applicationId}
          isPrerequisiteMet={isPrerequisiteMet}
        />
      </div>
    </RequirePermission>
  );
}

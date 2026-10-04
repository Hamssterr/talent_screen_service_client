"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HelpCircle, AlertTriangle, ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { useApplicationQuery } from "@/features/applications/hooks/use-application-query";
import { useCvVersionQuery } from "@/features/documents/hooks/use-cv-version-query";

export default function ApplicationQuestionsPage() {
  const params = useParams();
  const applicationId = typeof params.applicationId === "string" ? params.applicationId : "";

  const { data: application, isLoading: isAppLoading } = useApplicationQuery(applicationId);
  const currentCvId = application?.currentCvVersionId || undefined;

  const { data: currentCv, isLoading: isCvLoading } = useCvVersionQuery(currentCvId, {
    enabled: Boolean(currentCvId),
  });

  if (isAppLoading || (currentCvId && isCvLoading)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  const isCvApproved = currentCv && currentCv.profileStatus === "approved";

  return (
    <div className="space-y-6">
      {/* Prerequisite Check Banner */}
      {!isCvApproved ? (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  Điều kiện tiên quyết: Hồ sơ CV chưa được phê duyệt
                </p>
                <p className="text-muted-foreground">
                  Để thiết lập Bộ câu hỏi phỏng vấn (Question Sets), hồ sơ ứng tuyển cần có một bản CV PDF đã được trích xuất và phê duyệt (approved) tại tab CV.
                </p>
              </div>
            </div>

            <Link href={`/applications/${applicationId}/cv`} className="shrink-0">
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10">
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
                Điều kiện tiên quyết đạt chuẩn: Bản CV v{currentCv.version} đã được phê duyệt
              </p>
              <p className="text-muted-foreground">
                Hồ sơ trích xuất (profile.v1) đã sẵn sàng làm cơ sở sinh câu hỏi phỏng vấn.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Module Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <HelpCircle className="size-4" />
            <CardTitle className="text-base font-semibold">Bộ câu hỏi Phỏng vấn (Question Sets)</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Thiết lập câu hỏi phỏng vấn chuẩn hóa theo tiêu chí Job và nội dung trích xuất từ CV.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={HelpCircle}
            title="Phân hệ Quản lý & Sinh bộ câu hỏi (Todo 07)"
            description="Chức năng tạo bộ câu hỏi thủ công, sinh câu hỏi tự động dựa trên CV + Job Rubric bằng AI và phê duyệt bộ câu hỏi sẽ sẵn sàng trong Todo 07."
            className="py-12"
          />
        </CardContent>
      </Card>
    </div>
  );
}

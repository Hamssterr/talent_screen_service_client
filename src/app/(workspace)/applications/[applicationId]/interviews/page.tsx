"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Video, AlertTriangle, ArrowRight, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { useQuestionSetsQuery, QuestionSetSummary } from "@/features/question-sets";

export default function ApplicationInterviewsPage() {
  const params = useParams();
  const applicationId = typeof params.applicationId === "string" ? params.applicationId : "";

  const { data: result, isLoading } = useQuestionSetsQuery(applicationId);
  const questionSets: QuestionSetSummary[] = result?.data || [];
  const approvedQuestionSets = questionSets.filter((qs: QuestionSetSummary) => qs.status === "approved");
  const hasApprovedQuestionSet = approvedQuestionSets.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Prerequisite Check Banner */}
      {!hasApprovedQuestionSet ? (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  Điều kiện tiên quyết: Chưa có Bộ câu hỏi được phê duyệt
                </p>
                <p className="text-muted-foreground">
                  Để tạo Phiên phỏng vấn (Interview session), hồ sơ ứng tuyển cần có ít nhất một Bộ câu hỏi đã được phê duyệt (Approved) tại tab Câu hỏi.
                </p>
              </div>
            </div>

            <Link href={`/applications/${applicationId}/questions`} className="shrink-0">
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10">
                <HelpCircle className="size-3.5" />
                <span>Tới Tab Câu hỏi</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Video className="size-4" />
            <CardTitle className="text-base font-semibold">Phiên Phỏng vấn & Thư mời (Interviews)</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Khởi tạo phiên phỏng vấn thoại AI, gửi thư mời kèm mã bảo mật đến ứng viên và theo dõi trạng thái gửi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Video}
            title="Phân hệ Phiên phỏng vấn AI & Thư mời (Todo 08)"
            description="Chức năng tạo phiên phỏng vấn, tạo liên kết mời tham gia phỏng vấn an toàn và quản lý thông báo sẽ được triển khai trong Todo 08."
            className="py-12"
          />
        </CardContent>
      </Card>
    </div>
  );
}

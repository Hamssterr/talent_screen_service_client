import * as React from "react";
import Link from "next/link";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StaleQuestionSetAlertProps {
  applicationId: string;
  className?: string;
}

export function StaleQuestionSetAlert({ applicationId, className }: StaleQuestionSetAlertProps) {
  return (
    <Card className={`border-amber-500/40 bg-amber-500/5 ${className || ""}`}>
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-500/20 p-2 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
            <AlertTriangle className="size-5" />
          </div>
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
              Bộ câu hỏi đã bị cũ (Stale)
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Thông tin tiêu chí Job hoặc phiên bản CV đã được cập nhật bản mới kể từ khi bộ câu hỏi này được tạo.
              Hệ thống đã khóa tính năng phê duyệt (approve) của bộ câu hỏi này để đảm bảo tính nhất quán đánh giá.
            </p>
            <p className="text-amber-700 dark:text-amber-400 font-medium">
              Khuyến nghị: Hãy tạo một Bộ câu hỏi mới để đồng bộ snapshot mới nhất từ Job & CV.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <Link href={`/applications/${applicationId}/questions/new`}>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white shadow-sm">
              <PlusCircle className="size-3.5" />
              <span>Tạo bộ câu hỏi mới</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

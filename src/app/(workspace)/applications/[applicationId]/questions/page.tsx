"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";

export default function ApplicationQuestionsPage() {
  return (
    <div className="space-y-6">
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

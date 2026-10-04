"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";

export default function ApplicationCvPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="size-4" />
            <CardTitle className="text-base font-semibold">Hồ sơ & Bản CV (Curriculum Vitae)</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Quản lý tệp CV PDF/DOCX, trích xuất cấu trúc hồ sơ bằng AI và phê duyệt hồ sơ ứng viên.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={FileText}
            title="Phân hệ Quản lý & Trích xuất CV (Todo 06)"
            description="Chức năng tải lên tài liệu CV đa phiên bản, trích xuất dữ liệu tự động bằng AI và phê duyệt hồ sơ sẽ được tích hợp trong giai đoạn tiếp theo (Todo 06)."
            className="py-12"
          />
        </CardContent>
      </Card>
    </div>
  );
}

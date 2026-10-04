"use client";

import * as React from "react";
import { Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";

export default function ApplicationInterviewsPage() {
  return (
    <div className="space-y-6">
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

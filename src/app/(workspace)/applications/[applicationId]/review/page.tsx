"use client";

import * as React from "react";
import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";

export default function ApplicationReviewPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Award className="size-4" />
            <CardTitle className="text-base font-semibold">Đánh giá & Quyết định Tuyển dụng (Reviews & Decisions)</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Xem biên bản phỏng vấn, tóm tắt AI, nhập điểm đánh giá theo tiêu chí và phê duyệt quyết định tuyển dụng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Award}
            title="Phân hệ Đánh giá HR & Quyết định Tuyển dụng (Todo 10)"
            description="Chức năng phân tích biên bản phỏng vấn, thẩm định của chuyên viên HR và phê duyệt quyết định tuyển dụng (Approved/Rejected) sẽ sẵn sàng trong Todo 10."
            className="py-12"
          />
        </CardContent>
      </Card>
    </div>
  );
}

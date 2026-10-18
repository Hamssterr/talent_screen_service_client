import * as React from "react";
import { Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionSetStatus } from "../types/question-set.types";
import { PermissionGate } from "@/features/authorization";
import { Permissions } from "@/features/authorization/permission.constants";

interface GenerationStatusPanelProps {
  status: QuestionSetStatus;
  generationVersion: number;
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
}

export function GenerationStatusPanel({
  status,
  generationVersion,
  onRetry,
  isRetrying = false,
  className,
}: GenerationStatusPanelProps) {
  if (status === "generating") {
    return (
      <Card className={`border-purple-500/30 bg-purple-500/[0.04] overflow-hidden ${className || ""}`}>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="relative flex items-center justify-center size-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 shrink-0">
            <Sparkles className="size-7 animate-pulse" />
            <Loader2 className="absolute size-10 animate-spin text-purple-500/40" />
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="font-semibold text-sm text-foreground">
                AI Gemini đang sinh bộ câu hỏi phỏng vấn
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                Phiên bản #{generationVersion}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Hệ thống đang đối chiếu hồ sơ trích xuất CV (profile.v1) với các tiêu chí tuyển dụng (Rubric JD)
              để tự động tạo các câu hỏi sàng lọc chuyên sâu.
            </p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              Trang web sẽ tự động làm mới ngay khi AI xử lý xong (polling thời gian thực)...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "failed") {
    return (
      <Card className={`border-rose-500/40 bg-rose-500/[0.04] ${className || ""}`}>
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
              <AlertCircle className="size-6" />
            </div>
            <div className="space-y-1 text-xs">
              <h3 className="font-semibold text-sm text-rose-800 dark:text-rose-300">
                Quá trình sinh câu hỏi bằng AI chưa thành công
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xl">
                Quá trình AI xử lý gặp sự cố kết nối hoặc dữ liệu trích xuất chưa hoàn tất. Dữ liệu bộ câu hỏi draft
                vẫn được lưu trữ an toàn để bạn có thể thử lại.
              </p>
            </div>
          </div>

          <PermissionGate permission={Permissions.QuestionSetsCreate}>
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              className="gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-sm shrink-0 self-end sm:self-center"
            >
              {isRetrying ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              <span>{isRetrying ? "Đang gửi yêu cầu..." : "Thử lại sinh AI"}</span>
            </Button>
          </PermissionGate>
        </CardContent>
      </Card>
    );
  }

  return null;
}

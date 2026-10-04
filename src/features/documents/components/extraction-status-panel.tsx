"use client";

import * as React from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Edit,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AsyncButton } from "@/components/shared/async-button";
import { CvVersionDetail } from "../types/cv.types";
import { getExtractionErrorInfo } from "../utils/extraction-error-message";
import { useExtractCvProfileMutation } from "../hooks/use-extract-cv-profile-mutation";
import { useRetryCvExtractionMutation } from "../hooks/use-retry-cv-extraction-mutation";
import { getApiError } from "@/lib/api/api-error";
import { cn } from "@/lib/utils";

export interface ExtractionStatusPanelProps {
  cv: CvVersionDetail;
  canUpdateProfile?: boolean;
  isShortlisted?: boolean;
  onStartManualEdit?: () => void;
  onRefresh?: () => void;
  className?: string;
}

export function ExtractionStatusPanel({
  cv,
  canUpdateProfile = false,
  isShortlisted = true,
  onStartManualEdit,
  onRefresh,
  className,
}: ExtractionStatusPanelProps) {
  // Idempotency keys for extract and retry commands
  const [extractCommandKey, setExtractCommandKey] = React.useState<string | null>(null);
  const [retryCommandKey, setRetryCommandKey] = React.useState<string | null>(null);

  const [actionError, setActionError] = React.useState<string | null>(null);

  const extractMutation = useExtractCvProfileMutation();
  const retryMutation = useRetryCvExtractionMutation();

  const isProcessing = cv.extractionStatus === "processing";
  const isApproved = cv.profileStatus === "approved";

  const handleExtract = async () => {
    setActionError(null);
    let key = extractCommandKey;
    if (!key) {
      key = crypto.randomUUID();
      setExtractCommandKey(key);
    }

    try {
      await extractMutation.mutateAsync({
        id: cv.id,
        data: {
          expectedProcessingVersion: cv.processingVersion,
        },
        idempotencyKey: key,
      });
      // Clear key upon success
      setExtractCommandKey(null);
      onRefresh?.();
    } catch (err: unknown) {
      const apiErr = getApiError(err);
      setActionError(apiErr.message || "Không thể kích hoạt trích xuất AI. Vui lòng thử lại.");
    }
  };

  const handleRetry = async () => {
    setActionError(null);
    let key = retryCommandKey;
    if (!key) {
      key = crypto.randomUUID();
      setRetryCommandKey(key);
    }

    try {
      await retryMutation.mutateAsync({
        id: cv.id,
        data: {
          expectedProcessingVersion: cv.processingVersion,
        },
        idempotencyKey: key,
      });
      // Clear key upon success
      setRetryCommandKey(null);
      onRefresh?.();
    } catch (err: unknown) {
      const apiErr = getApiError(err);
      setActionError(apiErr.message || "Không thể thử lại trích xuất AI. Vui lòng thử lại.");
    }
  };

  // 1. Application is not shortlisted -> Read-only notice
  if (!isShortlisted) {
    return (
      <Card className={cn("border-amber-500/30 bg-amber-500/5 text-xs", className)}>
        <CardContent className="p-3.5 flex items-center gap-3">
          <Lock className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="space-y-0.5 min-w-0">
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              Hồ sơ ứng tuyển đang ở chế độ Chỉ đọc (Read-only)
            </p>
            <p className="text-muted-foreground text-[11px]">
              Các thao tác trích xuất AI, chỉnh sửa và phê duyệt profile chỉ được thực hiện khi hồ sơ ở trạng thái Sơ loại (shortlisted).
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 2. Profile already approved -> Immutable notice
  if (isApproved) {
    return (
      <Card className={cn("border-emerald-500/30 bg-emerald-500/5 text-xs", className)}>
        <CardContent className="p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                Hồ sơ đã được phê duyệt chính thức
              </p>
              <p className="text-muted-foreground text-[11px]">
                Profile trích xuất của phiên bản CV này đã khóa chỉnh sửa và sẵn sàng để tạo Bộ câu hỏi phỏng vấn (Question Sets).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 3. Extraction processing
  if (isProcessing) {
    return (
      <Card className={cn("border-sky-500/30 bg-sky-500/5 text-xs", className)}>
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Loader2 className="size-5 text-sky-600 dark:text-sky-400 animate-spin shrink-0" />
            <div className="space-y-0.5 min-w-0">
              <p className="font-semibold text-sky-800 dark:text-sky-300">
                AI đang tiến hành phân tích và trích xuất hồ sơ...
              </p>
              <p className="text-muted-foreground text-[11px]">
                Hệ thống đang đọc cấu trúc tài liệu PDF và phân loại kỹ năng, kinh nghiệm, dự án theo tiêu chuẩn profile.v1.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-8 text-xs gap-1.5 shrink-0"
          >
            <RefreshCw className="size-3" />
            <span>Làm mới</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 4. Extraction pending
  if (cv.extractionStatus === "pending") {
    return (
      <Card className={cn("border-border text-xs bg-card", className)}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0">
                <p className="font-semibold text-foreground">
                  Tài liệu CV sẵn sàng để trích xuất dữ liệu
                </p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Bạn có thể sử dụng AI để tự động trích xuất các mục Kỹ năng, Kinh nghiệm, Dự án, Học vấn hoặc tự nhập thông tin hồ sơ thủ công.
                </p>
              </div>
            </div>

            {canUpdateProfile && (
              <div className="flex items-center gap-2 shrink-0">
                {onStartManualEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onStartManualEdit}
                    disabled={extractMutation.isPending}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Edit className="size-3.5" />
                    <span>Nhập thủ công</span>
                  </Button>
                )}

                <AsyncButton
                  size="sm"
                  onClick={handleExtract}
                  isPending={extractMutation.isPending}
                  loadingText="Đang trích xuất AI..."
                  className="h-8 text-xs gap-1.5"
                >
                  <Sparkles className="size-3.5" />
                  <span>Trích xuất bằng AI</span>
                </AsyncButton>
              </div>
            )}
          </div>

          {actionError && (
            <div className="p-2.5 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // 5. Extraction failed or needs_manual_input
  if (cv.extractionStatus === "failed" || cv.extractionStatus === "needs_manual_input") {
    const errInfo = getExtractionErrorInfo(cv.errorCode);

    return (
      <Card
        className={cn(
          "text-xs",
          cv.extractionStatus === "failed"
            ? "border-rose-500/30 bg-rose-500/5"
            : "border-amber-500/30 bg-amber-500/5",
          className,
        )}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              {cv.extractionStatus === "failed" ? (
                <AlertCircle className="size-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}

              <div className="space-y-1 min-w-0">
                <p
                  className={cn(
                    "font-semibold",
                    cv.extractionStatus === "failed"
                      ? "text-rose-800 dark:text-rose-300"
                      : "text-amber-800 dark:text-amber-300",
                  )}
                >
                  {errInfo.title}
                </p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {errInfo.message}
                </p>
                {errInfo.suggestion && (
                  <p className="text-foreground/80 font-medium text-[11px]">
                    👉 {errInfo.suggestion}
                  </p>
                )}
              </div>
            </div>

            {canUpdateProfile && (
              <div className="flex items-center gap-2 shrink-0">
                {onStartManualEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onStartManualEdit}
                    disabled={retryMutation.isPending}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Edit className="size-3.5" />
                    <span>Nhập thủ công</span>
                  </Button>
                )}

                <AsyncButton
                  size="sm"
                  onClick={handleRetry}
                  isPending={retryMutation.isPending}
                  loadingText="Đang thử lại..."
                  variant="outline"
                  className="h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Thử lại trích xuất</span>
                </AsyncButton>
              </div>
            )}
          </div>

          {actionError && (
            <div className="p-2.5 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // 6. Extraction ready
  return (
    <Card className={cn("border-emerald-500/20 bg-emerald-500/[0.03] text-xs", className)}>
      <CardContent className="p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-emerald-800 dark:text-emerald-300">
              Đã trích xuất cấu trúc hồ sơ thành công
            </p>
            <p className="text-muted-foreground text-[11px]">
              Vui lòng kiểm tra, đối chiếu các thông tin và bằng chứng trích dẫn với bản PDF bên cạnh trước khi phê duyệt.
            </p>
          </div>
        </div>

        {canUpdateProfile && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExtract}
              disabled={extractMutation.isPending}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
              title="Chạy lại trích xuất AI nếu cần làm mới"
            >
              <RefreshCw className={cn("size-3", extractMutation.isPending && "animate-spin")} />
              <span className="hidden sm:inline">Trích xuất lại</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

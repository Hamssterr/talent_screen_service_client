"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AsyncButton } from "@/components/shared/async-button";
import { CvVersionDetail } from "../types/cv.types";
import { useApproveCvProfileMutation } from "../hooks/use-approve-cv-profile-mutation";
import { getApiError } from "@/lib/api/api-error";

export interface ApproveProfileDialogProps {
  cv: CvVersionDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ApproveProfileDialog({
  cv,
  open,
  onOpenChange,
  onSuccess,
}: ApproveProfileDialogProps) {
  const [error, setError] = React.useState<string | null>(null);

  const approveMutation = useApproveCvProfileMutation();

  const handleApprove = async () => {
    setError(null);
    try {
      await approveMutation.mutateAsync({
        id: cv.id,
        applicationId: cv.applicationId,
        data: {
          expectedProfileVersion: cv.profileVersion,
        },
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const apiErr = getApiError(err);
      setError(apiErr.message || "Không thể phê duyệt hồ sơ. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
            <DialogTitle>Xác nhận Phê duyệt Hồ sơ CV</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Phê duyệt thông tin trích xuất của phiên bản CV này để sử dụng cho các bước tiếp theo trong quy trình tuyển dụng.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="p-3 rounded-lg bg-muted/40 border space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tệp tài liệu:</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]" title={cv.originalFilename}>
                {cv.originalFilename}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phiên bản CV:</span>
              <span className="font-mono font-semibold text-foreground">v{cv.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phiên bản Profile (OCC):</span>
              <span className="font-mono font-semibold text-foreground">v{cv.profileVersion}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-xs">
              <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Lưu ý quan trọng:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Sau khi phê duyệt, hồ sơ trích xuất (profile.v1) sẽ chuyển sang trạng thái <strong>Khóa (Immutable)</strong> và không thể chỉnh sửa thêm. Hồ sơ được duyệt sẽ được sử dụng trực tiếp để sinh Bộ câu hỏi phỏng vấn (Question Sets).
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={approveMutation.isPending}
            className="h-8 text-xs"
          >
            Hủy bỏ
          </Button>

          <AsyncButton
            size="sm"
            onClick={handleApprove}
            isPending={approveMutation.isPending}
            loadingText="Đang phê duyệt..."
            className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle2 className="size-3.5" />
            <span>Xác nhận duyệt</span>
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

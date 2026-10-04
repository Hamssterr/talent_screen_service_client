"use client";

import * as React from "react";
import { Trash2, AlertTriangle, AlertCircle } from "lucide-react";
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
import { CvVersionDetail, CvVersionSafe } from "../types/cv.types";
import { useDeleteCvVersionMutation } from "../hooks/use-delete-cv-version-mutation";
import { getApiError } from "@/lib/api/api-error";

export interface DeleteCvDialogProps {
  cv: CvVersionSafe | CvVersionDetail;
  isCurrent?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteCvDialog({
  cv,
  isCurrent = false,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCvDialogProps) {
  const [error, setError] = React.useState<string | null>(null);

  const deleteMutation = useDeleteCvVersionMutation();

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteMutation.mutateAsync({
        id: cv.id,
        applicationId: cv.applicationId,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const apiErr = getApiError(err);
      setError(apiErr.message || "Không thể xóa phiên bản CV này. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-5" />
            <DialogTitle>Xóa phiên bản CV</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Thao tác này sẽ xóa mềm phiên bản CV khỏi hồ sơ ứng tuyển (chỉ dành cho Quản trị viên).
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
              <span className="text-muted-foreground">Phiên bản:</span>
              <span className="font-mono font-semibold text-foreground">v{cv.version}</span>
            </div>
          </div>

          {isCurrent && (
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Cảnh báo phiên bản hiện tại:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Bạn đang xóa phiên bản CV hiện tại của hồ sơ này. Sau khi xóa, con trỏ CV hiện tại sẽ tự động chuyển về phiên bản hoạt động mới nhất trước đó (nếu còn).
              </p>
            </div>
          )}

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
            disabled={deleteMutation.isPending}
            className="h-8 text-xs"
          >
            Hủy
          </Button>

          <AsyncButton
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            isPending={deleteMutation.isPending}
            loadingText="Đang xóa..."
            className="h-8 text-xs gap-1.5"
          >
            <Trash2 className="size-3.5" />
            <span>Xác nhận xóa</span>
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

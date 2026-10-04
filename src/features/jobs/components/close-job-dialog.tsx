"use client";

import * as React from "react";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { useCloseJobMutation } from "../hooks/use-close-job-mutation";
import { Job } from "../types/job.types";

export interface CloseJobDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CloseJobDialog({
  job,
  open,
  onOpenChange,
  onSuccess,
}: CloseJobDialogProps) {
  const closeMutation = useCloseJobMutation();

  if (!job) return null;

  return (
    <ConfirmActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Đóng vị trí tuyển dụng "${job.title}"?`}
      description="Khi đóng vị trí này, hệ thống sẽ dừng tiếp nhận hồ sơ ứng tuyển mới. Vị trí đã đóng sẽ không thể mở lại hay chuyển về bản nháp."
      confirmLabel="Đóng tuyển dụng"
      cancelLabel="Hủy"
      variant="destructive"
      isPending={closeMutation.isPending}
      onConfirm={async () => {
        await closeMutation.mutateAsync(
          {
            id: job.id,
            data: {
              expectedVersion: job.version,
            },
          },
          {
            onSuccess: () => {
              onOpenChange(false);
              onSuccess?.();
            },
          },
        );
      }}
    />
  );
}

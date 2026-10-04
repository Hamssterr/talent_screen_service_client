"use client";

import * as React from "react";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { useDeleteJobMutation } from "../hooks/use-delete-job-mutation";
import { Job } from "../types/job.types";

export interface DeleteJobDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteJobDialog({
  job,
  open,
  onOpenChange,
  onSuccess,
}: DeleteJobDialogProps) {
  const deleteMutation = useDeleteJobMutation();

  if (!job) return null;

  return (
    <ConfirmActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Xóa vị trí tuyển dụng "${job.title}"?`}
      description="Thao tác này chỉ dành cho Quản trị viên (Admin). Vị trí tuyển dụng sẽ được đánh dấu đã xóa (soft-delete) trong hệ thống."
      confirmLabel="Xóa vị trí"
      cancelLabel="Hủy"
      variant="destructive"
      isPending={deleteMutation.isPending}
      onConfirm={async () => {
        await deleteMutation.mutateAsync(job.id, {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        });
      }}
    />
  );
}

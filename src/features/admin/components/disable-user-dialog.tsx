"use client";

import * as React from "react";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { useDisableUserMutation } from "../hooks/use-admin-users";

export interface DisableUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

export function DisableUserDialog({
  open,
  onOpenChange,
  userId,
  userName,
}: DisableUserDialogProps) {
  const disableMutation = useDisableUserMutation();

  return (
    <ConfirmActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Vô hiệu hóa tài khoản ${userName}?`}
      description="Người dùng này sẽ bị chấm dứt phiên đăng nhập ngay lập tức và không thể truy cập vào hệ thống cho đến khi được kích hoạt lại."
      confirmLabel="Vô hiệu hóa tài khoản"
      cancelLabel="Hủy"
      variant="destructive"
      isPending={disableMutation.isPending}
      onConfirm={async () => {
        await disableMutation.mutateAsync(userId);
        onOpenChange(false);
      }}
    />
  );
}

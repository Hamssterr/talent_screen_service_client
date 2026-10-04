"use client";

import * as React from "react";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { useResendInvitationMutation } from "../hooks/use-admin-users";

export interface ResendInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
}

export function ResendInvitationDialog({
  open,
  onOpenChange,
  userId,
  userEmail,
}: ResendInvitationDialogProps) {
  const resendMutation = useResendInvitationMutation();

  return (
    <ConfirmActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Gửi lại email kích hoạt tài khoản"
      description={`Hệ thống sẽ tạo mã kích hoạt mới và gửi đến hòm thư ${userEmail}. Bạn có muốn tiếp tục?`}
      confirmLabel="Gửi lại email"
      cancelLabel="Hủy"
      isPending={resendMutation.isPending}
      onConfirm={async () => {
        await resendMutation.mutateAsync(userId);
        onOpenChange(false);
      }}
    />
  );
}

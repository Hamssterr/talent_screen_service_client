"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AsyncButton } from "@/components/shared/async-button";
import { withdrawApplicationSchema, WithdrawApplicationFormData } from "../schemas/application.schema";
import { useWithdrawApplicationMutation } from "../hooks/use-withdraw-application-mutation";
import { Application } from "../types/application.types";
import { getApiError } from "@/lib/api/api-error";

export interface WithdrawApplicationDialogProps {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (app: Application) => void;
}

export function WithdrawApplicationDialog({
  application,
  open,
  onOpenChange,
  onSuccess,
}: WithdrawApplicationDialogProps) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const withdrawMutation = useWithdrawApplicationMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawApplicationFormData>({
    resolver: zodResolver(withdrawApplicationSchema),
    defaultValues: {
      expectedVersion: application.version,
      reason: "",
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setErrorMessage(null);
      reset({
        expectedVersion: application.version,
        reason: "",
      });
    }
    onOpenChange(isOpen);
  };

  const onSubmit = async (data: WithdrawApplicationFormData) => {
    setErrorMessage(null);

    try {
      const updated = await withdrawMutation.mutateAsync({
        id: application.id,
        data: {
          expectedVersion: application.version,
          reason: data.reason || undefined,
        },
      });

      onSuccess?.(updated);
      handleOpenChange(false);
    } catch (err) {
      const apiErr = getApiError(err);
      if (apiErr.code === "VERSION_CONFLICT") {
        setErrorMessage(
          "Phiên bản dữ liệu không khớp (đã có thay đổi từ người dùng khác). Vui lòng tải lại trang.",
        );
      } else if (apiErr.code === "APPLICATION_STATE_CONFLICT" || apiErr.code === "APPLICATION_TERMINAL") {
        setErrorMessage(
          "Hồ sơ đã kết thúc hoặc không ở trạng thái cho phép rút hồ sơ.",
        );
      } else {
        setErrorMessage(apiErr.message || "Không thể rút hồ sơ ứng tuyển.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
            <Lock className="size-5" />
            <DialogTitle className="text-lg font-semibold">Rút hồ sơ ứng tuyển</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Hồ sơ sẽ được chuyển sang trạng thái <span className="font-semibold text-foreground">Đã rút hồ sơ (Withdrawn)</span>. Thao tác này là cuối cùng và không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs flex items-start gap-2 text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="withdraw-reason" className="text-xs font-medium">
              Lý do rút hồ sơ <span className="text-muted-foreground font-normal">(tùy chọn)</span>
            </Label>
            <Textarea
              id="withdraw-reason"
              rows={3}
              placeholder="VD: Ứng viên nhận offer công ty khác, từ chối tham gia phỏng vấn..."
              {...register("reason")}
              aria-invalid={Boolean(errors.reason)}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              disabled={withdrawMutation.isPending}
            >
              Hủy
            </Button>
            <AsyncButton
              type="submit"
              variant="destructive"
              size="sm"
              isPending={withdrawMutation.isPending}
              loadingText="Đang xử lý..."
            >
              <Lock className="mr-1.5 size-3.5" />
              Xác nhận rút hồ sơ
            </AsyncButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

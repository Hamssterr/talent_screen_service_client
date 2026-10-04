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
import { useDeleteApplicationMutation } from "../hooks/use-delete-application-mutation";
import { Application } from "../types/application.types";
import { getApiError } from "@/lib/api/api-error";

export interface DeleteApplicationDialogProps {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteApplicationDialog({
  application,
  open,
  onOpenChange,
  onSuccess,
}: DeleteApplicationDialogProps) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const deleteMutation = useDeleteApplicationMutation();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setErrorMessage(null);
    }
    onOpenChange(isOpen);
  };

  const handleDelete = async () => {
    setErrorMessage(null);
    try {
      await deleteMutation.mutateAsync(application.id);
      onSuccess?.();
      handleOpenChange(false);
    } catch (err) {
      const apiErr = getApiError(err);
      setErrorMessage(apiErr.message || "Không thể xóa hồ sơ ứng tuyển.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="size-5" />
            <DialogTitle className="text-lg font-semibold">Xác nhận xóa Hồ sơ ứng tuyển</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Bạn có chắc chắn muốn xóa hồ sơ ứng tuyển của{" "}
            <span className="font-semibold text-foreground">
              {application.candidate?.fullName || "ứng viên"}
            </span>{" "}
            vào vị trí{" "}
            <span className="font-semibold text-foreground">
              {application.job?.title || "tuyển dụng"}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs flex items-start gap-2 text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Hủy
          </Button>
          <AsyncButton
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            isPending={deleteMutation.isPending}
            loadingText="Đang xóa..."
          >
            <Trash2 className="mr-1.5 size-4" />
            Xác nhận xóa
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

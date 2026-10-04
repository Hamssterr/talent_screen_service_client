"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AsyncButton } from "@/components/shared/async-button";
import { candidateFormSchema, CandidateFormData } from "../schemas/candidate.schema";
import { useCreateCandidateMutation } from "../hooks/use-create-candidate-mutation";
import { candidatesApi } from "../api/candidates.api";
import { Candidate } from "../types/candidate.types";
import { getApiError } from "@/lib/api/api-error";

export interface QuickCreateCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCandidateCreated: (candidate: Candidate) => void;
  initialSearch?: string;
}

export function QuickCreateCandidateDialog({
  open,
  onOpenChange,
  onCandidateCreated,
  initialSearch = "",
}: QuickCreateCandidateDialogProps) {
  const [duplicateCandidateId, setDuplicateCandidateId] = React.useState<string | null>(null);
  const [isFetchingDuplicate, setIsFetchingDuplicate] = React.useState(false);
  const [duplicateError, setDuplicateError] = React.useState<string | null>(null);

  const createMutation = useCreateCandidateMutation();

  const isEmailSearch = initialSearch.includes("@");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      fullName: isEmailSearch ? "" : initialSearch,
      email: isEmailSearch ? initialSearch : "",
      phone: "",
      notes: "",
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setDuplicateCandidateId(null);
      setDuplicateError(null);
      reset();
    }
    onOpenChange(isOpen);
  };

  const onSubmit = async (data: CandidateFormData) => {
    setDuplicateCandidateId(null);
    setDuplicateError(null);

    try {
      const newCandidate = await createMutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || undefined,
        notes: data.notes || undefined,
      });

      onCandidateCreated(newCandidate);
      onOpenChange(false);
    } catch (err) {
      const apiErr = getApiError(err);
      if (apiErr.code === "CANDIDATE_ALREADY_EXISTS") {
        const details = apiErr.details as { candidateId?: string } | undefined;
        if (details?.candidateId) {
          setDuplicateCandidateId(details.candidateId);
        }
      }
    }
  };

  const handleSelectDuplicate = async () => {
    if (!duplicateCandidateId) return;
    setIsFetchingDuplicate(true);
    setDuplicateError(null);

    try {
      const existing = await candidatesApi.getCandidate(duplicateCandidateId);
      onCandidateCreated(existing);
      handleOpenChange(false);
    } catch (err) {
      const apiErr = getApiError(err);
      setDuplicateError(
        apiErr.status === 403 || apiErr.status === 404
          ? "Ứng viên này thuộc quản lý của tài khoản khác hoặc không thể truy cập."
          : apiErr.message || "Không thể tải thông tin ứng viên đã tồn tại.",
      );
    } finally {
      setIsFetchingDuplicate(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <UserPlus className="size-5" />
            <DialogTitle className="text-lg font-semibold">Tạo nhanh Ứng viên mới</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Nhập thông tin cơ bản của ứng viên để liên kết ngay vào hồ sơ ứng tuyển.
          </DialogDescription>
        </DialogHeader>

        {duplicateCandidateId && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-50/60 p-3.5 dark:bg-amber-950/20 text-xs space-y-2">
            <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300 font-medium">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>Ứng viên với email này đã tồn tại trong hệ thống.</span>
            </div>
            {duplicateError ? (
              <p className="text-destructive text-xs">{duplicateError}</p>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleSelectDuplicate}
                disabled={isFetchingDuplicate}
                className="w-full text-xs h-8 gap-1.5 border-amber-500/40 text-amber-900 dark:text-amber-200"
              >
                <CheckCircle2 className="size-3.5" />
                <span>{isFetchingDuplicate ? "Đang chọn..." : "Chọn ứng viên đã tồn tại này"}</span>
              </Button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full name */}
          <div className="space-y-1.5">
            <Label htmlFor="qc-fullName" className="text-xs font-medium">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qc-fullName"
              placeholder="Nguyễn Văn An"
              {...register("fullName")}
              aria-invalid={Boolean(errors.fullName)}
              className="h-9 text-xs"
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="qc-email" className="text-xs font-medium">
              Địa chỉ Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qc-email"
              type="email"
              placeholder="an.nguyen@example.com"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
              className="h-9 text-xs"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="qc-phone" className="text-xs font-medium">
              Số điện thoại <span className="text-muted-foreground font-normal">(tùy chọn)</span>
            </Label>
            <Input
              id="qc-phone"
              placeholder="0901234567"
              {...register("phone")}
              aria-invalid={Boolean(errors.phone)}
              className="h-9 text-xs"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="qc-notes" className="text-xs font-medium">
              Ghi chú ban đầu <span className="text-muted-foreground font-normal">(tùy chọn)</span>
            </Label>
            <Textarea
              id="qc-notes"
              rows={2}
              placeholder="Nguồn ứng viên, ghi chú sơ bộ..."
              {...register("notes")}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Hủy
            </Button>
            <AsyncButton
              type="submit"
              size="sm"
              isPending={createMutation.isPending}
              loadingText="Đang lưu..."
            >
              Tạo và chọn
            </AsyncButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

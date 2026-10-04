"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, ArrowLeft, AlertCircle, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AsyncButton } from "@/components/shared/async-button";
import { candidateFormSchema, CandidateFormData } from "../schemas/candidate.schema";
import { useCreateCandidateMutation } from "../hooks/use-create-candidate-mutation";
import { useUpdateCandidateMutation } from "../hooks/use-update-candidate-mutation";
import { Candidate } from "../types/candidate.types";
import { getApiError } from "@/lib/api/api-error";
import { cn } from "@/lib/utils";

export interface CandidateFormProps {
  mode: "create" | "edit";
  candidate?: Candidate;
  onSuccess?: (candidate: Candidate) => void;
}

export function CandidateForm({ mode, candidate, onSuccess }: CandidateFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [existingCandidateId, setExistingCandidateId] = React.useState<string | null>(null);

  const createMutation = useCreateCandidateMutation();
  const updateMutation = useUpdateCandidateMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      fullName: candidate?.fullName || "",
      email: candidate?.email || "",
      phone: candidate?.phone || "",
      notes: candidate?.notes || "",
    },
  });

  const onSubmit = async (data: CandidateFormData) => {
    setExistingCandidateId(null);

    try {
      if (isEdit && candidate) {
        const updated = await updateMutation.mutateAsync({
          id: candidate.id,
          data: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone || undefined,
            notes: data.notes || undefined,
          },
        });
        if (onSuccess) {
          onSuccess(updated);
        } else {
          router.push(`/candidates/${updated.id}`);
        }
      } else {
        const created = await createMutation.mutateAsync({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || undefined,
          notes: data.notes || undefined,
        });
        if (onSuccess) {
          onSuccess(created);
        } else {
          router.push(`/candidates/${created.id}`);
        }
      }
    } catch (err) {
      const apiErr = getApiError(err);
      if (apiErr.code === "CANDIDATE_ALREADY_EXISTS") {
        const details = apiErr.details as { candidateId?: string } | undefined;
        if (details?.candidateId) {
          setExistingCandidateId(details.candidateId);
        }
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top action / back link */}
      <div className="flex items-center justify-between">
        <Link
          href={isEdit && candidate ? `/candidates/${candidate.id}` : "/candidates"}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground hover:text-foreground gap-1.5",
          )}
        >
          <ArrowLeft className="size-4" />
          <span>{isEdit ? "Quay lại chi tiết" : "Danh sách ứng viên"}</span>
        </Link>
      </div>

      {existingCandidateId && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-50/60 p-4 dark:bg-amber-950/20 text-xs space-y-2">
          <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300 font-medium">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>Ứng viên với email này đã tồn tại trong hệ thống.</span>
          </div>
          <p className="text-muted-foreground">
            Bạn có thể mở hồ sơ ứng viên đã có để xem chi tiết hoặc nộp hồ sơ ứng tuyển vào vị trí mới.
          </p>
          <div className="pt-1">
            <Link
              href={`/candidates/${existingCandidateId}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "text-xs h-8 gap-1.5 border-amber-500/40 text-amber-900 dark:text-amber-200",
              )}
            >
              <ExternalLink className="size-3.5" />
              <span>Mở hồ sơ ứng viên đã tồn tại</span>
            </Link>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 text-primary mb-1">
            <User className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isEdit ? "Chỉnh sửa thông tin" : "Hồ sơ ứng viên mới"}
            </span>
          </div>
          <CardTitle className="text-xl font-bold">
            {isEdit ? `Cập nhật: ${candidate?.fullName}` : "Tạo Ứng viên mới"}
          </CardTitle>
          <CardDescription className="text-xs">
            Thông tin ứng viên độc lập với vị trí tuyển dụng và hồ sơ CV.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-medium">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="VD: Nguyễn Văn An"
                {...register("fullName")}
                aria-invalid={Boolean(errors.fullName)}
                className="h-9 text-xs"
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">
                  Địa chỉ Email <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="an.nguyen@example.com"
                    {...register("email")}
                    aria-invalid={Boolean(errors.email)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium">
                  Số điện thoại <span className="text-muted-foreground font-normal">(tùy chọn)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="phone"
                    placeholder="0901234567"
                    {...register("phone")}
                    aria-invalid={Boolean(errors.phone)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-medium">
                Ghi chú nội bộ <span className="text-muted-foreground font-normal">(tùy chọn)</span>
              </Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Ghi chú về nguồn ứng viên, kinh nghiệm sơ bộ, thông tin liên hệ phụ..."
                {...register("notes")}
                className="text-xs resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Hủy
              </Button>
              <AsyncButton
                type="submit"
                size="sm"
                isPending={isPending}
                loadingText={isEdit ? "Đang cập nhật..." : "Đang tạo..."}
                disabled={isEdit && !isDirty}
              >
                {isEdit ? "Lưu thay đổi" : "Tạo ứng viên"}
              </AsyncButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus, ArrowLeft, AlertCircle, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AsyncButton } from "@/components/shared/async-button";
import { CandidateCombobox } from "@/features/candidates/components/candidate-combobox";
import { JobSelect } from "./job-select";
import {
  createApplicationSchema,
  CreateApplicationFormData,
} from "../schemas/application.schema";
import { useCreateApplicationMutation } from "../hooks/use-create-application-mutation";
import { getApiError } from "@/lib/api/api-error";
import { cn } from "@/lib/utils";

export interface ApplicationFormProps {
  initialCandidateId?: string;
  initialJobId?: string;
}

export function ApplicationForm({
  initialCandidateId,
  initialJobId,
}: ApplicationFormProps) {
  const router = useRouter();

  // Active command state for Idempotency-Key lifecycle
  const [activeCommand, setActiveCommand] = React.useState<{
    idempotencyKey: string;
    payloadString: string;
  } | null>(null);

  const [existingApplicationId, setExistingApplicationId] = React.useState<
    string | null
  >(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const createMutation = useCreateApplicationMutation();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateApplicationFormData>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      candidateId: initialCandidateId || "",
      jobId: initialJobId || "",
      notes: "",
    },
  });

  const onSubmit = async (data: CreateApplicationFormData) => {
    setExistingApplicationId(null);
    setSubmitError(null);

    const payloadString = JSON.stringify({
      candidateId: data.candidateId,
      jobId: data.jobId,
      notes: data.notes?.trim() || "",
    });

    // Reuse idempotencyKey if payload is identical to previous failed attempt, else generate new
    let key = activeCommand?.idempotencyKey;
    if (!key || activeCommand?.payloadString !== payloadString) {
      key = crypto.randomUUID();
      setActiveCommand({ idempotencyKey: key, payloadString });
    }

    try {
      const newApp = await createMutation.mutateAsync({
        data: {
          candidateId: data.candidateId,
          jobId: data.jobId,
          notes: data.notes || undefined,
        },
        idempotencyKey: key,
      });

      // Clear active command on success and navigate to Workspace
      setActiveCommand(null);
      router.push(`/applications/${newApp.id}/overview`);
    } catch (err) {
      const apiErr = getApiError(err);

      if (apiErr.code === "APPLICATION_ALREADY_EXISTS") {
        const details = apiErr.details as
          | { applicationId?: string }
          | undefined;
        if (details?.applicationId) {
          setExistingApplicationId(details.applicationId);
        } else {
          setSubmitError(
            apiErr.message || "Ứng viên này đã nộp hồ sơ vào vị trí này.",
          );
        }
      } else if (apiErr.code === "JOB_NOT_ACCEPTING_APPLICATIONS") {
        setSubmitError(
          "Vị trí tuyển dụng này hiện đã đóng hoặc không còn nhận hồ sơ.",
        );
      } else if (apiErr.code === "IDEMPOTENCY_KEY_REUSED") {
        // Reset command key so next retry generates fresh key
        setActiveCommand(null);
        setSubmitError(
          "Yêu cầu bị trùng lặp khóa Idempotency. Vui lòng bấm gửi lại.",
        );
      } else {
        setSubmitError(
          apiErr.message || "Đã có lỗi xảy ra khi tạo hồ sơ ứng tuyển.",
        );
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/applications"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground hover:text-foreground gap-1.5",
          )}>
          <ArrowLeft className="size-4" />
          <span>Danh sách hồ sơ</span>
        </Link>
      </div>

      {/* Duplicate conflict alert */}
      {existingApplicationId && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-50/60 p-4 dark:bg-amber-950/20 text-xs space-y-2.5">
          <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300 font-medium">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>
              Ứng viên này đã được nộp hồ sơ vào vị trí tuyển dụng này từ trước.
            </span>
          </div>
          <p className="text-muted-foreground">
            Hệ thống không cho phép tạo trùng lặp một hồ sơ ứng tuyển cho cùng
            một ứng viên và vị trí. Bạn có thể mở trực tiếp Application hiện tại
            để tiếp tục quy trình.
          </p>
          <div className="pt-1">
            <Link
              href={`/applications/${existingApplicationId}/overview`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "text-xs h-8 gap-1.5 border-amber-500/40 text-amber-900 dark:text-amber-200",
              )}>
              <ExternalLink className="size-3.5" />
              <span>Mở Workspace của hồ sơ hiện tại</span>
            </Link>
          </div>
        </div>
      )}

      {/* Generic error alert */}
      {submitError && !existingApplicationId && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-xs flex items-start gap-2 text-destructive">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <Card>
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 text-primary mb-1">
            <FilePlus className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Nộp hồ sơ mới
            </span>
          </div>
          <CardTitle className="text-xl font-bold">
            Tạo Hồ sơ Ứng tuyển (Application)
          </CardTitle>
          <CardDescription className="text-xs">
            Liên kết một Ứng viên (Candidate) với một Vị trí Tuyển dụng (Job)
            đang mở để bắt đầu quy trình sàng lọc và phỏng vấn.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Candidate Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Ứng viên <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="candidateId"
                render={({ field }) => (
                  <CandidateCombobox
                    value={field.value}
                    onChange={(val) => field.onChange(val || "")}
                    disabled={createMutation.isPending}
                    error={errors.candidateId?.message}
                  />
                )}
              />
            </div>

            {/* Job Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Vị trí tuyển dụng <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="jobId"
                render={({ field }) => (
                  <JobSelect
                    value={field.value}
                    onChange={field.onChange}
                    disabled={createMutation.isPending}
                    error={errors.jobId?.message}
                  />
                )}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="app-notes" className="text-xs font-medium">
                Ghi chú ban đầu{" "}
                <span className="text-muted-foreground font-normal">
                  (tùy chọn)
                </span>
              </Label>
              <Textarea
                id="app-notes"
                rows={3}
                placeholder="VD: Ứng viên được giới thiệu bởi Tech Lead, đánh giá cao kinh nghiệm Backend..."
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
                disabled={createMutation.isPending}>
                Hủy
              </Button>
              <AsyncButton
                type="submit"
                size="sm"
                isPending={createMutation.isPending}
                loadingText="Đang tạo hồ sơ...">
                Tạo hồ sơ và mở Workspace
              </AsyncButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

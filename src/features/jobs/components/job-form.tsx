"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ConflictAlert } from "@/components/feedback/conflict-alert";
import { AsyncButton } from "@/components/shared/async-button";
import { RequiredSkillsInput } from "./required-skills-input";
import { EvaluationCriteriaEditor } from "./evaluation-criteria-editor";
import { useCreateJobMutation } from "../hooks/use-create-job-mutation";
import { useUpdateJobMutation } from "../hooks/use-update-job-mutation";
import { jobFormSchema, JobFormData } from "../schemas/job.schema";
import {
  formValuesToCreateInput,
  formValuesToUpdateInput,
  jobToFormValues,
} from "../utils/job-form-mapper";
import { Job, JobFormValues } from "../types/job.types";
import { Briefcase, FileText, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";

export interface JobFormProps {
  mode: "create" | "edit";
  job?: Job;
  onReload?: () => void;
}

export function JobForm({ mode, job, onReload }: JobFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [hasVersionConflict, setHasVersionConflict] = React.useState(false);

  const createMutation = useCreateJobMutation();
  const updateMutation = useUpdateJobMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const defaultValues: JobFormValues = React.useMemo(() => {
    if (isEdit && job) {
      return jobToFormValues(job);
    }
    return {
      title: "",
      description: "",
      requiredSkills: [],
      evaluationCriteria: [],
      status: "draft",
    };
  }, [isEdit, job]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  // Re-sync form default values if incoming job updates (e.g. after conflict reload)
  React.useEffect(() => {
    if (isEdit && job) {
      reset(jobToFormValues(job));
    }
  }, [isEdit, job, reset]);

  const onSubmit = async (data: JobFormData) => {
    setHasVersionConflict(false);

    if (isEdit && job) {
      const updateInput = formValuesToUpdateInput(
        data as JobFormValues,
        job.version,
      );

      await updateMutation.mutateAsync(
        { id: job.id, data: updateInput },
        {
          onSuccess: (updated) => {
            router.push(`/jobs/${updated.id}`);
          },
          onError: (error) => {
            if (
              error.message?.includes("Phiên bản dữ liệu không khớp") ||
              error.message?.includes("VERSION_CONFLICT")
            ) {
              setHasVersionConflict(true);
            }
          },
        },
      );
    } else {
      const createInput = formValuesToCreateInput(data as JobFormValues);

      await createMutation.mutateAsync(createInput, {
        onSuccess: (created) => {
          router.push(`/jobs/${created.id}`);
        },
      });
    }
  };

  const isInitialOpen = isEdit && job?.status === "open";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Version conflict warning banner */}
      {hasVersionConflict && (
        <ConflictAlert
          title="Xung đột phiên bản dữ liệu (Version Conflict)"
          message="Vị trí tuyển dụng này vừa được cập nhật bởi người dùng hoặc quy trình khác. Vui lòng tải lại dữ liệu mới nhất trước khi chỉnh sửa tiếp để tránh ghi đè thông tin."
          onReload={() => {
            onReload?.();
            setHasVersionConflict(false);
          }}
        />
      )}

      {/* Main Info Card */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Briefcase className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Thông tin chung
            </span>
          </div>
          <CardTitle className="text-base font-semibold">
            {isEdit ? "Cập nhật vị trí tuyển dụng" : "Tạo vị trí tuyển dụng mới"}
          </CardTitle>
          <CardDescription className="text-xs">
            Điền tiêu đề và bản mô tả chi tiết của vị trí công việc.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="job-title" className="text-xs font-semibold">
              Tiêu đề vị trí tuyển dụng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="job-title"
              placeholder="e.g. Senior Backend NestJS Developer"
              disabled={isPending}
              {...register("title")}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="size-3" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="job-status" className="text-xs font-semibold">
              Trạng thái tuyển dụng <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger id="job-status" className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="draft"
                      disabled={isInitialOpen}
                    >
                      Bản nháp (Draft)
                    </SelectItem>
                    <SelectItem value="open">
                      Đang mở tuyển (Open)
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {isInitialOpen && (
              <p className="text-[11px] text-muted-foreground italic">
                * Vị trí đang ở trạng thái Open không thể chuyển về Draft theo quy tắc nghiệp vụ.
              </p>
            )}
            {errors.status && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="size-3" />
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="job-description" className="text-xs font-semibold">
              Mô tả công việc & Yêu cầu chi tiết (JD) <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="job-description"
              placeholder="Nhập thông tin trách nhiệm công việc, yêu cầu kinh nghiệm, chế độ đãi ngộ..."
              disabled={isPending}
              rows={8}
              {...register("description")}
              aria-invalid={Boolean(errors.description)}
              className="leading-relaxed"
            />
            {errors.description && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="size-3" />
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Required Skills Card */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Sparkles className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Bộ kỹ năng yêu cầu
            </span>
          </div>
          <CardTitle className="text-base font-semibold">
            Kỹ năng chuyên môn (Required Skills)
          </CardTitle>
          <CardDescription className="text-xs">
            Các từ khóa kỹ năng sẽ được hệ thống sử dụng làm căn cứ đối chiếu CV và trích xuất năng lực ứng viên.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Controller
            name="requiredSkills"
            control={control}
            render={({ field }) => (
              <RequiredSkillsInput
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
                error={errors.requiredSkills?.message}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Evaluation Criteria Card */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 text-primary mb-1">
            <FileText className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Khung năng lực & Đánh giá
            </span>
          </div>
          <CardTitle className="text-base font-semibold">
            Tiêu chí đánh giá chung (Rubric)
          </CardTitle>
          <CardDescription className="text-xs">
            Định nghĩa bộ câu hỏi và tiêu chuẩn đánh giá phỏng vấn dành cho hội đồng HR/Interviewer.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Controller
            name="evaluationCriteria"
            control={control}
            render={({ field }) => {
              const criteriaErrors: Record<
                string,
                { name?: string; description?: string }
              > = {};

              if (Array.isArray(errors.evaluationCriteria)) {
                errors.evaluationCriteria.forEach((itemErr, idx) => {
                  if (itemErr) {
                    criteriaErrors[idx.toString()] = {
                      name: itemErr.name?.message,
                      description: itemErr.description?.message,
                    };
                  }
                });
              }

              return (
                <EvaluationCriteriaEditor
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  errors={criteriaErrors}
                />
              );
            }}
          />
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          <span>Quay lại</span>
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => reset(defaultValues)}
            disabled={isPending || !isDirty}
            className="text-xs"
          >
            Khôi phục thay đổi
          </Button>

          <AsyncButton
            type="submit"
            isPending={isPending}
            loadingText={isEdit ? "Đang lưu..." : "Đang tạo..."}
          >
            {isEdit ? "Lưu thay đổi" : "Tạo vị trí tuyển dụng"}
          </AsyncButton>
        </div>
      </div>
    </form>
  );
}

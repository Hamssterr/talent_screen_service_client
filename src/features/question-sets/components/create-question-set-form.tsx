import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createQuestionSetSchema,
  CreateQuestionSetFormValues,
} from "../schemas/question-set.schema";
import { useCreateQuestionSetMutation } from "../hooks/use-create-question-set-mutation";
import { getQuestionErrorMessage } from "../utils/question-error-message";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, FileEdit, Globe, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateQuestionSetFormProps {
  applicationId: string;
  currentCvVersionId?: string;
  isPrerequisiteMet: boolean;
  className?: string;
}

export function CreateQuestionSetForm({
  applicationId,
  currentCvVersionId,
  isPrerequisiteMet,
  className,
}: CreateQuestionSetFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const createMutation = useCreateQuestionSetMutation();

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm<CreateQuestionSetFormValues>({
    resolver: zodResolver(createQuestionSetSchema),
    defaultValues: {
      mode: "ai",
      cvVersionId: currentCvVersionId,
      language: "vi",
      questionCount: 6,
    },
  });

  const currentMode = useWatch({ control, name: "mode" });
  const currentLanguage = useWatch({ control, name: "language" });
  const currentCount = useWatch({ control, name: "questionCount" }) ?? 6;

  const onSubmit = async (values: CreateQuestionSetFormValues) => {
    setErrorMessage(null);
    try {
      const result = await createMutation.mutateAsync({
        applicationId,
        data: {
          mode: values.mode,
          cvVersionId: currentCvVersionId,
          language: values.language,
          questionCount: values.mode === "ai" ? Number(values.questionCount) : undefined,
        },
      });

      router.push(`/applications/${applicationId}/questions/${result.id}`);
    } catch (err) {
      setErrorMessage(getQuestionErrorMessage(err));
    }
  };

  return (
    <Card className={cn("border shadow-sm max-w-2xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Tạo Bộ câu hỏi Phỏng vấn mới</CardTitle>
        <CardDescription className="text-xs">
          Lựa chọn phương thức sinh câu hỏi phỏng vấn tối ưu hóa theo CV ứng viên và tiêu chí Job.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold">Phương thức khởi tạo</Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* AI Option */}
              <div
                onClick={() => setValue("mode", "ai")}
                className={cn(
                  "relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all",
                  currentMode === "ai"
                    ? "border-primary bg-primary/[0.03] shadow-xs"
                    : "border-border/70 hover:border-border bg-card",
                )}
              >
                <div className="flex items-center gap-2.5 text-primary mb-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-foreground block">
                      AI Gemini sinh tự động
                    </span>
                    <span className="text-[10px] text-primary font-medium">Khuyên dùng (Recommended)</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Tự động đối chiếu hồ sơ trích xuất CV và tiêu chí Rubric JD để tạo bộ câu hỏi sàng lọc chuyên sâu.
                </p>
              </div>

              {/* Manual Option */}
              <div
                onClick={() => setValue("mode", "manual")}
                className={cn(
                  "relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all",
                  currentMode === "manual"
                    ? "border-primary bg-primary/[0.03] shadow-xs"
                    : "border-border/70 hover:border-border bg-card",
                )}
              >
                <div className="flex items-center gap-2.5 text-foreground mb-2">
                  <div className="rounded-lg bg-muted p-2 text-foreground">
                    <FileEdit className="size-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-foreground block">
                      Tạo thủ công (Manual)
                    </span>
                    <span className="text-[10px] text-muted-foreground">Tự soạn thảo câu hỏi</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Tạo bản nháp trống để bạn tự nhập nội dung từng câu hỏi và gán tiêu chí mong muốn.
                </p>
              </div>
            </div>
          </div>

          {/* AI Settings (Count) */}
          {currentMode === "ai" && (
            <div className="p-4 rounded-xl bg-purple-500/[0.04] border border-purple-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="question-count" className="text-xs font-semibold text-purple-900 dark:text-purple-200">
                  Số lượng câu hỏi cần sinh (1 - 12 câu)
                </Label>
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 tabular-nums">
                  {currentCount} câu hỏi
                </span>
              </div>

              <input
                id="question-count"
                type="range"
                min="1"
                max="12"
                step="1"
                value={currentCount}
                onChange={(e) => setValue("questionCount", Number(e.target.value))}
                className="w-full h-2 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />

              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1 câu (Ngắn gọn)</span>
                <span>6 câu (Tiêu chuẩn)</span>
                <span>12 câu (Toàn diện)</span>
              </div>
            </div>
          )}

          {/* Language Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Globe className="size-3.5 text-muted-foreground" />
              <span>Ngôn ngữ bộ câu hỏi</span>
            </Label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("language", "vi")}
                className={cn(
                  "p-3 rounded-lg border text-left text-xs transition-colors",
                  currentLanguage === "vi"
                    ? "border-primary bg-primary/5 font-semibold text-foreground"
                    : "border-border text-muted-foreground hover:bg-muted/40",
                )}
              >
                Tiếng Việt (vi)
              </button>
              <button
                type="button"
                onClick={() => setValue("language", "en")}
                className={cn(
                  "p-3 rounded-lg border text-left text-xs transition-colors",
                  currentLanguage === "en"
                    ? "border-primary bg-primary/5 font-semibold text-foreground"
                    : "border-border text-muted-foreground hover:bg-muted/40",
                )}
              >
                Tiếng Anh (en)
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
              {errorMessage}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-4 bg-muted/10">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            disabled={createMutation.isPending}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={!isPrerequisiteMet || createMutation.isPending}
            className="gap-1.5 shadow-sm"
          >
            {createMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : currentMode === "ai" ? (
              <Sparkles className="size-3.5" />
            ) : (
              <ArrowRight className="size-3.5" />
            )}
            <span>
              {createMutation.isPending
                ? "Đang khởi tạo..."
                : currentMode === "ai"
                  ? "Bắt đầu sinh câu hỏi AI"
                  : "Tạo bản nháp thủ công"}
            </span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

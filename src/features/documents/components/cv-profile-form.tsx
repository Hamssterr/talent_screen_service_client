"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  Layers,
  Briefcase,
  FolderGit2,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AsyncButton } from "@/components/shared/async-button";
import { ConflictAlert } from "@/components/feedback/conflict-alert";
import { CvProfileV1, CvVersionDetail } from "../types/cv.types";
import { cvProfileV1Schema } from "../schemas/cv-profile.schema";
import { useUpdateCvProfileMutation } from "../hooks/use-update-cv-profile-mutation";
import { getApiError } from "@/lib/api/api-error";
import { cn } from "@/lib/utils";

export interface CvProfileFormProps {
  cv: CvVersionDetail;
  onSuccess?: () => void;
  onCancel?: () => void;
  onRefresh?: () => void;
  className?: string;
}

interface FormValues {
  schemaVersion: "profile.v1";
  summary: string;
  skills: Array<{
    name: string;
    page?: number;
    quote?: string;
  }>;
  experiences: Array<{
    role: string;
    organization: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    technologiesString: string;
    contribution: string;
    page?: number;
    quote?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  missingInformation: Array<{
    value: string;
  }>;
}

export function CvProfileForm({
  cv,
  onSuccess,
  onCancel,
  onRefresh,
  className,
}: CvProfileFormProps) {
  const [hasVersionConflict, setHasVersionConflict] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const updateMutation = useUpdateCvProfileMutation();

  const initialProfile = cv.profileJson;

  const defaultValues: FormValues = React.useMemo(() => {
    return {
      schemaVersion: "profile.v1" as const,
      summary: initialProfile?.summary || "",
      skills: (initialProfile?.skills || []).map((s) => ({
        name: s.name || "",
        page: s.evidence?.page,
        quote: s.evidence?.quote || "",
      })),
      experiences: (initialProfile?.experiences || []).map((e) => ({
        role: e.role || "",
        organization: e.organization || "",
        startDate: e.startDate || "",
        endDate: e.endDate || "",
        description: e.description || "",
      })),
      projects: (initialProfile?.projects || []).map((p) => ({
        name: p.name || "",
        technologiesString: (p.technologies || []).join(", "),
        contribution: p.contribution || "",
        page: p.evidence?.page,
        quote: p.evidence?.quote || "",
      })),
      education: (initialProfile?.education || []).map((ed) => ({
        institution: ed.institution || "",
        degree: ed.degree || "",
        field: ed.field || "",
        startDate: ed.startDate || "",
        endDate: ed.endDate || "",
      })),
      missingInformation: (initialProfile?.missingInformation || []).map((m) => ({
        value: m || "",
      })),
    };
  }, [initialProfile]);

  const {
    control,
    register,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues,
  });

  const skillsFieldArray = useFieldArray({ control, name: "skills" });
  const experiencesFieldArray = useFieldArray({ control, name: "experiences" });
  const projectsFieldArray = useFieldArray({ control, name: "projects" });
  const educationFieldArray = useFieldArray({ control, name: "education" });
  const missingInfoFieldArray = useFieldArray({ control, name: "missingInformation" });

  const onSubmit = async (values: FormValues) => {
    setHasVersionConflict(false);
    setSubmitError(null);

    // Transform form values to canonical CvProfileV1
    const canonicalProfile: CvProfileV1 = {
      schemaVersion: "profile.v1",
      summary: values.summary.trim() ? values.summary.trim() : null,
      skills: values.skills
        .filter((s) => s.name.trim().length > 0)
        .map((s) => ({
          name: s.name.trim(),
          evidence:
            s.page || s.quote?.trim()
              ? {
                  page: s.page ? Number(s.page) : undefined,
                  quote: s.quote?.trim() || undefined,
                }
              : undefined,
        })),
      experiences: values.experiences
        .filter((e) => e.role.trim().length > 0)
        .map((e) => ({
          role: e.role.trim(),
          organization: e.organization.trim() || null,
          startDate: e.startDate.trim() || null,
          endDate: e.endDate.trim() || null,
          description: e.description.trim() || null,
        })),
      projects: values.projects
        .filter((p) => p.name.trim().length > 0)
        .map((p) => ({
          name: p.name.trim(),
          technologies: p.technologiesString
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
            .slice(0, 30),
          contribution: p.contribution.trim() || null,
          evidence:
            p.page || p.quote?.trim()
              ? {
                  page: p.page ? Number(p.page) : undefined,
                  quote: p.quote?.trim() || undefined,
                }
              : undefined,
        })),
      education: values.education
        .filter((ed) => ed.institution.trim().length > 0 || ed.degree.trim().length > 0)
        .map((ed) => ({
          institution: ed.institution.trim() || null,
          degree: ed.degree.trim() || null,
          field: ed.field.trim() || null,
          startDate: ed.startDate.trim() || null,
          endDate: ed.endDate.trim() || null,
        })),
      missingInformation: values.missingInformation
        .map((m) => m.value.trim())
        .filter((m) => m.length > 0)
        .slice(0, 50),
    };

    // Client-side zod schema validation
    const parsed = cvProfileV1Schema.safeParse(canonicalProfile);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setSubmitError(issue ? `${issue.path.join(".")}: ${issue.message}` : "Dữ liệu hồ sơ không hợp lệ.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: cv.id,
        data: {
          expectedProfileVersion: cv.profileVersion,
          profile: canonicalProfile,
        },
      });
      onSuccess?.();
    } catch (err: unknown) {
      const apiErr = getApiError(err);
      if (apiErr.code === "VERSION_CONFLICT") {
        setHasVersionConflict(true);
      } else {
        setSubmitError(apiErr.message || "Không thể cập nhật hồ sơ. Vui lòng kiểm tra lại.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
      {/* Top Action Bar */}
      <Card className="sticky top-0 z-10 bg-card/95 backdrop-blur-xs border-primary/20 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span>Chỉnh sửa hồ sơ ứng viên (profile.v1)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Phiên bản hiện tại: <span className="font-mono font-semibold">v{cv.profileVersion}</span>
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={updateMutation.isPending}
                className="h-8 text-xs"
              >
                Hủy bỏ
              </Button>
            )}

            <AsyncButton
              type="submit"
              size="sm"
              isPending={updateMutation.isPending}
              loadingText="Đang lưu hồ sơ..."
              className="h-8 text-xs gap-1.5"
            >
              <Save className="size-3.5" />
              <span>Lưu hồ sơ</span>
            </AsyncButton>
          </div>
        </CardHeader>
      </Card>

      {/* Version conflict alert */}
      {hasVersionConflict && (
        <ConflictAlert
          title="Xung đột phiên bản dữ liệu (Version Conflict)"
          message="Hồ sơ CV này vừa được cập nhật bởi tiến trình hoặc người dùng khác trên máy chủ. Vui lòng làm mới trang để nhận phiên bản mới nhất."
          onReload={() => {
            onRefresh?.();
            setHasVersionConflict(false);
          }}
        />
      )}

      {/* Submit error */}
      {submitError && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* 1. Summary */}
      <Card>
        <CardHeader className="py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            <span>Tóm tắt chuyên môn (Summary)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <Textarea
            {...register("summary")}
            rows={3}
            placeholder="Tóm tắt tổng quan về hồ sơ, kinh nghiệm và năng lực chính của ứng viên..."
            className="text-xs resize-none"
          />
        </CardContent>
      </Card>

      {/* 2. Skills Dynamic Array */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            <span>Kỹ năng chuyên môn ({skillsFieldArray.fields.length})</span>
          </CardTitle>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => skillsFieldArray.append({ name: "", quote: "", page: undefined })}
            disabled={skillsFieldArray.fields.length >= 50}
            className="h-7 text-xs gap-1"
          >
            <Plus className="size-3" />
            <span>Thêm kỹ năng</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {skillsFieldArray.fields.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-2">
              Chưa có kỹ năng nào. Nhấn &quot;Thêm kỹ năng&quot; để bổ sung.
            </p>
          ) : (
            <div className="space-y-3">
              {skillsFieldArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 rounded-lg border bg-muted/20 text-xs space-y-2 relative"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        {...register(`skills.${index}.name` as const)}
                        placeholder="Tên kỹ năng (VD: React, NestJS, AWS...)"
                        className="h-8 text-xs font-medium"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => skillsFieldArray.remove(index)}
                      className="size-8 text-muted-foreground hover:text-destructive shrink-0"
                      title="Xóa kỹ năng"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 border-t border-border/40">
                    <div className="sm:col-span-1">
                      <Input
                        type="number"
                        {...register(`skills.${index}.page` as const, {
                          valueAsNumber: true,
                        })}
                        placeholder="Trang"
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        {...register(`skills.${index}.quote` as const)}
                        placeholder="Trích dẫn bằng chứng từ CV (tùy chọn)"
                        className="h-7 text-xs italic"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Experiences Dynamic Array */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Briefcase className="size-3.5 text-primary" />
            <span>Kinh nghiệm làm việc ({experiencesFieldArray.fields.length})</span>
          </CardTitle>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              experiencesFieldArray.append({
                role: "",
                organization: "",
                startDate: "",
                endDate: "",
                description: "",
              })
            }
            disabled={experiencesFieldArray.fields.length >= 30}
            className="h-7 text-xs gap-1"
          >
            <Plus className="size-3" />
            <span>Thêm kinh nghiệm</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {experiencesFieldArray.fields.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-2">
              Chưa có mục kinh nghiệm làm việc nào.
            </p>
          ) : (
            <div className="space-y-4">
              {experiencesFieldArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3.5 rounded-lg border bg-muted/20 text-xs space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground text-xs">
                      Kinh nghiệm #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => experiencesFieldArray.remove(index)}
                      className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Vị trí / Chức danh *</Label>
                      <Input
                        {...register(`experiences.${index}.role` as const)}
                        placeholder="VD: Senior Backend Engineer"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Công ty / Tổ chức</Label>
                      <Input
                        {...register(`experiences.${index}.organization` as const)}
                        placeholder="VD: Tech Corp Ltd"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Bắt đầu</Label>
                      <Input
                        {...register(`experiences.${index}.startDate` as const)}
                        placeholder="VD: 01/2021"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Kết thúc</Label>
                      <Input
                        {...register(`experiences.${index}.endDate` as const)}
                        placeholder="VD: Hiện tại hoặc 05/2024"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[11px] text-muted-foreground">Mô tả công việc</Label>
                    <Textarea
                      {...register(`experiences.${index}.description` as const)}
                      rows={2}
                      placeholder="Mô tả trách nhiệm chính và thành tựu..."
                      className="text-xs mt-1 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Projects Dynamic Array */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FolderGit2 className="size-3.5 text-primary" />
            <span>Dự án nổi bật ({projectsFieldArray.fields.length})</span>
          </CardTitle>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              projectsFieldArray.append({
                name: "",
                technologiesString: "",
                contribution: "",
                quote: "",
                page: undefined,
              })
            }
            disabled={projectsFieldArray.fields.length >= 30}
            className="h-7 text-xs gap-1"
          >
            <Plus className="size-3" />
            <span>Thêm dự án</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {projectsFieldArray.fields.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-2">
              Chưa có dự án nào.
            </p>
          ) : (
            <div className="space-y-4">
              {projectsFieldArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3.5 rounded-lg border bg-muted/20 text-xs space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground text-xs">
                      Dự án #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => projectsFieldArray.remove(index)}
                      className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Tên dự án *</Label>
                      <Input
                        {...register(`projects.${index}.name` as const)}
                        placeholder="VD: Hệ thống E-commerce"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Công nghệ sử dụng (phân cách bằng dấu phẩy)</Label>
                      <Input
                        {...register(`projects.${index}.technologiesString` as const)}
                        placeholder="VD: Next.js, Node.js, PostgreSQL"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[11px] text-muted-foreground">Đóng góp trong dự án</Label>
                    <Textarea
                      {...register(`projects.${index}.contribution` as const)}
                      rows={2}
                      placeholder="Mô tả vai trò và đóng góp cá nhân..."
                      className="text-xs mt-1 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Education Dynamic Array */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <GraduationCap className="size-3.5 text-primary" />
            <span>Học vấn & Bằng cấp ({educationFieldArray.fields.length})</span>
          </CardTitle>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              educationFieldArray.append({
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
              })
            }
            disabled={educationFieldArray.fields.length >= 20}
            className="h-7 text-xs gap-1"
          >
            <Plus className="size-3" />
            <span>Thêm học vấn</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {educationFieldArray.fields.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-2">
              Chưa có thông tin học vấn.
            </p>
          ) : (
            <div className="space-y-4">
              {educationFieldArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3.5 rounded-lg border bg-muted/20 text-xs space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground text-xs">
                      Học vấn #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => educationFieldArray.remove(index)}
                      className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Trường / Cơ sở đào tạo</Label>
                      <Input
                        {...register(`education.${index}.institution` as const)}
                        placeholder="VD: ĐH Bách Khoa"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Bằng cấp</Label>
                      <Input
                        {...register(`education.${index}.degree` as const)}
                        placeholder="VD: Cử nhân"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Chuyên ngành</Label>
                      <Input
                        {...register(`education.${index}.field` as const)}
                        placeholder="VD: Khoa học máy tính"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Bắt đầu</Label>
                      <Input
                        {...register(`education.${index}.startDate` as const)}
                        placeholder="VD: 2018"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Kết thúc</Label>
                      <Input
                        {...register(`education.${index}.endDate` as const)}
                        placeholder="VD: 2022"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Missing Information Dynamic Array */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="size-3.5 text-amber-600" />
            <span>Thông tin còn thiếu cần làm rõ ({missingInfoFieldArray.fields.length})</span>
          </CardTitle>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => missingInfoFieldArray.append({ value: "" })}
            disabled={missingInfoFieldArray.fields.length >= 50}
            className="h-7 text-xs gap-1"
          >
            <Plus className="size-3" />
            <span>Thêm mục</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {missingInfoFieldArray.fields.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-2">
              Chưa có mục thông tin còn thiếu nào.
            </p>
          ) : (
            <div className="space-y-2">
              {missingInfoFieldArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...register(`missingInformation.${index}.value` as const)}
                    placeholder="Nội dung cần ứng viên bổ sung/làm rõ trong phỏng vấn..."
                    className="h-8 text-xs flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => missingInfoFieldArray.remove(index)}
                    className="size-8 text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
}

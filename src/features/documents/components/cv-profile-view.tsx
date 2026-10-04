"use client";

import * as React from "react";
import {
  FileText,
  Sparkles,
  Briefcase,
  FolderGit2,
  GraduationCap,
  AlertTriangle,
  Quote,
  Edit,
  CheckCircle2,
  Calendar,
  Building,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CvProfileV1, CvSkillEvidence } from "../types/cv.types";
import { EmptyState } from "@/components/feedback/empty-state";
import { cn } from "@/lib/utils";

export interface CvProfileViewProps {
  profile: CvProfileV1 | null;
  profileStatus?: "draft" | "approved";
  canEdit?: boolean;
  canApprove?: boolean;
  onEdit?: () => void;
  onApprove?: () => void;
  className?: string;
}

function EvidenceQuote({ evidence }: { evidence?: CvSkillEvidence }) {
  if (!evidence || (!evidence.quote && !evidence.page)) return null;

  return (
    <div className="mt-1.5 p-2 rounded bg-muted/60 border border-border/50 text-[11px] text-muted-foreground flex items-start gap-1.5">
      <Quote className="size-3 text-primary shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        {evidence.quote && <p className="italic text-foreground/90 leading-relaxed">&ldquo;{evidence.quote}&rdquo;</p>}
        {evidence.page && (
          <span className="inline-block text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.2 rounded">
            Tham chiếu trang {evidence.page}
          </span>
        )}
      </div>
    </div>
  );
}

export function CvProfileView({
  profile,
  profileStatus = "draft",
  canEdit = false,
  canApprove = false,
  onEdit,
  onApprove,
  className,
}: CvProfileViewProps) {
  if (!profile) {
    return (
      <Card className={cn("border bg-card", className)}>
        <CardContent className="p-6">
          <EmptyState
            icon={FileText}
            title="Chưa có dữ liệu hồ sơ (profile.v1)"
            description="Tài liệu CV này chưa có dữ liệu hồ sơ trích xuất hoặc nhập thủ công."
            primaryAction={
              canEdit && onEdit ? (
                <Button size="sm" onClick={onEdit} className="h-8 text-xs gap-1.5">
                  <Edit className="size-3.5" />
                  <span>Nhập hồ sơ thủ công</span>
                </Button>
              ) : undefined
            }
            className="py-8"
          />
        </CardContent>
      </Card>
    );
  }

  const isApproved = profileStatus === "approved";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Action Header Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3.5 px-4">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <span>Hồ sơ năng lực ứng viên (profile.v1)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {isApproved
                ? "Hồ sơ đã được phê duyệt chính thức (chế độ chỉ đọc)."
                : "Bản dự thảo trích xuất – Vui lòng rà soát và đối chiếu với bản CV trước khi duyệt."}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {!isApproved && canEdit && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="h-8 text-xs gap-1.5"
              >
                <Edit className="size-3.5" />
                <span>Chỉnh sửa hồ sơ</span>
              </Button>
            )}

            {!isApproved && canApprove && onApprove && (
              <Button
                size="sm"
                onClick={onApprove}
                className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Phê duyệt hồ sơ</span>
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* 1. Summary Section */}
      <Card>
        <CardHeader className="py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            <span>Tóm tắt chuyên môn (Summary)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
          {profile.summary ? (
            profile.summary
          ) : (
            <span className="italic text-muted-foreground">Chưa có tóm tắt chuyên môn.</span>
          )}
        </CardContent>
      </Card>

      {/* 2. Skills Section */}
      <Card>
        <CardHeader className="py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            <span>Kỹ năng chuyên môn ({profile.skills.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {profile.skills.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Chưa có kỹ năng nào được ghi nhận.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2.5 py-1 font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>

              {/* Show evidences if any skill has quotes */}
              {profile.skills.some((s) => s.evidence?.quote) && (
                <div className="pt-2 border-t space-y-2">
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Trích dẫn tham chiếu kỹ năng:
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {profile.skills
                      .filter((s) => s.evidence?.quote)
                      .map((skill, idx) => (
                        <div key={idx} className="p-2.5 rounded-md border bg-muted/30 text-xs space-y-1">
                          <p className="font-semibold text-foreground text-[11px]">{skill.name}</p>
                          <EvidenceQuote evidence={skill.evidence} />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Experiences Section */}
      <Card>
        <CardHeader className="py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Briefcase className="size-3.5 text-primary" />
            <span>Kinh nghiệm làm việc ({profile.experiences.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {profile.experiences.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Chưa có mục kinh nghiệm làm việc nào.</p>
          ) : (
            <div className="space-y-4 divide-y">
              {profile.experiences.map((exp, index) => (
                <div key={index} className={cn("space-y-1.5", index > 0 && "pt-3.5")}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-foreground text-xs">{exp.role}</p>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>
                          {exp.startDate || "?"} — {exp.endDate || "Hiện tại"}
                        </span>
                      </span>
                    )}
                  </div>

                  {exp.organization && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building className="size-3 text-primary" />
                      <span>{exp.organization}</span>
                    </p>
                  )}

                  {exp.description && (
                    <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap pt-0.5">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Projects Section */}
      <Card>
        <CardHeader className="py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FolderGit2 className="size-3.5 text-primary" />
            <span>Dự án nổi bật ({profile.projects.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {profile.projects.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Chưa có dự án nào được ghi nhận.</p>
          ) : (
            <div className="space-y-4 divide-y">
              {profile.projects.map((proj, index) => (
                <div key={index} className={cn("space-y-2", index > 0 && "pt-3.5")}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground text-xs">{proj.name}</p>
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((tech, tIdx) => (
                        <Badge key={tIdx} variant="outline" className="text-[10px] px-1.5 py-0">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {proj.contribution && (
                    <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
                      {proj.contribution}
                    </p>
                  )}

                  <EvidenceQuote evidence={proj.evidence} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Education Section */}
      <Card>
        <CardHeader className="py-3 px-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <GraduationCap className="size-3.5 text-primary" />
            <span>Học vấn & Bằng cấp ({profile.education.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {profile.education.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Chưa có thông tin học vấn.</p>
          ) : (
            <div className="space-y-3 divide-y">
              {profile.education.map((edu, index) => (
                <div key={index} className={cn("space-y-1", index > 0 && "pt-3")}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground text-xs">
                      {edu.institution || "Cơ sở đào tạo"}
                    </p>
                    {(edu.startDate || edu.endDate) && (
                      <span className="text-[11px] text-muted-foreground">
                        {edu.startDate || "?"} — {edu.endDate || "?"}
                      </span>
                    )}
                  </div>
                  {(edu.degree || edu.field) && (
                    <p className="text-xs text-muted-foreground">
                      {edu.degree && <span className="font-medium text-foreground">{edu.degree}</span>}
                      {edu.degree && edu.field && " • "}
                      {edu.field && <span>Chuyên ngành: {edu.field}</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Missing Information Section */}
      {profile.missingInformation && profile.missingInformation.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/[0.02]">
          <CardHeader className="py-3 px-4 border-b border-amber-500/20 bg-amber-500/10">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="size-3.5" />
              <span>Thông tin cần làm rõ hoặc còn thiếu ({profile.missingInformation.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
              {profile.missingInformation.map((item, index) => (
                <li key={index} className="text-foreground/90">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

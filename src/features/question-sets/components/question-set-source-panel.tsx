import * as React from "react";
import { JobSnapshot } from "../types/question-set.types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, UserCheck, CheckCircle2 } from "lucide-react";

interface QuestionSetSourcePanelProps {
  jobSnapshot: JobSnapshot;
  profileSnapshot: Record<string, unknown>;
  className?: string;
}

export function QuestionSetSourcePanel({
  jobSnapshot,
  profileSnapshot,
  className,
}: QuestionSetSourcePanelProps) {
  const skills = jobSnapshot.requiredSkills || [];
  const criteria = jobSnapshot.evaluationCriteria || [];

  // Extract common profile fields safely
  const candidateName =
    (profileSnapshot.fullName as string) ||
    (profileSnapshot.candidateName as string) ||
    "Ứng viên";
  const headline = (profileSnapshot.headline as string) || (profileSnapshot.title as string) || "";
  const summary = (profileSnapshot.summary as string) || (profileSnapshot.executiveSummary as string) || "";
  const candidateSkills = Array.isArray(profileSnapshot.skills)
    ? (profileSnapshot.skills as string[])
    : Array.isArray(profileSnapshot.technicalSkills)
      ? (profileSnapshot.technicalSkills as string[])
      : [];

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Job Snapshot Info */}
      <Card className="border border-border/70 bg-card/60">
        <CardHeader className="py-3 px-4 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide">
              <Briefcase className="size-4" />
              <span>Snapshot Vị trí Tuyển dụng (Job v{jobSnapshot.version})</span>
            </div>
            <Badge variant="outline" className="text-[10px]">
              ID: {jobSnapshot.jobId.slice(0, 8)}...
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-xs">
          <div>
            <h4 className="font-semibold text-foreground text-sm">{jobSnapshot.title}</h4>
            {jobSnapshot.description && (
              <p className="text-muted-foreground mt-1 line-clamp-3 text-xs leading-relaxed">
                {jobSnapshot.description}
              </p>
            )}
          </div>

          {skills.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Kỹ năng yêu cầu:
              </span>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-[10px] bg-primary/10 text-primary border-primary/20"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {criteria.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Tiêu chí đánh giá Rubric ({criteria.length}):
              </span>
              <div className="space-y-1">
                {criteria.map((c) => (
                  <div
                    key={c.id}
                    className="text-[11px] p-1.5 rounded bg-muted/40 border flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="font-medium text-foreground">{c.name}</span>
                      {c.description && (
                        <p className="text-muted-foreground line-clamp-1">{c.description}</p>
                      )}
                    </div>
                    {c.weight !== undefined && (
                      <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                        x{c.weight}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CV Profile Snapshot Info */}
      <Card className="border border-border/70 bg-card/60">
        <CardHeader className="py-3 px-4 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide">
              <UserCheck className="size-4" />
              <span>Snapshot Hồ sơ CV trích xuất</span>
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
              <CheckCircle2 className="size-3 mr-1" />
              Approved Profile
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-xs">
          <div>
            <h4 className="font-semibold text-foreground text-sm">{candidateName}</h4>
            {headline && <p className="text-xs text-muted-foreground">{headline}</p>}
            {summary && (
              <p className="text-muted-foreground mt-1 line-clamp-3 text-xs leading-relaxed">
                {summary}
              </p>
            )}
          </div>

          {candidateSkills.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Kỹ năng trích xuất từ CV:
              </span>
              <div className="flex flex-wrap gap-1">
                {candidateSkills.slice(0, 10).map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-[10px]">
                    {skill}
                  </Badge>
                ))}
                {candidateSkills.length > 10 && (
                  <span className="text-[10px] text-muted-foreground self-center">
                    +{candidateSkills.length - 10} kỹ năng khác
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

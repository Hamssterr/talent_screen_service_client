import * as React from "react";
import {
  QuestionSetItemInput,
  QuestionDifficulty,
  JobSnapshotCriterion,
  QuestionSource,
} from "../types/question-set.types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CriterionSelector } from "./criterion-selector";
import { QuestionSourceBadge } from "./question-source-badge";
import { QuestionDifficultyBadge } from "./question-difficulty-badge";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  FileSearch,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuestionItemEditorProps {
  item: QuestionSetItemInput & { id?: string; source?: QuestionSource };
  index: number;
  totalItems: number;
  criteria?: JobSnapshotCriterion[];
  isReadOnly?: boolean;
  onChange: (updated: QuestionSetItemInput) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  className?: string;
}

export function QuestionItemEditor({
  item,
  index,
  totalItems,
  criteria = [],
  isReadOnly = false,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  className,
}: QuestionItemEditorProps) {
  const isFirst = index === 0;
  const isLast = index === totalItems - 1;

  const handleFieldChange = <K extends keyof QuestionSetItemInput>(
    field: K,
    value: QuestionSetItemInput[K],
  ) => {
    onChange({
      ...item,
      [field]: value,
    });
  };

  const textLength = item.text?.length || 0;
  const isTextInvalid = textLength < 5 || textLength > 2000;

  return (
    <Card
      className={cn(
        "border transition-all duration-150 shadow-xs",
        isReadOnly ? "bg-card/40 border-border/70" : "bg-card hover:border-primary/40",
        className,
      )}
    >
      {/* Header with Position, Badges, Reorder and Delete */}
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center size-6 rounded-md bg-primary text-primary-foreground font-semibold text-xs tabular-nums shadow-xs">
            {item.position}
          </span>
          <span className="font-semibold text-xs text-foreground">
            Câu hỏi #{item.position}
          </span>

          <QuestionSourceBadge source={item.source || "manual"} />
          {isReadOnly && <QuestionDifficultyBadge difficulty={item.difficulty} />}
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={onMoveUp}
              disabled={isFirst}
              title="Di chuyển lên (Move Up)"
              aria-label={`Di chuyển câu hỏi ${item.position} lên`}
            >
              <ArrowUp className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={onMoveDown}
              disabled={isLast}
              title="Di chuyển xuống (Move Down)"
              aria-label={`Di chuyển câu hỏi ${item.position} xuống`}
            >
              <ArrowDown className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
              onClick={onDelete}
              disabled={totalItems <= 1}
              title="Xóa câu hỏi này"
              aria-label={`Xóa câu hỏi ${item.position}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-3.5">
        {/* Question Text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor={`question-text-${item.position}`}
              className="text-xs font-semibold flex items-center gap-1"
            >
              <span>Nội dung câu hỏi</span>
              <span className="text-destructive">*</span>
            </Label>
            <span
              className={cn(
                "text-[10px] tabular-nums",
                isTextInvalid ? "text-destructive font-semibold" : "text-muted-foreground",
              )}
            >
              {textLength} / 2000 ký tự {textLength < 5 && "(tối thiểu 5)"}
            </span>
          </div>

          {isReadOnly ? (
            <div className="text-xs bg-muted/30 p-3 rounded-lg border leading-relaxed text-foreground font-medium">
              {item.text}
            </div>
          ) : (
            <Textarea
              id={`question-text-${item.position}`}
              value={item.text || ""}
              onChange={(e) => handleFieldChange("text", e.target.value)}
              placeholder="Nhập nội dung câu hỏi phỏng vấn cần đặt cho ứng viên..."
              rows={3}
              className="text-xs resize-y"
            />
          )}
        </div>

        {/* Evidence References (AI Extracted Evidence) */}
        {item.evidenceRefs && Array.isArray(item.evidenceRefs) && item.evidenceRefs.length > 0 && (
          <div className="space-y-1 p-2.5 rounded-lg bg-purple-500/[0.04] border border-purple-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-semibold text-[11px]">
              <FileSearch className="size-3.5" />
              <span>Dẫn chứng trích xuất từ CV (AI Evidence):</span>
            </div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {item.evidenceRefs.map((ev, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-[10px] bg-purple-500/5 text-purple-800 dark:text-purple-300 border-purple-500/30"
                >
                  {typeof ev === "string" ? ev : JSON.stringify(ev)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Competency, Criterion & Difficulty row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Competency */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`question-competency-${item.position}`}
              className="text-[11px] font-medium text-muted-foreground"
            >
              Năng lực / Kỹ năng
            </Label>
            {isReadOnly ? (
              <div className="text-xs p-2 rounded bg-muted/30 border text-foreground">
                {item.competency || "—"}
              </div>
            ) : (
              <Input
                id={`question-competency-${item.position}`}
                value={item.competency || ""}
                onChange={(e) => handleFieldChange("competency", e.target.value)}
                placeholder="VD: System Design, Go..."
                maxLength={150}
                className="text-xs h-9"
              />
            )}
          </div>

          {/* Criterion */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`question-criterion-${item.position}`}
              className="text-[11px] font-medium text-muted-foreground"
            >
              Tiêu chí Rubric gán kèm
            </Label>
            {isReadOnly ? (
              <div className="text-xs p-2 rounded bg-muted/30 border text-foreground">
                {criteria.find((c) => c.id === item.evaluationCriterionId)?.name ||
                  "— Không gán —"}
              </div>
            ) : (
              <CriterionSelector
                id={`question-criterion-${item.position}`}
                value={item.evaluationCriterionId}
                onChange={(val) => handleFieldChange("evaluationCriterionId", val)}
                criteria={criteria}
              />
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`question-difficulty-${item.position}`}
              className="text-[11px] font-medium text-muted-foreground"
            >
              Mức độ khó
            </Label>
            {isReadOnly ? (
              <div className="text-xs p-2 rounded bg-muted/30 border text-foreground">
                {item.difficulty === "basic"
                  ? "Cơ bản"
                  : item.difficulty === "advanced"
                    ? "Nâng cao"
                    : "Trung cấp"}
              </div>
            ) : (
              <select
                id={`question-difficulty-${item.position}`}
                value={item.difficulty || "intermediate"}
                onChange={(e) =>
                  handleFieldChange("difficulty", e.target.value as QuestionDifficulty)
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                <option value="basic">Cơ bản (Basic)</option>
                <option value="intermediate">Trung cấp (Intermediate)</option>
                <option value="advanced">Nâng cao (Advanced)</option>
              </select>
            )}
          </div>
        </div>

        {/* Follow-up Question Settings & Review Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-dashed">
          {/* Follow-up config */}
          <div className="space-y-2 p-2.5 rounded-lg bg-muted/20 border">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor={`allow-followup-${item.position}`}
                  className="text-xs font-semibold cursor-pointer"
                >
                  Hỏi đào sâu (Follow-up)
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Cho phép AI đặt câu hỏi làm rõ câu trả lời
                </p>
              </div>

              {isReadOnly ? (
                <Badge variant={item.allowFollowUp ? "default" : "secondary"} className="text-[10px]">
                  {item.allowFollowUp ? `Bật (${item.maxFollowUps} câu)` : "Tắt"}
                </Badge>
              ) : (
                <Switch
                  id={`allow-followup-${item.position}`}
                  checked={Boolean(item.allowFollowUp)}
                  onCheckedChange={(checked: boolean) => {
                    handleFieldChange("allowFollowUp", checked);
                    if (!checked) {
                      handleFieldChange("maxFollowUps", 0);
                    } else if (!item.maxFollowUps || item.maxFollowUps === 0) {
                      handleFieldChange("maxFollowUps", 1);
                    }
                  }}
                />
              )}
            </div>

            {item.allowFollowUp && !isReadOnly && (
              <div className="flex items-center justify-between pt-1 border-t border-dashed">
                <Label
                  htmlFor={`max-followup-${item.position}`}
                  className="text-[11px] text-muted-foreground"
                >
                  Số câu follow-up tối đa:
                </Label>
                <select
                  id={`max-followup-${item.position}`}
                  value={item.maxFollowUps || 1}
                  onChange={(e) => handleFieldChange("maxFollowUps", Number(e.target.value))}
                  className="h-7 w-20 rounded border border-input bg-background px-2 text-xs font-medium"
                >
                  <option value={1}>1 câu</option>
                  <option value={2}>2 câu</option>
                </select>
              </div>
            )}
          </div>

          {/* Review Notes */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`question-notes-${item.position}`}
              className="text-[11px] font-medium text-muted-foreground flex items-center gap-1"
            >
              <MessageSquare className="size-3" />
              <span>Ghi chú phỏng vấn viên (Review Notes)</span>
            </Label>
            {isReadOnly ? (
              <div className="text-xs p-2 rounded bg-muted/20 border text-muted-foreground italic min-h-[44px]">
                {item.reviewNotes || "Không có ghi chú"}
              </div>
            ) : (
              <Input
                id={`question-notes-${item.position}`}
                value={item.reviewNotes || ""}
                onChange={(e) => handleFieldChange("reviewNotes", e.target.value)}
                placeholder="VD: Cần chú ý hỏi sâu về phương án rollback..."
                className="text-xs h-9"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

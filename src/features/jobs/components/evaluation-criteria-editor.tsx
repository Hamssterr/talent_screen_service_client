"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { JobCriterionFormItem } from "../types/job.types";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ListChecks,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface EvaluationCriteriaEditorProps {
  value: JobCriterionFormItem[];
  onChange: (criteria: JobCriterionFormItem[]) => void;
  disabled?: boolean;
  maxCriteria?: number;
  errors?: Record<string, { name?: string; description?: string }>;
}

export function EvaluationCriteriaEditor({
  value = [],
  onChange,
  disabled = false,
  maxCriteria = 10,
  errors = {},
}: EvaluationCriteriaEditorProps) {
  const handleAddCriterion = () => {
    if (value.length >= maxCriteria || disabled) return;
    const newItem: JobCriterionFormItem = {
      _clientId: `new-${Date.now()}-${Math.random()}`,
      name: "",
      description: "",
    };
    onChange([...value, newItem]);
  };

  const handleRemoveCriterion = (index: number) => {
    if (disabled) return;
    onChange(value.filter((_, idx) => idx !== index));
  };

  const handleUpdateCriterion = (
    index: number,
    field: "name" | "description",
    val: string,
  ) => {
    if (disabled) return;
    const updated = value.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || disabled) return;
    const next = [...value];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    onChange(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1 || disabled) return;
    const next = [...value];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="size-4 text-primary" />
          <Label className="text-xs font-semibold">
            Tiêu chí đánh giá chung (Rubric)
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-xs text-muted-foreground",
              value.length >= maxCriteria && "text-warning font-semibold",
            )}
          >
            {value.length} / {maxCriteria} tiêu chí
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCriterion}
            disabled={disabled || value.length >= maxCriteria}
            className="h-8 gap-1.5 text-xs"
          >
            <Plus className="size-3.5" />
            <span>Thêm tiêu chí</span>
          </Button>
        </div>
      </div>

      {value.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground bg-muted/10">
          Chưa có tiêu chí đánh giá nào. Bạn có thể thêm tiêu chí để chuẩn hóa quá trình phỏng vấn và đánh giá ứng viên.
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((criterion, index) => {
            const rowKey = criterion.id || criterion._clientId || `criterion-${index}`;
            const rowError = errors[index.toString()];

            return (
              <div
                key={rowKey}
                className="group relative rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:border-border/80 hover:shadow-xs space-y-3"
              >
                {/* Header row: Index number & Actions */}
                <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="size-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold bg-muted/40"
                    >
                      {index + 1}
                    </Badge>
                    <span className="text-xs font-medium text-foreground">
                      Tiêu chí #{index + 1}
                    </span>
                    {criterion.id && (
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">
                        ({criterion.id.slice(0, 8)}...)
                      </span>
                    )}
                  </div>

                  {/* Reorder and Delete controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(index)}
                      disabled={disabled || index === 0}
                      className="size-7 p-0 text-muted-foreground hover:text-foreground"
                      aria-label={`Di chuyển tiêu chí ${index + 1} lên`}
                    >
                      <ChevronUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(index)}
                      disabled={disabled || index === value.length - 1}
                      className="size-7 p-0 text-muted-foreground hover:text-foreground"
                      aria-label={`Di chuyển tiêu chí ${index + 1} xuống`}
                    >
                      <ChevronDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCriterion(index)}
                      disabled={disabled}
                      className="size-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      aria-label={`Xóa tiêu chí ${index + 1}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 gap-3">
                  {/* Name field */}
                  <div className="space-y-1">
                    <Label
                      htmlFor={`criterion-name-${index}`}
                      className="text-[11px] font-semibold text-muted-foreground"
                    >
                      Tên tiêu chí <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`criterion-name-${index}`}
                      value={criterion.name}
                      onChange={(e) =>
                        handleUpdateCriterion(index, "name", e.target.value)
                      }
                      placeholder="e.g. Kiến thức cơ sở dữ liệu & tối ưu hóa truy vấn"
                      disabled={disabled}
                      className="h-8 text-xs"
                      aria-invalid={Boolean(rowError?.name)}
                    />
                    {rowError?.name && (
                      <p className="text-[11px] text-destructive flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        {rowError.name}
                      </p>
                    )}
                  </div>

                  {/* Description field */}
                  <div className="space-y-1">
                    <Label
                      htmlFor={`criterion-desc-${index}`}
                      className="text-[11px] font-semibold text-muted-foreground"
                    >
                      Mô tả & Hướng dẫn chấm điểm <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id={`criterion-desc-${index}`}
                      value={criterion.description}
                      onChange={(e) =>
                        handleUpdateCriterion(index, "description", e.target.value)
                      }
                      placeholder="Mô tả chi tiết năng lực cần kiểm tra, tiêu chuẩn đạt yêu cầu..."
                      disabled={disabled}
                      rows={2}
                      className="text-xs resize-none"
                      aria-invalid={Boolean(rowError?.description)}
                    />
                    {rowError?.description && (
                      <p className="text-[11px] text-destructive flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        {rowError.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

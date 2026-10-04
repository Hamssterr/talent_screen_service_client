"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RequiredSkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
  maxSkills?: number;
  className?: string;
  error?: string;
}

export function RequiredSkillsInput({
  value = [],
  onChange,
  disabled = false,
  maxSkills = 50,
  className,
  error,
}: RequiredSkillsInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [localError, setLocalError] = React.useState<string | null>(null);

  const handleAddSkill = (skillText: string) => {
    const trimmed = skillText.trim();
    setLocalError(null);

    if (!trimmed) return;

    if (trimmed.length > 100) {
      setLocalError("Tên kỹ năng không được vượt quá 100 ký tự");
      return;
    }

    if (value.length >= maxSkills) {
      setLocalError(`Đã đạt giới hạn tối đa ${maxSkills} kỹ năng`);
      return;
    }

    // Check duplicate case-insensitively
    const isDuplicate = value.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase(),
    );

    if (isDuplicate) {
      setLocalError(`Kỹ năng "${trimmed}" đã tồn tại trong danh sách`);
      return;
    }

    onChange([...value, trimmed]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove last tag on backspace when input is empty
      e.preventDefault();
      handleRemoveSkill(value.length - 1);
    }
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    if (disabled) return;
    setLocalError(null);
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col gap-2">
        {/* Input box */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setLocalError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tên kỹ năng rồi nhấn Enter hoặc Dấu phẩy (e.g. NestJS, Docker)..."
            disabled={disabled || value.length >= maxSkills}
            className="text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddSkill(inputValue)}
            disabled={
              disabled || !inputValue.trim() || value.length >= maxSkills
            }
            className="shrink-0 gap-1.5">
            <Plus className="size-4" />
            <span>Thêm</span>
          </Button>
        </div>

        {/* Helper info & tag count */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
          <span>Nhấn Enter hoặc dấu phẩy để thêm kỹ năng</span>
          <span
            className={cn(
              "font-medium",
              value.length >= maxSkills && "text-warning font-semibold",
            )}>
            {value.length} / {maxSkills} kỹ năng
          </span>
        </div>

        {/* Validation error message */}
        {(localError || error) && (
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Skill tags container */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-border bg-muted/20 min-h-[50px] items-center">
            {value.map((skill, index) => (
              <Badge
                key={`${skill}-${index}`}
                variant="secondary"
                className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-normal border border-border/80 group">
                <span className="font-medium text-foreground">{skill}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="size-4 rounded-full inline-flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    aria-label={`Xóa kỹ năng ${skill}`}>
                    <X className="size-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

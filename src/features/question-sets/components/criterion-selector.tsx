import * as React from "react";
import { JobSnapshotCriterion } from "../types/question-set.types";

interface CriterionSelectorProps {
  id?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  criteria?: JobSnapshotCriterion[];
  disabled?: boolean;
  className?: string;
}

export function CriterionSelector({
  id,
  value,
  onChange,
  criteria = [],
  disabled = false,
  className,
}: CriterionSelectorProps) {
  const selectedValue = value || "";

  return (
    <div className={className}>
      <select
        id={id}
        value={selectedValue}
        disabled={disabled}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? null : val);
        }}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        <option value="">-- Không gán tiêu chí (Câu hỏi chung) --</option>
        {criteria.map((criterion) => (
          <option key={criterion.id} value={criterion.id}>
            {criterion.name} {criterion.weight !== undefined ? `(Trọng số: ${criterion.weight})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

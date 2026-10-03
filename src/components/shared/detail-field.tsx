import * as React from "react";
import { cn } from "@/lib/utils";

export interface DetailFieldProps {
  label: string;
  value?: React.ReactNode;
  emptyFallback?: string;
  icon?: React.ReactNode;
  layout?: "vertical" | "horizontal";
  className?: string;
  valueClassName?: string;
}

export function DetailField({
  label,
  value,
  emptyFallback = "—",
  icon,
  layout = "vertical",
  className,
  valueClassName,
}: DetailFieldProps) {
  const isHorizontal = layout === "horizontal";
  const displayValue = value !== undefined && value !== null && value !== "" ? value : emptyFallback;

  return (
    <div
      data-slot="detail-field"
      className={cn(
        isHorizontal
          ? "flex items-center justify-between py-2 border-b border-border/40 gap-4"
          : "flex flex-col gap-1",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={cn(
          "text-sm font-medium text-foreground",
          displayValue === emptyFallback && "text-muted-foreground/60 italic font-normal",
          valueClassName,
        )}
      >
        {displayValue}
      </div>
    </div>
  );
}

export default DetailField;

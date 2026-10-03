import * as React from "react";
import { cn } from "@/lib/utils";

export interface FilterBarProps {
  searchSlot?: React.ReactNode;
  filtersSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  searchSlot,
  filtersSlot,
  actionsSlot,
  children,
  className,
}: FilterBarProps) {
  return (
    <div
      data-slot="filter-bar"
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-1 rounded-xl",
        className,
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {searchSlot}
        {filtersSlot}
        {children}
      </div>

      {actionsSlot && (
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {actionsSlot}
        </div>
      )}
    </div>
  );
}

export default FilterBar;

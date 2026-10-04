"use client";

import * as React from "react";
import { FilterBar } from "@/components/shared/filter-bar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobListScope, JobStatus } from "../types/job.types";
import { RotateCcw } from "lucide-react";

export interface JobFilterBarProps {
  status?: JobStatus | "";
  onStatusChange: (status: JobStatus | "") => void;
  scope?: JobListScope;
  onScopeChange: (scope: JobListScope) => void;
  onReset?: () => void;
  actionsSlot?: React.ReactNode;
}

export function JobFilterBar({
  status,
  onStatusChange,
  scope = "all",
  onScopeChange,
  onReset,
  actionsSlot,
}: JobFilterBarProps) {
  const hasActiveFilters = Boolean(status || (scope && scope !== "all"));

  return (
    <FilterBar
      filtersSlot={
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="w-[180px]">
            <Select
              value={status || "all"}
              onValueChange={(val) =>
                onStatusChange(val === "all" ? "" : (val as JobStatus))
              }
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Trạng thái tuyển dụng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="open">Đang mở tuyển (Open)</SelectItem>
                <SelectItem value="draft">Bản nháp (Draft)</SelectItem>
                <SelectItem value="closed">Đã đóng tuyển (Closed)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scope Filter */}
          <div className="w-[180px]">
            <Select
              value={scope || "all"}
              onValueChange={(val) => onScopeChange((val || "all") as JobListScope)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Phạm vi công việc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phạm vi</SelectItem>
                <SelectItem value="mine">Do tôi phụ trách (Mine)</SelectItem>
                <SelectItem value="shared">Được chia sẻ (Shared)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <RotateCcw className="size-3" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      }
      actionsSlot={actionsSlot}
    />
  );
}

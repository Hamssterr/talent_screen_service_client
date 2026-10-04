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
import { ApplicationListScope, ApplicationStatus } from "../types/application.types";
import { RotateCcw } from "lucide-react";

export interface ApplicationFilterBarProps {
  status?: ApplicationStatus | "";
  onStatusChange: (status: ApplicationStatus | "") => void;
  scope?: ApplicationListScope;
  onScopeChange: (scope: ApplicationListScope) => void;
  onReset?: () => void;
  actionsSlot?: React.ReactNode;
}

export function ApplicationFilterBar({
  status,
  onStatusChange,
  scope = "all",
  onScopeChange,
  onReset,
  actionsSlot,
}: ApplicationFilterBarProps) {
  const hasActiveFilters = Boolean(status || (scope && scope !== "all"));

  return (
    <FilterBar
      filtersSlot={
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="w-[190px]">
            <Select
              value={status || "all"}
              onValueChange={(val) =>
                onStatusChange(val === "all" ? "" : (val as ApplicationStatus))
              }
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Trạng thái hồ sơ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="shortlisted">Đã sơ tuyển (Shortlisted)</SelectItem>
                <SelectItem value="interviewing">Đang phỏng vấn (Interviewing)</SelectItem>
                <SelectItem value="under_review">Chờ HR đánh giá (Under Review)</SelectItem>
                <SelectItem value="approved">Đã duyệt tuyển (Approved)</SelectItem>
                <SelectItem value="rejected">Đã từ chối (Rejected)</SelectItem>
                <SelectItem value="withdrawn">Đã rút hồ sơ (Withdrawn)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scope Filter */}
          <div className="w-[190px]">
            <Select
              value={scope || "all"}
              onValueChange={(val) => onScopeChange((val || "all") as ApplicationListScope)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Phạm vi hồ sơ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả hồ sơ</SelectItem>
                <SelectItem value="mine">Hồ sơ của tôi (Mine)</SelectItem>
                <SelectItem value="job-owned">Theo vị trí tôi quản lý (Job-owned)</SelectItem>
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

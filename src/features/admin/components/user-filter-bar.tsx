"use client";

import * as React from "react";
import { FilterBar } from "@/components/shared/filter-bar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { UserStatus } from "../types/admin.types";

export interface UserFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: UserStatus | "";
  onStatusChange: (value: UserStatus | "") => void;
  actionsSlot?: React.ReactNode;
}

export function UserFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  actionsSlot,
}: UserFilterBarProps) {
  return (
    <FilterBar
      searchSlot={
        <div className="relative min-w-[240px] max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="pl-9 h-9 text-sm"
          />
        </div>
      }
      filtersSlot={
        <div className="w-[180px]">
          <Select
            value={status || "all"}
            onValueChange={(val) =>
              onStatusChange(val === "all" ? "" : (val as UserStatus))
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="pending">Chờ kích hoạt</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="suspended">Bị khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      actionsSlot={actionsSlot}
    />
  );
}

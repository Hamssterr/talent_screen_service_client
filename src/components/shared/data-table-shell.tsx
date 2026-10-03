import * as React from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { cn } from "@/lib/utils";

export interface DataTableShellProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  pagination?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DataTableShell({
  isLoading = false,
  isEmpty = false,
  emptyState,
  loadingState,
  pagination,
  children,
  className,
}: DataTableShellProps) {
  return (
    <div
      data-slot="data-table-shell"
      className={cn("w-full space-y-4", className)}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        {isLoading ? (
          loadingState || <LoadingState mode="skeleton" rows={4} />
        ) : isEmpty ? (
          emptyState || <EmptyState title="Chưa có dữ liệu" description="Hiện chưa có bản ghi nào để hiển thị." />
        ) : (
          <div className="overflow-x-auto">{children}</div>
        )}
      </div>

      {pagination && <div className="px-1">{pagination}</div>}
    </div>
  );
}

export default DataTableShell;

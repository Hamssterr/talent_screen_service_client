"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OffsetPaginationProps {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
  showItemSummary?: boolean;
}

export function OffsetPagination({
  page,
  limit,
  totalItems,
  totalPages,
  onPageChange,
  className,
  showItemSummary = true,
}: OffsetPaginationProps) {
  if (totalPages <= 1 && totalItems <= limit) {
    if (!showItemSummary || totalItems === 0) return null;
  }

  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div
      data-slot="offset-pagination"
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3 px-1",
        className,
      )}
    >
      {showItemSummary && (
        <p className="text-xs text-muted-foreground">
          {totalItems > 0 ? (
            <>
              Hiển thị <span className="font-medium text-foreground">{startItem}</span>–
              <span className="font-medium text-foreground">{endItem}</span> trong tổng số{" "}
              <span className="font-medium text-foreground">{totalItems}</span> kết quả
            </>
          ) : (
            "Không có kết quả nào"
          )}
        </p>
      )}

      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious}
          aria-label="Trang trước"
          className="gap-1 px-2.5 h-8 text-xs"
        >
          <ChevronLeft className="size-3.5" />
          <span className="hidden sm:inline">Trước</span>
        </Button>

        <span className="px-2 text-xs font-medium text-muted-foreground">
          Trang <span className="text-foreground">{page}</span> / {Math.max(totalPages, 1)}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          aria-label="Trang sau"
          className="gap-1 px-2.5 h-8 text-xs"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default OffsetPagination;

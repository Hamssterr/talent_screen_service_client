import * as React from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  mode?: "page" | "inline" | "skeleton" | "card";
  title?: string;
  description?: string;
  rows?: number;
  className?: string;
}

export function LoadingState({
  mode = "inline",
  title = "Đang tải dữ liệu...",
  description,
  rows = 3,
  className,
}: LoadingStateProps) {
  if (mode === "skeleton") {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        data-slot="loading-skeleton"
        className={cn("w-full space-y-3 p-4", className)}
      >
        <Skeleton className="h-7 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2 pt-2">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (mode === "card") {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className={cn(
          "rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    );
  }

  const isPage = mode === "page";

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      data-slot="loading-state"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isPage ? "min-h-[60vh] p-8" : "min-h-36 p-6",
        className,
      )}
    >
      <Loader2 className={cn("animate-spin text-primary mb-3", isPage ? "size-8" : "size-6")} />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
      )}
    </div>
  );
}

export default LoadingState;

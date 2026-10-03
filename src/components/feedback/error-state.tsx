import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message: string;
  requestId?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Không thể tải dữ liệu",
  message,
  requestId,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      data-slot="error-state"
      className={cn(
        "flex min-h-60 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-danger-soft/40 p-8 text-center animate-in fade-in-50",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3.5">
        <AlertTriangle className="size-6" />
      </div>

      <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">
        {title}
      </h3>

      <p className="max-w-md text-sm text-muted-foreground leading-relaxed mb-4">
        {message}
      </p>

      {requestId && (
        <p className="font-mono text-xs text-muted-foreground/80 mb-5 bg-background/60 px-2.5 py-1 rounded-md border border-border/50">
          Mã tra cứu (Request ID): {requestId}
        </p>
      )}

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2 bg-background hover:bg-muted"
        >
          <RefreshCw className="size-3.5" />
          Thử lại
        </Button>
      )}
    </div>
  );
}

export default ErrorState;

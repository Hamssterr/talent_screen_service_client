import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthLoadingScreenProps {
  message?: string;
  className?: string;
}

export function AuthLoadingScreen({
  message = "Đang đồng bộ phiên làm việc...",
  className,
}: AuthLoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={cn(
        "flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 text-center animate-in fade-in-50 duration-200",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-xs">
        <Loader2 className="size-7 animate-spin" />
      </div>
      <h2 className="text-base font-semibold text-foreground tracking-tight mb-1">
        TalentScreen
      </h2>
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

export default AuthLoadingScreen;

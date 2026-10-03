"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SessionExpiredMessage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  if (reason !== "session_expired") {
    return null;
  }

  return (
    <Alert variant="warning" className="mb-4 text-xs animate-in fade-in-50">
      <AlertCircle className="size-4 text-warning mt-0.5" />
      <div>
        <AlertTitle className="text-xs font-semibold text-warning-foreground">
          Phiên làm việc đã hết hạn
        </AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground mt-0.5">
          Phiên đăng nhập của bạn đã kết thúc do hết hạn hoặc không hoạt động. Vui lòng đăng nhập lại để tiếp tục.
        </AlertDescription>
      </div>
    </Alert>
  );
}

export default SessionExpiredMessage;

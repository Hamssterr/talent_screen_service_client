import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConflictAlertProps {
  title?: string;
  message?: string;
  onReload?: () => void;
  className?: string;
}

export function ConflictAlert({
  title = "Xung đột phiên bản dữ liệu",
  message = "Dữ liệu này vừa được cập nhật bởi một người dùng hoặc quy trình khác. Vui lòng tải lại trang để xem nội dung mới nhất trước khi tiếp tục.",
  onReload,
  className,
}: ConflictAlertProps) {
  return (
    <Alert
      variant="warning"
      className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 shrink-0 text-warning mt-0.5" />
        <div className="space-y-1">
          <AlertTitle className="text-warning-foreground font-semibold">
            {title}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground text-xs leading-relaxed">
            {message}
          </AlertDescription>
        </div>
      </div>

      {onReload && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReload}
          className="shrink-0 gap-2 self-start sm:self-center border-warning/30 bg-card hover:bg-warning-soft text-warning-foreground"
        >
          <RefreshCw className="size-3.5" />
          Tải lại dữ liệu
        </Button>
      )}
    </Alert>
  );
}

export default ConflictAlert;

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Lock, Loader2 } from "lucide-react";
import { QuestionSetDetail } from "../types/question-set.types";
import { useApproveQuestionSetMutation } from "../hooks/use-approve-question-set-mutation";
import { getQuestionErrorMessage } from "../utils/question-error-message";

interface ApproveQuestionSetDialogProps {
  questionSet: QuestionSetDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ApproveQuestionSetDialog({
  questionSet,
  open,
  onOpenChange,
  onSuccess,
}: ApproveQuestionSetDialogProps) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const approveMutation = useApproveQuestionSetMutation();

  const handleApprove = async () => {
    setErrorMessage(null);
    try {
      await approveMutation.mutateAsync({
        id: questionSet.id,
        data: {
          expectedVersion: questionSet.version,
        },
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setErrorMessage(getQuestionErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="size-5" />
            <DialogTitle className="text-base font-semibold">Phê duyệt Bộ câu hỏi</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Bạn đang chuẩn bị phê duyệt Bộ câu hỏi (phiên bản v{questionSet.version}) gồm {questionSet.items?.length || 0} câu hỏi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
            <Lock className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-xs">Khóa bất biến sau khi phê duyệt</p>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Sau khi được duyệt, bộ câu hỏi sẽ chuyển sang trạng thái <strong>Approved (Read-only)</strong> và trở thành nguồn dữ liệu chính thức để tạo các phiên Phỏng vấn (Interviews).
              </p>
            </div>
          </div>

          {questionSet.isStale && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-normal">
                Cảnh báo: Bộ câu hỏi này bị Stale do Job hoặc CV đã thay đổi. Phê duyệt có thể bị từ chối bởi hệ thống.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
              {errorMessage}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={approveMutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleApprove}
            disabled={approveMutation.isPending || (questionSet.items?.length || 0) === 0}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            {approveMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="size-3.5" />
            )}
            <span>{approveMutation.isPending ? "Đang phê duyệt..." : "Xác nhận Phê duyệt"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { useCloneQuestionSetMutation } from "../hooks/use-clone-question-set-mutation";
import { getQuestionErrorMessage } from "../utils/question-error-message";

interface CloneQuestionSetDialogProps {
  questionSetId: string;
  applicationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newSetId: string) => void;
}

export function CloneQuestionSetDialog({
  questionSetId,
  applicationId,
  open,
  onOpenChange,
  onSuccess,
}: CloneQuestionSetDialogProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const cloneMutation = useCloneQuestionSetMutation();

  const handleClone = async () => {
    setErrorMessage(null);
    try {
      const cloned = await cloneMutation.mutateAsync(questionSetId);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess(cloned.id);
      } else {
        router.push(`/applications/${applicationId}/questions/${cloned.id}`);
      }
    } catch (err) {
      setErrorMessage(getQuestionErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Copy className="size-5" />
            <DialogTitle className="text-base font-semibold">Nhân bản Bộ câu hỏi (Clone)</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Hệ thống sẽ tạo ra một bản nháp (Draft) mới độc lập sao chép toàn bộ danh sách câu hỏi và snapshot hiện tại.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            Bản nháp mới sẽ có thể tự do chỉnh sửa, sắp xếp lại hoặc bổ sung câu hỏi mà không làm ảnh hưởng đến bộ câu hỏi gốc.
          </p>

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
            disabled={cloneMutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleClone}
            disabled={cloneMutation.isPending}
            className="gap-1.5"
          >
            {cloneMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span>{cloneMutation.isPending ? "Đang nhân bản..." : "Tạo bản sao"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

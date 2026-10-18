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
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteQuestionSetMutation } from "../hooks/use-delete-question-set-mutation";
import { getQuestionErrorMessage } from "../utils/question-error-message";

interface DeleteQuestionSetDialogProps {
  questionSetId: string;
  applicationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteQuestionSetDialog({
  questionSetId,
  applicationId,
  open,
  onOpenChange,
  onSuccess,
}: DeleteQuestionSetDialogProps) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const deleteMutation = useDeleteQuestionSetMutation();

  const handleDelete = async () => {
    setErrorMessage(null);
    try {
      await deleteMutation.mutateAsync({
        id: questionSetId,
        applicationId,
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
          <div className="flex items-center gap-2 text-destructive mb-1">
            <Trash2 className="size-5" />
            <DialogTitle className="text-base font-semibold">Xóa Bộ câu hỏi</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Hành động này sẽ xóa mềm bộ câu hỏi này khỏi danh sách của hồ sơ ứng tuyển.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-normal">
              Chỉ Quản trị viên (Admin) với quyền quản lý bộ câu hỏi mới có thể thực hiện thao tác xóa này.
            </p>
          </div>

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
            disabled={deleteMutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="gap-1.5"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
            <span>{deleteMutation.isPending ? "Đang xóa..." : "Xác nhận xóa"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

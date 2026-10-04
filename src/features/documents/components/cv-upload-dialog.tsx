"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CvUploadDropzone } from "./cv-upload-dropzone";
import { CvVersionSafe } from "../types/cv.types";

export interface CvUploadDialogProps {
  applicationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newCv: CvVersionSafe) => void;
}

export function CvUploadDialog({
  applicationId,
  open,
  onOpenChange,
  onSuccess,
}: CvUploadDialogProps) {
  const handleSuccess = (newCv: CvVersionSafe) => {
    onOpenChange(false);
    onSuccess?.(newCv);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <UploadCloud className="size-5" />
            <DialogTitle>Tải lên phiên bản CV mới</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Mỗi lần tải lên một tệp CV mới sẽ tạo một phiên bản CV Version độc lập và tự động thiết lập làm CV hiện tại của hồ sơ ứng tuyển này.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          <CvUploadDropzone
            applicationId={applicationId}
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";
import { UploadCloud, FileText, X, AlertCircle, RefreshCw, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AsyncButton } from "@/components/shared/async-button";
import { Progress } from "@/components/ui/progress";
import { validatePdfFile, verifyPdfMagicBytes } from "../utils/file-validation";
import { formatFileSize } from "../utils/file-size";
import { useUploadCvMutation } from "../hooks/use-upload-cv-mutation";
import { CvVersionSafe } from "../types/cv.types";
import { getApiError } from "@/lib/api/api-error";
import { cn } from "@/lib/utils";

export interface CvUploadDropzoneProps {
  applicationId: string;
  onSuccess?: (newCv: CvVersionSafe) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export function CvUploadDropzone({
  applicationId,
  onSuccess,
  onCancel,
  disabled = false,
}: CvUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);

  // Active command for Idempotency-Key lifecycle
  const [activeCommand, setActiveCommand] = React.useState<{
    idempotencyKey: string;
    file: File;
  } | null>(null);

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const uploadMutation = useUploadCvMutation(applicationId);

  const handleFileSelect = async (file: File) => {
    setValidationError(null);
    setUploadError(null);
    setUploadProgress(null);

    const validation = validatePdfFile(file);
    if (!validation.isValid) {
      setValidationError(validation.error || "File không hợp lệ.");
      setSelectedFile(null);
      setActiveCommand(null);
      return;
    }

    // Verify magic bytes
    const isMagicValid = await verifyPdfMagicBytes(file);
    if (!isMagicValid) {
      setValidationError("Nội dung tệp không phải là định dạng PDF hợp lệ (sai mã nhận dạng header).");
      setSelectedFile(null);
      setActiveCommand(null);
      return;
    }

    setSelectedFile(file);
    // New file chosen -> reset logical idempotency command
    setActiveCommand({
      idempotencyKey: crypto.randomUUID(),
      file,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploadMutation.isPending) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || uploadMutation.isPending) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    setUploadError(null);
    setUploadProgress(null);
    setActiveCommand(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    let command = activeCommand;
    if (!command || command.file !== selectedFile) {
      command = {
        idempotencyKey: crypto.randomUUID(),
        file: selectedFile,
      };
      setActiveCommand(command);
    }

    setUploadError(null);
    setUploadProgress(0);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const newCv = await uploadMutation.mutateAsync({
        file: selectedFile,
        idempotencyKey: command.idempotencyKey,
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      // Clear command upon success
      setActiveCommand(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onSuccess?.(newCv);
    } catch (err: unknown) {
      if (controller.signal.aborted) {
        setUploadError("Quá trình tải lên đã bị hủy bỏ bởi người dùng.");
      } else {
        const apiErr = getApiError(err);
        setUploadError(apiErr.message || "Không thể tải lên tệp CV. Vui lòng thử lại.");
      }
    } finally {
      abortControllerRef.current = null;
      setUploadProgress(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        id={`cv-file-input-${applicationId}`}
        onChange={handleInputChange}
        disabled={disabled || uploadMutation.isPending}
      />

      {/* Dropzone Area */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && !uploadMutation.isPending) {
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer text-center",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/40",
            disabled && "opacity-60 cursor-not-allowed",
          )}
        >
          <div className="p-3 mb-3 rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            Kéo và thả tệp CV PDF vào đây hoặc <span className="text-primary underline">chọn tệp từ máy</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Chỉ nhận định dạng PDF (.pdf), dung lượng tối đa 10 MB.
          </p>
        </div>
      ) : (
        /* Selected File Card */
        <div className="p-4 border rounded-lg bg-card space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-md bg-primary/10 text-primary shrink-0">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • Định dạng PDF
                </p>
              </div>
            </div>

            {!uploadMutation.isPending && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="size-8 text-muted-foreground hover:text-foreground shrink-0"
                title="Chọn tệp khác"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          {/* Upload Progress */}
          {uploadMutation.isPending && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Đang tải tệp lên máy chủ...</span>
                {uploadProgress !== null && <span>{uploadProgress}%</span>}
              </div>
              <Progress value={uploadProgress || 20} className="h-1.5" />
            </div>
          )}
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
          {activeCommand && !uploadMutation.isPending && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSubmit}
              className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <RefreshCw className="size-3" />
              <span>Thử lại</span>
            </Button>
          )}
        </div>
      )}

      {/* Action Footer */}
      {selectedFile && (
        <div className="flex items-center justify-end gap-2 pt-1">
          {uploadMutation.isPending ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelUpload}
              className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <Ban className="size-3.5" />
              <span>Hủy tải lên</span>
            </Button>
          ) : (
            onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 text-xs"
              >
                Đóng
              </Button>
            )
          )}

          <AsyncButton
            size="sm"
            onClick={handleSubmit}
            isPending={uploadMutation.isPending}
            loadingText="Đang tải lên..."
            disabled={disabled || Boolean(validationError)}
            className="h-8 text-xs gap-1.5"
          >
            <UploadCloud className="size-3.5" />
            <span>Tải lên CV Version mới</span>
          </AsyncButton>
        </div>
      )}
    </div>
  );
}

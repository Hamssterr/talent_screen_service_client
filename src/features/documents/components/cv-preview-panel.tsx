"use client";

import * as React from "react";
import {
  FileText,
  Download,
  ExternalLink,
  RefreshCw,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCvPreview } from "../hooks/use-cv-preview";
import { cn } from "@/lib/utils";

export interface CvPreviewPanelProps {
  cvId?: string;
  filename?: string;
  canDownload?: boolean;
  className?: string;
}

export function CvPreviewPanel({
  cvId,
  filename = "document.pdf",
  canDownload = true,
  className,
}: CvPreviewPanelProps) {
  const { previewUrl, isLoading, error, refetch, download } = useCvPreview(cvId, filename);

  return (
    <Card className={cn("flex flex-col h-[650px] overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3 border-b shrink-0 bg-muted/20">
        <div className="flex items-center gap-2 min-w-0">
          <Eye className="size-4 text-primary shrink-0" />
          <div className="min-w-0">
            <CardTitle className="text-xs font-semibold truncate text-foreground" title={filename}>
              {filename}
            </CardTitle>
            <CardDescription className="text-[10px]">
              Bản xem trước tài liệu PDF trực tuyến
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={refetch}
            disabled={isLoading || !cvId}
            className="size-7 text-muted-foreground hover:text-foreground"
            title="Tải lại tài liệu xem trước"
          >
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
          </Button>

          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center size-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Mở tài liệu trong tab mới"
            >
              <ExternalLink className="size-3.5" />
            </a>
          )}

          {canDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => download()}
              disabled={!previewUrl || isLoading}
              className="h-7 text-xs gap-1"
            >
              <Download className="size-3" />
              <span className="hidden sm:inline">Tải về máy</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 relative bg-slate-900/5 dark:bg-slate-950/40">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-xs z-10">
            <Loader2 className="size-6 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground">Đang tải tài liệu PDF an toàn...</p>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-3">
            <div className="p-3 rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <p className="text-xs font-semibold text-foreground">Không thể hiển thị bản xem trước</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={refetch} className="h-8 text-xs gap-1.5">
                <RefreshCw className="size-3.5" />
                <span>Thử lại</span>
              </Button>
              {canDownload && (
                <Button size="sm" onClick={() => download()} className="h-8 text-xs gap-1.5">
                  <Download className="size-3.5" />
                  <span>Tải file gốc</span>
                </Button>
              )}
            </div>
          </div>
        ) : previewUrl ? (
          <object
            data={previewUrl}
            type="application/pdf"
            className="w-full h-full border-none"
          >
            {/* Fallback for browsers without inline PDF viewer */}
            <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3">
              <FileText className="size-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground max-w-xs">
                Trình duyệt của bạn không hỗ trợ nhúng trực tiếp PDF. Bạn có thể tải tệp về để xem trên máy.
              </p>
              {canDownload && (
                <Button size="sm" onClick={() => download()} className="h-8 text-xs gap-1.5">
                  <Download className="size-3.5" />
                  <span>Tải file PDF ({filename})</span>
                </Button>
              )}
            </div>
          </object>
        ) : (
          !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs p-6 text-center">
              <FileText className="size-8 mb-2 opacity-40" />
              <span>Chưa có tài liệu nào được chọn để xem trước.</span>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import {
  FileText,
  Calendar,
  HardDrive,
  CheckCircle2,
  FileCheck2,
  Cpu,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CvVersionDetail } from "../types/cv.types";
import { CvCurrentBadge } from "./cv-current-badge";
import { CvExtractionStatusBadge } from "./cv-extraction-status-badge";
import { CvProfileStatusBadge } from "./cv-profile-status-badge";
import { formatFileSize } from "../utils/file-size";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface CvMetadataProps {
  cv: CvVersionDetail;
  isCurrent?: boolean;
  className?: string;
}

export function CvMetadata({ cv, isCurrent = false, className }: CvMetadataProps) {
  return (
    <Card className={cn("text-xs", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              v{cv.version}
            </span>
            <div>
              <CardTitle className="text-sm font-semibold truncate text-foreground" title={cv.originalFilename}>
                {cv.originalFilename}
              </CardTitle>
              <CardDescription className="text-[11px]">
                Mã định danh: <span className="font-mono">{cv.id.slice(0, 8)}...</span>
              </CardDescription>
            </div>
          </div>

          {isCurrent && <CvCurrentBadge className="shrink-0" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-muted/40 text-xs">
          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <HardDrive className="size-3" />
              <span>Dung lượng:</span>
            </span>
            <p className="font-medium text-foreground">{formatFileSize(cv.sizeBytes)}</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <FileText className="size-3" />
              <span>Số trang tài liệu:</span>
            </span>
            <p className="font-medium text-foreground">
              {cv.pageCount !== null ? `${cv.pageCount} trang` : "Chưa xác định"}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <Calendar className="size-3" />
              <span>Ngày tải lên:</span>
            </span>
            <p className="font-medium text-foreground">{formatDate(cv.createdAt)}</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <Layers className="size-3" />
              <span>Đợt xử lý (OCC):</span>
            </span>
            <p className="font-mono font-medium text-foreground">v{cv.processingVersion}</p>
          </div>
        </div>

        <div className="space-y-2 pt-1 border-t">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <Cpu className="size-3.5 text-primary" />
              <span>Trạng thái trích xuất AI:</span>
            </span>
            <CvExtractionStatusBadge status={cv.extractionStatus} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <FileCheck2 className="size-3.5 text-primary" />
              <span>Trạng thái phê duyệt hồ sơ:</span>
            </span>
            <CvProfileStatusBadge status={cv.profileStatus} version={cv.profileVersion} />
          </div>

          {cv.profileApprovedAt && (
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500" />
                <span>Thời điểm phê duyệt:</span>
              </span>
              <span className="font-medium text-foreground">{formatDate(cv.profileApprovedAt)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

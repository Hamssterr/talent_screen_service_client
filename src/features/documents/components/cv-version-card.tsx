"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, HardDrive, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CvVersionSafe } from "../types/cv.types";
import { CvCurrentBadge } from "./cv-current-badge";
import { CvExtractionStatusBadge } from "./cv-extraction-status-badge";
import { CvProfileStatusBadge } from "./cv-profile-status-badge";
import { formatFileSize } from "../utils/file-size";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface CvVersionCardProps {
  cv: CvVersionSafe;
  isCurrent?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function CvVersionCard({
  cv,
  isCurrent = false,
  isSelected = false,
  onSelect,
  className,
}: CvVersionCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        "transition-all cursor-pointer hover:border-primary/50 text-xs",
        isSelected && "border-primary bg-primary/[0.02] ring-1 ring-primary/40",
        className,
      )}
    >
      <CardContent className="p-3.5 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-foreground bg-muted px-1.5 py-0.5 rounded text-[11px] shrink-0 font-mono">
              v{cv.version}
            </span>
            <p className="font-semibold text-foreground truncate" title={cv.originalFilename}>
              {cv.originalFilename}
            </p>
          </div>
          {isCurrent && <CvCurrentBadge className="shrink-0" />}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <CvExtractionStatusBadge status={cv.extractionStatus} />
          <CvProfileStatusBadge status={cv.profileStatus} version={cv.profileVersion} />
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <HardDrive className="size-3 text-muted-foreground" />
              <span>{formatFileSize(cv.sizeBytes)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3 text-muted-foreground" />
              <span>{formatDate(cv.createdAt)}</span>
            </span>
          </div>

          <Link
            href={`/applications/${cv.applicationId}/cv/${cv.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-primary hover:underline flex items-center gap-0.5 font-medium"
          >
            <span>Chi tiết</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

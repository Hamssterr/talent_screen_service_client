"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Edit,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConflictAlert } from "@/components/feedback/conflict-alert";
import { AsyncButton } from "@/components/shared/async-button";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { useUpdateApplicationMutation } from "../hooks/use-update-application-mutation";
import { Application } from "../types/application.types";
import { ApplicationTimeline } from "./application-timeline";
import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import { getApiError } from "@/lib/api/api-error";
import { cn } from "@/lib/utils";

export interface ApplicationOverviewProps {
  application: Application;
  onRefresh?: () => void;
}

export function ApplicationOverview({ application, onRefresh }: ApplicationOverviewProps) {
  const { user, can } = useSession();

  const [isEditingNotes, setIsEditingNotes] = React.useState(false);
  const [notesInput, setNotesInput] = React.useState("");
  const [hasVersionConflict, setHasVersionConflict] = React.useState(false);
  const [updateError, setUpdateError] = React.useState<string | null>(null);

  const updateMutation = useUpdateApplicationMutation();

  const isTerminal =
    application.status === "approved" ||
    application.status === "rejected" ||
    application.status === "withdrawn";

  const isOwner = Boolean(user?.id && application.owner?.ownerId === user.id);
  const canUpdate =
    !isTerminal && can(Permissions.ApplicationsUpdate) && (isOwner || can(Permissions.ApplicationsManage));

  const handleStartEditing = () => {
    setNotesInput(application.notes || "");
    setHasVersionConflict(false);
    setUpdateError(null);
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    setHasVersionConflict(false);
    setUpdateError(null);

    try {
      await updateMutation.mutateAsync({
        id: application.id,
        data: {
          expectedVersion: application.version,
          notes: notesInput,
        },
      });
      setIsEditingNotes(false);
      onRefresh?.();
    } catch (err) {
      const apiErr = getApiError(err);
      if (apiErr.code === "VERSION_CONFLICT") {
        setHasVersionConflict(true);
      } else {
        setUpdateError(apiErr.message || "Không thể cập nhật ghi chú.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Version conflict banner */}
      {hasVersionConflict && (
        <ConflictAlert
          title="Xung đột phiên bản dữ liệu (Version Conflict)"
          message="Hồ sơ ứng tuyển này vừa được cập nhật bởi một người dùng khác. Vui lòng làm mới trang để nhận thông tin mới nhất trước khi chỉnh sửa tiếp."
          onReload={() => {
            onRefresh?.();
            setHasVersionConflict(false);
          }}
        />
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Cols: Main Info & Notes */}
        <div className="space-y-6 md:col-span-2">
          {/* Candidate & Job Summary Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Candidate Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User className="size-4 text-primary" />
                    <span>Thông tin Ứng viên</span>
                  </CardTitle>
                  <Link
                    href={`/candidates/${application.candidateId}`}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Hồ sơ</span>
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="font-semibold text-foreground text-sm">
                  {application.candidate?.fullName || "Chưa có tên"}
                </p>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" />
                  <span className="truncate">{application.candidate?.email}</span>
                </div>
                {application.candidate?.phone && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="size-3.5 shrink-0" />
                    <span>{application.candidate.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Briefcase className="size-4 text-primary" />
                    <span>Vị trí Tuyển dụng</span>
                  </CardTitle>
                  <Link
                    href={`/jobs/${application.jobId}`}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Chi tiết vị trí</span>
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {application.job?.title || "Vị trí tuyển dụng"}
                  </p>
                  {application.job?.status && (
                    <JobStatusBadge status={application.job.status} />
                  )}
                </div>
                <div className="text-muted-foreground">
                  Mã vị trí: <span className="font-mono text-foreground">{application.jobId.slice(0, 8)}...</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Notes Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <span>Ghi chú Hồ sơ</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Ghi chú nội bộ của chuyên viên tuyển dụng về hồ sơ này
                </CardDescription>
              </div>

              {canUpdate && !isEditingNotes && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartEditing}
                  className="h-8 text-xs gap-1.5"
                >
                  <Edit className="size-3.5" />
                  <span>Chỉnh sửa ghi chú</span>
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {isEditingNotes ? (
                <div className="space-y-3">
                  <Textarea
                    rows={4}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Nhập ghi chú cập nhật cho hồ sơ..."
                    className="text-xs resize-none"
                  />

                  {updateError && (
                    <div className="p-2.5 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-1.5">
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>{updateError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditingNotes(false);
                        setNotesInput(application.notes || "");
                      }}
                      disabled={updateMutation.isPending}
                      className="h-8 text-xs"
                    >
                      Hủy
                    </Button>
                    <AsyncButton
                      size="sm"
                      onClick={handleSaveNotes}
                      isPending={updateMutation.isPending}
                      loadingText="Đang lưu..."
                      className="h-8 text-xs"
                    >
                      Lưu ghi chú
                    </AsyncButton>
                  </div>
                </div>
              ) : (
                <div className="text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                  {application.notes ? (
                    application.notes
                  ) : (
                    <span className="italic text-muted-foreground">
                      Chưa có ghi chú nào được lưu cho hồ sơ này.
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps / Guidance Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                <CheckCircle2 className="size-4" />
                <span>Bước tiếp theo trong quy trình tuyển dụng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card">
                <div>
                  <p className="font-semibold text-foreground">1. Tải lên và trích xuất hồ sơ CV</p>
                  <p className="text-muted-foreground mt-0.5">
                    {application.currentCvVersionId
                      ? "Đã có bản CV được liên kết. Bạn có thể xem hoặc cập nhật phiên bản mới."
                      : "Chưa có bản CV nào. Tải lên CV ứng viên để AI tự động trích xuất thông tin."}
                  </p>
                </div>
                <Link
                  href={`/applications/${application.id}/cv`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 text-xs gap-1 shrink-0")}
                >
                  <span>Chuyển sang tab CV</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Timeline & Metadata */}
        <div className="space-y-6">
          <ApplicationTimeline application={application} />
        </div>
      </div>
    </div>
  );
}

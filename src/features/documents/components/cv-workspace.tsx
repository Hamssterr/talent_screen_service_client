"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  UploadCloud,
  ArrowRight,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { Application } from "@/features/applications/types/application.types";
import { useCvVersionQuery } from "../hooks/use-cv-version-query";
import { useCvVersionsQuery } from "../hooks/use-cv-versions-query";
import { CvVersionSafe } from "../types/cv.types";
import { CvVersionList } from "./cv-version-list";
import { CvMetadata } from "./cv-metadata";
import { CvPreviewPanel } from "./cv-preview-panel";
import { ExtractionStatusPanel } from "./extraction-status-panel";
import { CvProfileView } from "./cv-profile-view";
import { CvProfileForm } from "./cv-profile-form";
import { CvUploadDialog } from "./cv-upload-dialog";
import { ApproveProfileDialog } from "./approve-profile-dialog";
import { DeleteCvDialog } from "./delete-cv-dialog";
import { cn } from "@/lib/utils";

export interface CvWorkspaceProps {
  application: Application;
  initialCvId?: string;
  onRefreshApplication?: () => void;
}

export function CvWorkspace({
  application,
  initialCvId,
  onRefreshApplication,
}: CvWorkspaceProps) {
  const router = useRouter();
  const { user, can } = useSession();

  // Determine permissions & ownership
  const isApplicationOwner = Boolean(user?.id && application.owner?.ownerId === user.id);
  const isShortlisted = application.status === "shortlisted";

  const canUpload =
    isShortlisted && can(Permissions.CvUpload) && (isApplicationOwner || can(Permissions.CvManage));
  const canDownload = can(Permissions.CvDownload);
  const canUpdateProfile =
    isShortlisted && can(Permissions.CvUpdateProfile) && (isApplicationOwner || can(Permissions.CvManage));
  const canApproveProfile =
    isShortlisted && can(Permissions.CvApproveProfile) && (isApplicationOwner || can(Permissions.CvManage));
  const canManage = can(Permissions.CvManage);

  // Active CV selection state
  const [selectedCvId, setSelectedCvId] = React.useState<string | null>(null);

  // Dialog & view states
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isApproveOpen, setIsApproveOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [mobileTab, setMobileTab] = React.useState<"profile" | "preview" | "versions">("profile");

  // Fetch list of versions
  const versionsQuery = useCvVersionsQuery(application.id, { page: 1, limit: 10 });
  const versions = versionsQuery.data?.data || [];

  // If no selectedCvId is set yet, default to initialCvId, currentCvVersionId, or the first version from list
  const effectiveCvId =
    selectedCvId || initialCvId || application.currentCvVersionId || (versions.length > 0 ? versions[0].id : undefined);

  // Fetch active CV detail
  const cvDetailQuery = useCvVersionQuery(effectiveCvId, {
    enabled: Boolean(effectiveCvId),
  });

  const activeCv = cvDetailQuery.data;
  const isCurrentCv = Boolean(activeCv && application.currentCvVersionId === activeCv.id);

  // Handlers
  const handleSelectCv = (cv: CvVersionSafe) => {
    setSelectedCvId(cv.id);
    setIsEditingProfile(false);
  };

  const handleUploadSuccess = (newCv: CvVersionSafe) => {
    setSelectedCvId(newCv.id);
    setIsEditingProfile(false);
    onRefreshApplication?.();
    versionsQuery.refetch();
  };

  const handleDeleteSuccess = () => {
    setSelectedCvId(null);
    setIsEditingProfile(false);
    onRefreshApplication?.();
    versionsQuery.refetch();
    router.replace(`/applications/${application.id}/cv`);
  };

  const handleApproveSuccess = () => {
    cvDetailQuery.refetch();
    versionsQuery.refetch();
    onRefreshApplication?.();
  };

  // 1. Loading state
  if (versionsQuery.isLoading && !versions.length) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] md:col-span-2 rounded-lg" />
        </div>
      </div>
    );
  }

  // 2. Empty state: No CVs uploaded yet
  if (versions.length === 0 && !versionsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <FileText className="size-5" />
              <CardTitle className="text-base font-semibold">Tài liệu & Hồ sơ CV</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Quản lý tệp CV PDF, trích xuất cấu trúc hồ sơ tự động bằng AI và phê duyệt hồ sơ ứng viên.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={FileText}
              title="Hồ sơ ứng tuyển chưa có CV"
              description="Ứng viên và hồ sơ ứng tuyển đã được tạo thành công nhưng chưa có tệp CV PDF nào được tải lên để bắt đầu quy trình trích xuất và sơ loại."
              primaryAction={
                canUpload ? (
                  <Button size="sm" onClick={() => setIsUploadOpen(true)} className="h-8 text-xs gap-1.5">
                    <UploadCloud className="size-3.5" />
                    <span>Tải lên tài liệu CV (PDF)</span>
                  </Button>
                ) : undefined
              }
              className="py-12"
            />
          </CardContent>
        </Card>

        {/* Upload Dialog */}
        <CvUploadDialog
          applicationId={application.id}
          open={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          onSuccess={handleUploadSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Next Step CTA Banner when current CV is approved */}
      {activeCv && isCurrentCv && activeCv.profileStatus === "approved" && (
        <Card className="border-emerald-500/30 bg-emerald-500/[0.04]">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-xs text-foreground">
                  Hồ sơ CV hiện tại đã sẵn sàng cho bước tiếp theo
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Bản CV <span className="font-semibold text-foreground font-mono">v{activeCv.version}</span> đã được phê duyệt chính thức. Bạn có thể tiến hành tạo Bộ câu hỏi phỏng vấn (Question Set).
                </p>
              </div>
            </div>

            <Link
              href={`/applications/${application.id}/questions`}
              className="shrink-0"
            >
              <Button size="sm" className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                <span>Tạo Bộ câu hỏi phỏng vấn</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Main Workspace Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column (3 cols): Version List & CV Metadata */}
        <div className="space-y-6 lg:col-span-4 xl:col-span-3">
          {activeCv && (
            <CvMetadata
              cv={activeCv}
              isCurrent={isCurrentCv}
            />
          )}

          <CvVersionList
            applicationId={application.id}
            currentCvVersionId={application.currentCvVersionId}
            selectedCvId={effectiveCvId}
            onSelectCv={handleSelectCv}
            onOpenUpload={() => setIsUploadOpen(true)}
            canUpload={canUpload}
            isShortlisted={isShortlisted}
          />

          {activeCv && canManage && (
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
                className="w-full h-8 text-xs gap-1.5 text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <Trash2 className="size-3.5" />
                <span>Xóa phiên bản v{activeCv.version} (Admin)</span>
              </Button>
            </div>
          )}
        </div>

        {/* Right Column (8 or 9 cols): PDF Preview + Extraction + Profile */}
        <div className="space-y-6 lg:col-span-8 xl:col-span-9">
          {cvDetailQuery.isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-[500px] w-full rounded-lg" />
            </div>
          ) : activeCv ? (
            <div className="space-y-6">
              {/* Extraction Status & Action Banner */}
              <ExtractionStatusPanel
                cv={activeCv}
                canUpdateProfile={canUpdateProfile}
                isShortlisted={isShortlisted}
                onStartManualEdit={() => setIsEditingProfile(true)}
                onRefresh={() => {
                  cvDetailQuery.refetch();
                  versionsQuery.refetch();
                }}
              />

              {/* Segmented Control / Tabs for smaller viewports */}
              <div className="flex sm:hidden items-center justify-center p-1 rounded-lg bg-muted text-xs">
                <button
                  type="button"
                  onClick={() => setMobileTab("profile")}
                  className={cn(
                    "flex-1 py-1.5 font-medium rounded-md transition-colors",
                    mobileTab === "profile" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground",
                  )}
                >
                  Hồ sơ trích xuất
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab("preview")}
                  className={cn(
                    "flex-1 py-1.5 font-medium rounded-md transition-colors",
                    mobileTab === "preview" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground",
                  )}
                >
                  Bản xem trước PDF
                </button>
              </div>

              {/* Desktop / Responsive Split Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* PDF Viewer Panel (always visible on desktop, tabbed on mobile) */}
                <div className={cn("space-y-4", mobileTab !== "preview" && "hidden sm:block")}>
                  <CvPreviewPanel
                    cvId={activeCv.id}
                    filename={activeCv.originalFilename}
                    canDownload={canDownload}
                  />
                </div>

                {/* Profile View / Form Panel */}
                <div className={cn("space-y-4", mobileTab !== "profile" && "hidden sm:block")}>
                  {isEditingProfile ? (
                    <CvProfileForm
                      cv={activeCv}
                      onSuccess={() => {
                        setIsEditingProfile(false);
                        cvDetailQuery.refetch();
                        versionsQuery.refetch();
                      }}
                      onCancel={() => setIsEditingProfile(false)}
                      onRefresh={() => cvDetailQuery.refetch()}
                    />
                  ) : (
                    <CvProfileView
                      profile={activeCv.profileJson}
                      profileStatus={activeCv.profileStatus}
                      canEdit={canUpdateProfile && !cvDetailQuery.isFetching}
                      canApprove={
                        canApproveProfile &&
                        activeCv.profileStatus === "draft" &&
                        Boolean(activeCv.profileJson) &&
                        activeCv.extractionStatus !== "processing"
                      }
                      onEdit={() => setIsEditingProfile(true)}
                      onApprove={() => setIsApproveOpen(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                <EmptyState
                  icon={AlertCircle}
                  title="Không tìm thấy thông tin phiên bản CV"
                  description="Phiên bản CV này không tồn tại hoặc bạn không có quyền truy cập."
                  primaryAction={
                    <Button size="sm" onClick={() => setSelectedCvId(null)} className="h-8 text-xs">
                      Quay lại danh sách CV
                    </Button>
                  }
                  className="py-6"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <CvUploadDialog
        applicationId={application.id}
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onSuccess={handleUploadSuccess}
      />

      {/* Approve Dialog */}
      {activeCv && (
        <ApproveProfileDialog
          cv={activeCv}
          open={isApproveOpen}
          onOpenChange={setIsApproveOpen}
          onSuccess={handleApproveSuccess}
        />
      )}

      {/* Delete Dialog */}
      {activeCv && (
        <DeleteCvDialog
          cv={activeCv}
          isCurrent={isCurrentCv}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Lock, Trash2, Calendar, User, Clock } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { useJobQuery } from "../hooks/use-job-query";
import { getJobActionCapabilities } from "../utils/job-state";
import { JobStatusBadge } from "./job-status-badge";
import { CloseJobDialog } from "./close-job-dialog";
import { DeleteJobDialog } from "./delete-job-dialog";
import { cn } from "@/lib/utils";

export interface JobDetailProps {
  jobId: string;
}

export function JobDetail({ jobId }: JobDetailProps) {
  const router = useRouter();
  const { user, can } = useSession();
  const { data: job, isLoading, isError, error, refetch } = useJobQuery(jobId);

  const [isCloseDialogOpen, setIsCloseDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <ErrorState
        title="Không thể tải thông tin vị trí"
        message={error instanceof Error ? error.message : "Đã có lỗi xảy ra khi tải dữ liệu."}
        onRetry={() => refetch()}
      />
    );
  }

  const isOwner = user?.id === job.ownerId;
  const capabilities = getJobActionCapabilities({
    job,
    currentUserId: user?.id,
    hasReadPermission: can(Permissions.JobsRead),
    hasUpdatePermission: can(Permissions.JobsUpdate),
    hasClosePermission: can(Permissions.JobsClose),
    hasManagePermission: can(Permissions.JobsManage),
  });

  const handleCloseSuccess = () => {
    setIsCloseDialogOpen(false);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    router.push("/jobs");
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Danh sách vị trí
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {capabilities.canEdit && (
            <Link
              href={`/jobs/${job.id}/edit`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Edit className="mr-1.5 h-4 w-4" />
              Chỉnh sửa
            </Link>
          )}

          {capabilities.canClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCloseDialogOpen(true)}
              className="text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              <Lock className="mr-1.5 h-4 w-4" />
              Đóng tuyển dụng
            </Button>
          )}

          {capabilities.canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Xóa
            </Button>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <JobStatusBadge status={job.status} />
            {isOwner && (
              <Badge variant="outline" className="border-primary/30 text-primary">
                Bạn tạo
              </Badge>
            )}
            <Badge variant="secondary" className="font-mono text-xs">
              v{job.version}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
            {job.title}
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {isOwner ? "Bạn (Chủ sở hữu)" : `Tác giả: ${job.ownerId.slice(0, 8)}...`}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Tạo lúc: {new Date(job.createdAt).toLocaleString("vi-VN")}
            </span>
            {job.updatedAt && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Cập nhật: {new Date(job.updatedAt).toLocaleString("vi-VN")}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Cols: Description & Criteria */}
        <div className="space-y-6 md:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mô tả công việc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {job.description || (
                  <span className="italic text-muted-foreground">Không có mô tả chi tiết.</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Tiêu chí đánh giá</CardTitle>
                  <CardDescription className="text-xs">
                    Khung tiêu chí dùng cho sàng lọc CV, phỏng vấn và đánh giá ứng viên
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="font-medium">
                  {job.evaluationCriteria?.length ?? 0} tiêu chí
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {!job.evaluationCriteria || job.evaluationCriteria.length === 0 ? (
                <EmptyState
                  title="Chưa có tiêu chí đánh giá"
                  description="Vị trí này chưa được thiết lập bộ tiêu chí đánh giá cụ thể."
                  className="py-8"
                />
              ) : (
                <div className="space-y-4">
                  {job.evaluationCriteria.map((criterion, idx) => (
                    <div
                      key={criterion.id || `crit-${idx}`}
                      className="rounded-lg border bg-card p-4 shadow-sm transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {idx + 1}
                          </span>
                          <h4 className="font-semibold text-foreground">{criterion.name}</h4>
                        </div>
                      </div>

                      {criterion.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {criterion.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Skills & Metadata */}
        <div className="space-y-6">
          {/* Required Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kỹ năng yêu cầu</CardTitle>
              <CardDescription className="text-xs">
                {job.requiredSkills?.length ?? 0} kỹ năng
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!job.requiredSkills || job.requiredSkills.length === 0 ? (
                <p className="text-xs italic text-muted-foreground">Chưa có kỹ năng nào được yêu cầu.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="px-2.5 py-1 text-xs font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin tổng quan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs text-muted-foreground">Mã định danh</span>
                <span className="font-mono text-xs font-medium">{job.id.slice(0, 8)}...</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs text-muted-foreground">Trạng thái</span>
                <JobStatusBadge status={job.status} />
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs text-muted-foreground">Phiên bản</span>
                <span className="font-mono text-xs font-medium">v{job.version}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs text-muted-foreground">Người tạo</span>
                <span className="text-xs font-medium truncate max-w-[150px]">
                  {isOwner ? "Bạn" : `${job.ownerId.slice(0, 8)}...`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ngày tạo</span>
                <span className="text-xs">
                  {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {capabilities.canClose && (
        <CloseJobDialog
          job={job}
          open={isCloseDialogOpen}
          onOpenChange={setIsCloseDialogOpen}
          onSuccess={handleCloseSuccess}
        />
      )}

      {capabilities.canDelete && (
        <DeleteJobDialog
          job={job}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

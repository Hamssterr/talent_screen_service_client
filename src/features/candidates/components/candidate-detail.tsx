"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { useCandidateQuery } from "../hooks/use-candidate-query";
import { CandidateSummaryCard } from "./candidate-summary-card";
import { CandidateApplications } from "./candidate-applications";
import { DeleteCandidateDialog } from "./delete-candidate-dialog";
import { cn } from "@/lib/utils";

export interface CandidateDetailProps {
  candidateId: string;
}

export function CandidateDetail({ candidateId }: CandidateDetailProps) {
  const router = useRouter();
  const { user, can } = useSession();
  const { data: candidate, isLoading, isError, error, refetch } = useCandidateQuery(candidateId);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const hasUpdatePermission = can(Permissions.CandidatesUpdate);
  const hasManagePermission = can(Permissions.CandidatesManage);
  const hasAppCreatePermission = can(Permissions.ApplicationsCreate);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 w-full rounded-xl md:col-span-1" />
          <Skeleton className="h-96 w-full rounded-xl md:col-span-2" />
        </div>
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <ErrorState
        title="Không tìm thấy thông tin ứng viên"
        message={
          error instanceof Error
            ? error.message
            : "Ứng viên này không tồn tại hoặc bạn không có quyền truy cập."
        }
        onRetry={() => refetch()}
      />
    );
  }

  const isOwner = Boolean(user?.id && candidate.owner?.ownerId === user.id);
  const canEdit = hasUpdatePermission && (isOwner || hasManagePermission);
  const canDelete = hasManagePermission;

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    router.push("/candidates");
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/candidates"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground hover:text-foreground gap-1.5 self-start",
          )}
        >
          <ArrowLeft className="size-4" />
          <span>Danh sách ứng viên</span>
        </Link>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {hasAppCreatePermission && (
            <Link
              href={`/applications/new?candidateId=${candidate.id}`}
              className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
            >
              <Plus className="size-3.5" />
              <span>Nộp hồ sơ ứng tuyển</span>
            </Link>
          )}

          {canEdit && (
            <Link
              href={`/candidates/${candidate.id}/edit`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
            >
              <Edit className="size-3.5" />
              <span>Chỉnh sửa</span>
            </Link>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>Xóa</span>
            </Button>
          )}
        </div>
      </div>

      {/* Detail Layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Col: Summary Card */}
        <div className="md:col-span-1">
          <CandidateSummaryCard candidate={candidate} />
        </div>

        {/* Right Col: Applications */}
        <div className="md:col-span-2">
          <CandidateApplications
            candidateId={candidate.id}
            candidateName={candidate.fullName}
          />
        </div>
      </div>

      {/* Delete Dialog */}
      {canDelete && (
        <DeleteCandidateDialog
          candidate={candidate}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

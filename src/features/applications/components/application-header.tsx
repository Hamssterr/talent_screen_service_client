"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, User, Briefcase, Calendar, Lock, Trash2, AlertCircle, Clock } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { Application } from "../types/application.types";
import { ApplicationStatusBadge } from "./application-status-badge";
import { WithdrawApplicationDialog } from "./withdraw-application-dialog";
import { DeleteApplicationDialog } from "./delete-application-dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface ApplicationHeaderProps {
  application: Application;
  onRefresh?: () => void;
}

export function ApplicationHeader({ application, onRefresh }: ApplicationHeaderProps) {
  const router = useRouter();
  const { user, can } = useSession();

  const [isWithdrawOpen, setIsWithdrawOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const isTerminal =
    application.status === "approved" ||
    application.status === "rejected" ||
    application.status === "withdrawn";

  const isOwner = Boolean(user?.id && application.owner?.ownerId === user.id);
  const canWithdraw =
    !isTerminal && can(Permissions.ApplicationsWithdraw) && (isOwner || can(Permissions.ApplicationsManage));
  const canDelete = can(Permissions.ApplicationsManage);

  const handleWithdrawSuccess = () => {
    setIsWithdrawOpen(false);
    onRefresh?.();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false);
    router.push("/applications");
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/applications"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground hover:text-foreground gap-1.5 self-start",
          )}
        >
          <ArrowLeft className="size-4" />
          <span>Danh sách hồ sơ</span>
        </Link>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {canWithdraw && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWithdrawOpen(true)}
              className="text-amber-600 hover:text-amber-700 dark:text-amber-400 gap-1.5"
            >
              <Lock className="size-3.5" />
              <span>Rút hồ sơ</span>
            </Button>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>Xóa</span>
            </Button>
          )}
        </div>
      </div>

      {/* Terminal Banner */}
      {isTerminal && (
        <div className="rounded-lg border border-neutral-300 bg-neutral-100/80 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/60 text-xs flex items-start gap-2.5 text-muted-foreground">
          <AlertCircle className="size-4 shrink-0 text-foreground/80 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground">Hồ sơ đã ở trạng thái kết thúc ({application.status}).</span>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {application.status === "withdrawn"
                ? `Hồ sơ đã được rút${application.withdrawReason ? `: "${application.withdrawReason}"` : ""}. Mọi thao tác chỉnh sửa và phỏng vấn đã bị khóa.`
                : application.status === "approved"
                ? "Hồ sơ đã được phê duyệt quyết định tuyển dụng."
                : "Hồ sơ đã kết thúc quy trình đánh giá tuyển dụng."}
            </p>
          </div>
        </div>
      )}

      {/* Main Identity Card */}
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <ApplicationStatusBadge status={application.status} />
            {isOwner && (
              <Badge variant="outline" className="border-primary/30 text-primary">
                Bạn phụ trách
              </Badge>
            )}
            <Badge variant="secondary" className="font-mono text-xs">
              v{application.version}
            </Badge>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
              {application.candidate?.fullName || "Ứng viên"}
              <span className="mx-2 text-muted-foreground font-normal">/</span>
              <span className="text-primary font-semibold">
                {application.job?.title || "Vị trí tuyển dụng"}
              </span>
            </CardTitle>
          </div>

          <CardDescription className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {application.candidate?.email && (
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                {application.candidate.email}
              </span>
            )}
            {application.owner && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-3.5" />
                HR: {application.owner.name}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Nộp ngày: {new Date(application.createdAt).toLocaleDateString("vi-VN")}
            </span>
            {application.updatedAt && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                Cập nhật: {new Date(application.updatedAt).toLocaleDateString("vi-VN")}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Dialogs */}
      {canWithdraw && (
        <WithdrawApplicationDialog
          application={application}
          open={isWithdrawOpen}
          onOpenChange={setIsWithdrawOpen}
          onSuccess={handleWithdrawSuccess}
        />
      )}

      {canDelete && (
        <DeleteApplicationDialog
          application={application}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";

import { DetailField } from "@/components/shared/detail-field";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCan } from "@/features/authorization/hooks/use-can";
import { Permissions } from "@/features/authorization/permission.constants";
import { useRemoveUserRoleMutation } from "../hooks/use-admin-users";
import { AdminUserDetail } from "../types/admin.types";
import { RoleAssignmentDialog } from "./role-assignment-dialog";
import { ResendInvitationDialog } from "./resend-invitation-dialog";
import { DisableUserDialog } from "./disable-user-dialog";
import {
  ArrowLeft,
  Shield,
  MailCheck,
  UserX,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Mail,
  User as UserIcon,
  Fingerprint,
} from "lucide-react";

export interface UserDetailProps {
  user: AdminUserDetail;
}

const statusToneMap: Record<
  string,
  { tone: "success" | "warning" | "neutral" | "danger"; label: string }
> = {
  active: { tone: "success", label: "Đang hoạt động" },
  pending: { tone: "warning", label: "Chờ kích hoạt" },
  inactive: { tone: "neutral", label: "Không hoạt động" },
  suspended: { tone: "danger", label: "Bị khóa" },
};

export function UserDetail({ user }: UserDetailProps) {
  const canUpdateUser = useCan(Permissions.UsersUpdate);

  const canDisableUser = useCan(Permissions.UsersDisable);
  const canManageUserRoles = useCan(Permissions.UserRolesManage);


  const [roleAssignOpen, setRoleAssignOpen] = React.useState(false);
  const [resendOpen, setResendOpen] = React.useState(false);
  const [disableOpen, setDisableOpen] = React.useState(false);
  const [roleToRemove, setRoleToRemove] = React.useState<{ key: string; name: string } | null>(null);

  const removeRoleMutation = useRemoveUserRoleMutation();

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Chưa có";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const statusMeta = statusToneMap[user.status] || {
    tone: "neutral",
    label: user.status,
  };

  const currentRoleKeys = user.roles.map((r) => r.key);

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.name}
        description={`Hồ sơ chi tiết và phân quyền quản trị của tài khoản ${user.email}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/users"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ArrowLeft className="mr-1.5 size-4" />
              Quay lại danh sách
            </Link>

            {canManageUserRoles && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoleAssignOpen(true)}
              >
                <Shield className="mr-1.5 size-4 text-primary" />
                Gán vai trò
              </Button>
            )}

            {canUpdateUser && user.status === "pending" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResendOpen(true)}
              >
                <MailCheck className="mr-1.5 size-4 text-warning" />
                Gửi lại kích hoạt
              </Button>
            )}

            {canDisableUser && user.status === "active" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDisableOpen(true)}
              >
                <UserX className="mr-1.5 size-4" />
                Vô hiệu hóa
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: User Identity Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Thông tin tài khoản</CardTitle>
                  <CardDescription className="text-xs">
                    Chi tiết định danh và trạng thái truy cập hệ thống
                  </CardDescription>
                </div>
                <StatusBadge tone={statusMeta.tone} label={statusMeta.label} />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailField
                  label="Họ và tên"
                  value={user.name}
                  icon={<UserIcon className="size-3.5" />}
                />
                <DetailField
                  label="Địa chỉ Email"
                  value={user.email}
                  icon={<Mail className="size-3.5" />}
                />
                <DetailField
                  label="Mã định danh (ID)"
                  value={<span className="font-mono text-xs">{user.id}</span>}
                  icon={<Fingerprint className="size-3.5" />}
                />
                <DetailField
                  label="Lần đăng nhập gần nhất"
                  value={formatDate(user.lastLoginAt)}
                  icon={<Clock className="size-3.5" />}
                />
                <DetailField
                  label="Ngày tạo tài khoản"
                  value={formatDate(user.createdAt)}
                  icon={<Calendar className="size-3.5" />}
                />
                <DetailField
                  label="Cập nhật lần cuối"
                  value={formatDate(user.updatedAt)}
                  icon={<Calendar className="size-3.5" />}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Assigned Roles Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Vai trò áp dụng</CardTitle>
                  <CardDescription className="text-xs">
                    Các nhóm quyền hạn hiện hành của tài khoản
                  </CardDescription>
                </div>
                {canManageUserRoles && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setRoleAssignOpen(true)}
                    className="h-8 px-2 text-xs"
                  >
                    <Plus className="mr-1 size-3.5" />
                    Thêm
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {user.roles.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  Chưa gán vai trò nào cho người dùng này.
                </div>
              ) : (
                <div className="space-y-3">
                  {user.roles.map((role) => (
                    <div
                      key={role.id || role.key}
                      className="flex items-start justify-between p-3 rounded-xl border border-border/60 bg-muted/20"
                    >
                      <div className="space-y-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-foreground">
                            {role.name}
                          </span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                            {role.key}
                          </Badge>
                        </div>
                        {role.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {role.description}
                          </p>
                        )}
                      </div>

                      {canManageUserRoles && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRoleToRemove({ key: role.key, name: role.name })}
                          className="size-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Gỡ vai trò"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Role Assignment Dialog */}
      <RoleAssignmentDialog
        open={roleAssignOpen}
        onOpenChange={setRoleAssignOpen}
        userId={user.id}
        userName={user.name}
        currentRoleKeys={currentRoleKeys}
      />

      {/* Resend Invitation Dialog */}
      <ResendInvitationDialog
        open={resendOpen}
        onOpenChange={setResendOpen}
        userId={user.id}
        userEmail={user.email}
      />

      {/* Disable User Dialog */}
      <DisableUserDialog
        open={disableOpen}
        onOpenChange={setDisableOpen}
        userId={user.id}
        userName={user.name}
      />

      {/* Remove Role Confirmation Dialog */}
      {roleToRemove && (
        <ConfirmActionDialog
          open={Boolean(roleToRemove)}
          onOpenChange={(open) => !open && setRoleToRemove(null)}
          title={`Gỡ vai trò ${roleToRemove.name}?`}
          description={`Người dùng ${user.name} sẽ mất toàn bộ các quyền hạn liên quan đến vai trò ${roleToRemove.name} (${roleToRemove.key}).`}
          confirmLabel="Gỡ vai trò"
          cancelLabel="Hủy"
          variant="destructive"
          isPending={removeRoleMutation.isPending}
          onConfirm={async () => {
            await removeRoleMutation.mutateAsync({
              id: user.id,
              roleKey: roleToRemove.key,
            });
            setRoleToRemove(null);
          }}
        />
      )}
    </div>
  );
}

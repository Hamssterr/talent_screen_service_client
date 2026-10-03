"use client";

import * as React from "react";
import { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  LogOut,
  PowerOff,
  UserPlus,
  Briefcase,
  RefreshCw,
  Sparkles,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { PermissionGate } from "@/features/authorization/components/permission-gate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { UserProfileCard } from "@/components/UserProfileCard";

export default function DashboardPage() {
  const { user, authorization, logout, logoutAll, refreshSession, can } =
    useSession();

  const [logoutAllOpen, setLogoutAllOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const canInviteUsers = can(Permissions.UsersInvite);
  const canCreateJobs = can(Permissions.JobsCreate);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Workspace Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-xs">
              TS
            </div>
            <div>
              <h1 className="font-semibold text-sm leading-none text-foreground flex items-center gap-2">
                TalentScreen Workspace
                <Badge variant="peach" className="text-[10px] py-0 px-1.5 h-4">
                  Todo 02 Verified
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Authentication & Authorization Foundation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle variant="compact" />
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const token = await refreshSession();
                if (token) {
                  toast.success("Đã làm mới phiên và cập nhật quyền hạn!");
                }
              }}>
              <RefreshCw className="size-3.5 mr-1" />
              <span className="hidden sm:inline">Làm mới phiên</span>
            </Button>
            <Button
              variant="destructive-outline"
              size="sm"
              onClick={() => logout()}>
              <LogOut className="size-3.5 mr-1" />
              <span>Đăng xuất</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 md:px-8 py-8 space-y-8">
        <PageHeader
          title={`Xin chào, ${user?.name || user?.email.split("@")[0] || "Người dùng"}!`}
          description="Hệ thống xác thực phiên làm việc an toàn với HttpOnly refresh cookie và quyền hạn động (Effective Permissions) từ backend NestJS."
          actions={
            <div className="flex items-center gap-2">
              <Dialog
                open={changePasswordOpen}
                onOpenChange={setChangePasswordOpen}>
                <DialogTrigger
                  render={
                    <Button variant="outline" size="sm">
                      <Lock className="size-3.5 mr-1.5" />
                      Đổi mật khẩu
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Đổi mật khẩu tài khoản</DialogTitle>
                    <DialogDescription>
                      Thiết lập mật khẩu mới để bảo vệ tài khoản của bạn.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2">
                    <ChangePasswordForm
                      onSuccess={() => setChangePasswordOpen(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setLogoutAllOpen(true)}>
                <PowerOff className="size-3.5 mr-1.5" />
                Đăng xuất mọi thiết bị
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: User Profile Card */}
          <div className="lg:col-span-1">
            {user && (
              <UserProfileCard
                user={user}
                authorization={authorization || undefined}
              />
            )}
          </div>

          {/* Column 2 & 3: Authorization & Permission Gates showcase */}
          <div className="lg:col-span-2 space-y-6">
            {/* Permission Gates Demo */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    Thao tác theo Quyền hạn (PermissionGate Demo)
                  </span>
                  <Badge variant="ai" className="text-xs">
                    Runtime RBAC
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Các nút bấm và tác vụ dưới đây được kiểm soát động theo quyền
                  hạn thực tế (Effective Permissions) của tài khoản:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <PermissionGate
                    permission={Permissions.UsersInvite}
                    fallback={
                      <div className="text-xs text-muted-foreground italic flex items-center gap-1.5 p-2 rounded-lg bg-muted/40 border border-border">
                        <Lock className="size-3.5" />
                        (Ẩn: Bạn không có quyền mời người dùng mới)
                      </div>
                    }>
                    <Button
                      size="sm"
                      onClick={() =>
                        toast.success(
                          "Đã mở modal mời người dùng mới (Todo 03)!",
                        )
                      }>
                      <UserPlus className="size-3.5 mr-1.5" />
                      Mời người dùng ({Permissions.UsersInvite})
                    </Button>
                  </PermissionGate>

                  <PermissionGate
                    permission={Permissions.JobsCreate}
                    fallback={
                      <div className="text-xs text-muted-foreground italic flex items-center gap-1.5 p-2 rounded-lg bg-muted/40 border border-border">
                        <Lock className="size-3.5" />
                        (Ẩn: Bạn không có quyền tạo vị trí tuyển dụng)
                      </div>
                    }>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        toast.success("Đã mở form tạo Job (Todo 04)!")
                      }>
                      <Briefcase className="size-3.5 mr-1.5" />
                      Tạo vị trí tuyển dụng ({Permissions.JobsCreate})
                    </Button>
                  </PermissionGate>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-1.5">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-ai" />
                    Trạng thái kiểm tra trực tiếp qua hook `can(...)`:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center justify-between p-2 rounded-md bg-background border border-border">
                      <span className="font-mono text-[11px]">
                        {Permissions.UsersInvite}
                      </span>
                      <Badge
                        variant={canInviteUsers ? "success" : "danger"}
                        className="text-[10px]">
                        {canInviteUsers ? "Cho phép" : "Từ chối"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md bg-background border border-border">
                      <span className="font-mono text-[11px]">
                        {Permissions.JobsCreate}
                      </span>
                      <Badge
                        variant={canCreateJobs ? "success" : "danger"}
                        className="text-[10px]">
                        {canCreateJobs ? "Cho phép" : "Từ chối"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Effective Permissions List */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <KeyRound className="size-5 text-primary" />
                    Danh sách quyền hạn hiệu lực (
                    {authorization?.permissions.length || 0})
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    GET /api/v1/authorization/me
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Toàn bộ quyền hạn được tính toán gộp từ tất cả vai trò (Roles)
                  được gán trong hệ thống:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {authorization?.permissions &&
                authorization.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto p-1">
                    {authorization.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-xs font-mono">
                        {perm}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Tài khoản hiện chưa được phân quyền hạn nào.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Logout all devices confirmation dialog */}
      <ConfirmActionDialog
        open={logoutAllOpen}
        onOpenChange={setLogoutAllOpen}
        title="Đăng xuất khỏi tất cả thiết bị?"
        description="Thao tác này sẽ thu hồi toàn bộ Refresh Token của tài khoản trên máy chủ. Bạn sẽ cần đăng nhập lại trên tất cả các trình duyệt và thiết bị."
        confirmLabel="Đăng xuất tất cả"
        variant="destructive"
        onConfirm={async () => {
          await logoutAll();
        }}
      />
    </div>
  );
}

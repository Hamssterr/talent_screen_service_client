"use client";

import * as React from "react";
import {
  ShieldCheck,
  KeyRound,
  UserPlus,
  Briefcase,
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
import { UserProfileCard } from "@/components/UserProfileCard";
import { useLogoutMutation } from "@/features/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { user, authorization, can } = useSession();
  const logoutMutation = useLogoutMutation({
    redirectTo: "/",
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
    },
  });

  const canInviteUsers = can(Permissions.UsersInvite);
  const canCreateJobs = can(Permissions.JobsCreate);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Xin chào, ${user?.name || user?.email?.split("@")[0] || "Người dùng"}!`}
        description="Chào mừng bạn đến với TalentScreen Workspace. Nền tảng tuyển dụng & đánh giá năng lực ứng viên toàn diện."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: User Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          {user && (
            <UserProfileCard
              user={user}
              authorization={authorization || undefined}
            />
          )}
          <Button onClick={handleLogout}>Đăng xuất</Button>
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
                      toast.success("Đã mở modal mời người dùng mới!")
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
    </div>
  );
}

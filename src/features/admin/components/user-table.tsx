"use client";

import * as React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { useCan } from "@/features/authorization/hooks/use-can";
import { Permissions } from "@/features/authorization/permission.constants";
import { AdminUserListItem } from "../types/admin.types";
import { RoleAssignmentDialog } from "./role-assignment-dialog";
import { ResendInvitationDialog } from "./resend-invitation-dialog";
import { DisableUserDialog } from "./disable-user-dialog";
import {
  MoreHorizontal,
  Eye,
  Shield,
  MailCheck,
  UserX,
} from "lucide-react";

export interface UserTableProps {
  users: AdminUserListItem[];
  isLoading?: boolean;
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

export function UserTable({ users }: UserTableProps) {

  const canUpdateUser = useCan(Permissions.UsersUpdate);
  const canDisableUser = useCan(Permissions.UsersDisable);
  const canManageUserRoles = useCan(Permissions.UserRolesManage);


  const [selectedUserForRoles, setSelectedUserForRoles] =
    React.useState<AdminUserListItem | null>(null);
  const [selectedUserForResend, setSelectedUserForResend] =
    React.useState<AdminUserListItem | null>(null);
  const [selectedUserForDisable, setSelectedUserForDisable] =
    React.useState<AdminUserListItem | null>(null);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Chưa có";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <DataTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Thành viên</TableHead>
              <TableHead className="w-[140px]">Trạng thái</TableHead>
              <TableHead className="min-w-[200px]">Vai trò</TableHead>
              <TableHead className="w-[160px]">Đăng nhập gần nhất</TableHead>
              <TableHead className="w-[140px]">Ngày tạo</TableHead>
              <TableHead className="w-[70px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  Không tìm thấy thành viên nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const statusMeta = statusToneMap[user.status] || {
                  tone: "neutral",
                  label: user.status,
                };

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
                        >
                          {user.name}
                        </Link>
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-[240px]">
                          {user.email}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        tone={statusMeta.tone}
                        label={statusMeta.label}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Chưa gán vai trò
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(user.lastLoginAt)}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-border/60 hover:bg-accent text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Tùy chọn thao tác"
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem render={<Link href={`/admin/users/${user.id}`} />}>
                            <Eye className="size-4 text-muted-foreground" />
                            <span>Xem chi tiết</span>
                          </DropdownMenuItem>

                          {canManageUserRoles && (
                            <DropdownMenuItem
                              onClick={() => setSelectedUserForRoles(user)}
                              className="cursor-pointer"
                            >
                              <Shield className="size-4 text-muted-foreground" />
                              <span>Gán vai trò</span>
                            </DropdownMenuItem>
                          )}

                          {canUpdateUser && user.status === "pending" && (
                            <DropdownMenuItem
                              onClick={() => setSelectedUserForResend(user)}
                              className="cursor-pointer"
                            >
                              <MailCheck className="size-4 text-muted-foreground" />
                              <span>Gửi lại kích hoạt</span>
                            </DropdownMenuItem>
                          )}

                          {canDisableUser && user.status === "active" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setSelectedUserForDisable(user)}
                                variant="destructive"
                                className="cursor-pointer"
                              >
                                <UserX className="size-4 text-destructive" />
                                <span>Vô hiệu hóa</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </DataTableShell>

      {/* Role Assignment Dialog */}
      {selectedUserForRoles && (
        <RoleAssignmentDialog
          open={Boolean(selectedUserForRoles)}
          onOpenChange={(open) => !open && setSelectedUserForRoles(null)}
          userId={selectedUserForRoles.id}
          userName={selectedUserForRoles.name}
          currentRoleKeys={selectedUserForRoles.roles}
        />
      )}

      {/* Resend Invitation Dialog */}
      {selectedUserForResend && (
        <ResendInvitationDialog
          open={Boolean(selectedUserForResend)}
          onOpenChange={(open) => !open && setSelectedUserForResend(null)}
          userId={selectedUserForResend.id}
          userEmail={selectedUserForResend.email}
        />
      )}

      {/* Disable User Dialog */}
      {selectedUserForDisable && (
        <DisableUserDialog
          open={Boolean(selectedUserForDisable)}
          onOpenChange={(open) => !open && setSelectedUserForDisable(null)}
          userId={selectedUserForDisable.id}
          userName={selectedUserForDisable.name}
        />
      )}
    </>
  );
}

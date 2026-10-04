"use client";

import * as React from "react";
import { useSession } from "@/providers/session-provider";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { KeyRound, LogOut, ShieldAlert, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function UserMenu() {
  const { user, authorization, logout, logoutAll, isBootstrapping } = useSession();

  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const [logoutAllConfirmOpen, setLogoutAllConfirmOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);


  const getInitials = (name?: string, email?: string) => {
    if (name?.trim()) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Người dùng";
  const initials = getInitials(user?.name, user?.email);
  const roles = authorization?.roles || [];

  if (isBootstrapping) {
    return (
      <div className="flex size-9 items-center justify-center rounded-full bg-muted/60 text-muted-foreground animate-pulse">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }


  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAll();
      setLogoutAllConfirmOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Menu tài khoản"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-foreground sm:inline-block max-w-[120px] truncate">
            {displayName}
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64" sideOffset={8}>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none text-foreground">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
              {roles.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {roles.map((role) => (
                    <Badge key={role} variant="outline" className="text-[10px] px-1.5 py-0">
                      {role}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setChangePasswordOpen(true)}
              className="cursor-pointer"
            >
              <KeyRound className="size-4 text-muted-foreground" />
              <span>Đổi mật khẩu</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="cursor-pointer"
          >
            <LogOut className="size-4 text-muted-foreground" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setLogoutAllConfirmOpen(true)}
            variant="destructive"
            className="cursor-pointer"
          >
            <ShieldAlert className="size-4 text-destructive" />
            <span>Đăng xuất tất cả thiết bị</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Cập nhật mật khẩu định kỳ để bảo vệ tài khoản quản trị của bạn.
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm
            onSuccess={() => {
              setChangePasswordOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Logout All Devices Confirm Dialog */}
      <ConfirmActionDialog
        open={logoutAllConfirmOpen}
        onOpenChange={setLogoutAllConfirmOpen}
        title="Đăng xuất khỏi tất cả thiết bị?"
        description="Mọi phiên làm việc trên các thiết bị khác của bạn sẽ bị chấm dứt ngay lập tức. Bạn sẽ cần phải đăng nhập lại."
        confirmLabel="Đăng xuất tất cả"
        cancelLabel="Hủy"
        variant="destructive"
        isPending={isLoggingOut}
        onConfirm={handleLogoutAll}
      />
    </>
  );
}

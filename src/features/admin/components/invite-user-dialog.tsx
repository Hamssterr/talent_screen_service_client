"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AsyncButton } from "@/components/shared/async-button";
import { useInviteUserMutation } from "../hooks/use-admin-users";
import { useAdminRolesQuery } from "../hooks/use-admin-roles";
import { inviteUserSchema, InviteUserFormData } from "../schemas/invite-user.schema";
import { Mail, UserPlus } from "lucide-react";


export interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const inviteMutation = useInviteUserMutation();
  const { data: rolesData, isLoading: isLoadingRoles } = useAdminRolesQuery({
    limit: 50,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      name: "",
      email: "",
      roleKeys: [],
    },
  });

  React.useEffect(() => {
    if (!open) {
      reset({
        name: "",
        email: "",
        roleKeys: [],
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: InviteUserFormData) => {
    await inviteMutation.mutateAsync(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const roles = rolesData?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <UserPlus className="size-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Quản trị thành viên</span>
          </div>
          <DialogTitle>Mời thành viên mới</DialogTitle>
          <DialogDescription>
            Gửi email kích hoạt tài khoản kèm theo các vai trò phân quyền tương ứng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Name Field */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Địa chỉ Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                className="pl-9"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Roles Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">
                Gán vai trò <span className="text-destructive">*</span>
              </Label>
              {isLoadingRoles && (
                <span className="text-xs text-muted-foreground">Đang tải vai trò...</span>
              )}
            </div>

            <Controller
              name="roleKeys"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 max-h-48 overflow-y-auto bg-muted/20">
                  {roles.length === 0 && !isLoadingRoles && (
                    <p className="text-xs text-muted-foreground py-2 text-center">
                      Chưa có vai trò nào khả dụng trong hệ thống.
                    </p>
                  )}
                  {roles.map((role) => {
                    const isChecked = field.value?.includes(role.key);
                    return (
                      <label
                        key={role.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/60 transition-colors cursor-pointer"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...(field.value || []), role.key]);
                            } else {
                              field.onChange(
                                (field.value || []).filter((k) => k !== role.key),
                              );
                            }
                          }}
                          className="mt-0.5"
                        />
                        <div className="flex flex-col space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-foreground">
                              {role.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ({role.key})
                            </span>
                          </div>
                          {role.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.roleKeys && (
              <p className="text-xs text-destructive">{errors.roleKeys.message}</p>
            )}
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={inviteMutation.isPending}
            >
              Hủy
            </Button>
            <AsyncButton
              type="submit"
              isPending={inviteMutation.isPending}
              loadingText="Đang gửi lời mời..."
            >
              Gửi lời mời
            </AsyncButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

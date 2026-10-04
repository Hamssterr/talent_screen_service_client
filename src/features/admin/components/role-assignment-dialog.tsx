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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AsyncButton } from "@/components/shared/async-button";
import { useAssignUserRolesMutation } from "../hooks/use-admin-users";
import { useAdminRolesQuery } from "../hooks/use-admin-roles";
import {
  assignUserRolesSchema,
  AssignUserRolesFormData,
} from "../schemas/assign-user-roles.schema";
import { Shield } from "lucide-react";

export interface RoleAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentRoleKeys: string[];
}

export function RoleAssignmentDialog({
  open,
  onOpenChange,
  userId,
  userName,
  currentRoleKeys,
}: RoleAssignmentDialogProps) {
  const assignMutation = useAssignUserRolesMutation();
  const { data: rolesData, isLoading: isLoadingRoles } = useAdminRolesQuery({
    limit: 50,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AssignUserRolesFormData>({
    resolver: zodResolver(assignUserRolesSchema),
    defaultValues: {
      roleKeys: currentRoleKeys || [],
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        roleKeys: currentRoleKeys || [],
      });
    }
  }, [open, currentRoleKeys, reset]);

  const onSubmit = async (data: AssignUserRolesFormData) => {
    await assignMutation.mutateAsync(
      { id: userId, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const roles = rolesData?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Shield className="size-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Phân quyền tài khoản</span>
          </div>
          <DialogTitle>Gán vai trò cho {userName}</DialogTitle>
          <DialogDescription>
            Lựa chọn các vai trò áp dụng cho người dùng này. Người dùng sẽ nhận được toàn bộ quyền hạn tương ứng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Danh sách vai trò hệ thống</Label>
              {isLoadingRoles && (
                <span className="text-xs text-muted-foreground">Đang tải...</span>
              )}
            </div>

            <Controller
              name="roleKeys"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 max-h-56 overflow-y-auto bg-muted/20">
                  {roles.length === 0 && !isLoadingRoles && (
                    <p className="text-xs text-muted-foreground py-2 text-center">
                      Không tìm thấy vai trò nào.
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
              disabled={assignMutation.isPending}
            >
              Hủy
            </Button>
            <AsyncButton
              type="submit"
              isPending={assignMutation.isPending}
              loadingText="Đang lưu..."
            >
              Lưu thay đổi
            </AsyncButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

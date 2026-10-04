"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AsyncButton } from "@/components/shared/async-button";
import { useCreateRoleMutation } from "../hooks/use-admin-roles";
import { createRoleSchema, CreateRoleFormData } from "../schemas/create-role.schema";
import { ShieldPlus } from "lucide-react";

export interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({ open, onOpenChange }: CreateRoleDialogProps) {
  const createMutation = useCreateRoleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (!open) {
      reset({
        key: "",
        name: "",
        description: "",
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateRoleFormData) => {
    await createMutation.mutateAsync(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldPlus className="size-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Phân quyền hệ thống</span>
          </div>
          <DialogTitle>Tạo vai trò mới</DialogTitle>
          <DialogDescription>
            Định nghĩa một nhóm vai trò mới để phân quyền cho các thành viên trong tổ chức.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Key */}
          <div className="space-y-1.5">
            <Label htmlFor="role-key" className="text-xs font-semibold">
              Mã vai trò (Key) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="role-key"
              placeholder="e.g. interviewer-lead"
              className="font-mono text-xs"
              {...register("key")}
              aria-invalid={Boolean(errors.key)}
            />
            {errors.key ? (
              <p className="text-xs text-destructive">{errors.key.message}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Chỉ chứa chữ cái thường, số và dấu gạch ngang (2-80 ký tự).
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="role-name" className="text-xs font-semibold">
              Tên vai trò <span className="text-destructive">*</span>
            </Label>
            <Input
              id="role-name"
              placeholder="e.g. Trưởng nhóm phỏng vấn"
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="role-description" className="text-xs font-semibold">
              Mô tả chi tiết
            </Label>
            <Textarea
              id="role-description"
              placeholder="Mô tả phạm vi trách nhiệm và mục đích của vai trò này..."
              rows={3}
              {...register("description")}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Hủy
            </Button>
            <AsyncButton
              type="submit"
              isPending={createMutation.isPending}
              loadingText="Đang tạo..."
            >
              Tạo vai trò
            </AsyncButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

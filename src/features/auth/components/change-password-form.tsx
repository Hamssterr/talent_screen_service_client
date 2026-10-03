"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { getApiError } from "@/lib/api/api-error";
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from "../schemas/change-password.schema";
import { useChangePasswordMutation } from "../hooks/use-auth";

export interface ChangePasswordFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function ChangePasswordForm({
  onSuccess,
  className,
}: ChangePasswordFormProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: changePassword, isPending } = useChangePasswordMutation({
    onSuccess: (data) => {
      toast.success(data?.message || "Đổi mật khẩu thành công!");
      reset();
      onSuccess?.();
    },
    onError: (error) => {
      const apiError = getApiError(error);
      toast.error(apiError.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
      <FieldGroup className="space-y-3.5">
        <Field className="space-y-1.5">
          <FieldLabel htmlFor="oldPassword" className="text-xs font-medium text-foreground">
            Mật khẩu hiện tại
          </FieldLabel>
          <div className="relative">
            <Input
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isPending}
              {...register("oldPassword")}
              className="h-10 pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              aria-label={showOldPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-lg">
              {showOldPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-xs font-medium text-destructive mt-1">
              {errors.oldPassword.message}
            </p>
          )}
        </Field>

        <Field className="space-y-1.5">
          <FieldLabel htmlFor="newPassword" className="text-xs font-medium text-foreground">
            Mật khẩu mới (8–100 ký tự)
          </FieldLabel>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isPending}
              {...register("newPassword")}
              className="h-10 pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-lg">
              {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs font-medium text-destructive mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </Field>

        <Field className="space-y-1.5">
          <FieldLabel htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
            Xác nhận mật khẩu mới
          </FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isPending}
              {...register("confirmPassword")}
              className="h-10 pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-lg">
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-destructive mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-10 font-medium">
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Đang đổi mật khẩu...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 size-4" />
                Cập nhật mật khẩu
              </>
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

export default ChangePasswordForm;

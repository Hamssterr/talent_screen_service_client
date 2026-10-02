"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck, XCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getApiError } from "@/lib/api/api-error";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "../schemas/reset-password.schema";
import { useResetPasswordMutation } from "../hooks/use-auth";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPasswordMutation({
    onSuccess: (data) => {
      toast.success(
        data?.message ||
          "Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.",
      );
      router.push("/auth/login");
    },
    onError: (error) => {
      const apiError = getApiError(error);
      toast.error(
        apiError.message || "Đổi mật khẩu thất bại. Token có thể đã hết hạn.",
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Không tìm thấy mã xác thực.");
      return;
    }

    resetPassword({
      token,
      newPassword: data.newPassword,
    });
  };

  // If token is missing from URL query
  if (!token) {
    return (
      <div className="p-8 md:p-12 flex flex-col items-center justify-center h-full text-center">
        <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mb-4">
          <XCircle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#f5f5f7] mb-2">
          Liên kết không hợp lệ
        </h1>
        <p className="text-[#86868b] text-xs mb-6 max-w-sm">
          Không tìm thấy mã xác thực. Vui lòng kiểm tra lại đường dẫn trong email của bạn hoặc yêu cầu gửi lại liên kết mới.
        </p>
        <Button
          onClick={() => router.push("/auth/forgot-password")}
          className="h-11 rounded-xl bg-[#1d1d1f] border border-[#38383a] hover:bg-[#2c2c2e] text-[#f5f5f7] transition-all">
          Yêu cầu cấp lại liên kết
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <FieldGroup className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-2 mb-2">
            <div className="w-12 h-12 bg-[#1d1d1f] border border-[#38383a] rounded-xl flex items-center justify-center mb-1 text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#f5f5f7]">
              Đặt lại mật khẩu
            </h1>
            <p className="text-xs text-[#86868b]">
              Mật khẩu mới của bạn phải có từ 8 đến 100 ký tự.
            </p>
          </div>

          <Field className="space-y-1.5">
            <FieldLabel
              htmlFor="newPassword"
              className="text-[13px] font-normal text-[#86868b]">
              Mật khẩu mới
            </FieldLabel>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isPending}
                {...register("newPassword")}
                className="h-11 pl-3.5 pr-11 text-sm rounded-xl transition-all bg-[#1d1d1f] border-[#38383a] text-[#f5f5f7] placeholder:text-[#6e6e73] focus-visible:ring-1"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#86868b] hover:text-[#f5f5f7] transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-1">
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs font-medium text-destructive mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </Field>

          <Field className="space-y-1.5">
            <FieldLabel
              htmlFor="confirmPassword"
              className="text-[13px] font-normal text-[#86868b]">
              Xác nhận mật khẩu mới
            </FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isPending}
                {...register("confirmPassword")}
                className="h-11 pl-3.5 pr-11 text-sm rounded-xl transition-all bg-[#1d1d1f] border-[#38383a] text-[#f5f5f7] placeholder:text-[#6e6e73] focus-visible:ring-1"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#86868b] hover:text-[#f5f5f7] transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-1">
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </Field>

          <Field className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.99] shadow-sm">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật mật khẩu"
              )}
            </Button>
          </Field>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-xs text-[#86868b] hover:text-foreground transition-colors">
              Hủy và quay lại trang đăng nhập
            </Link>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-black border-[#333336] rounded-[28px] text-[#f5f5f7] shadow-2xl">
        <CardContent className="grid p-3 md:grid-cols-2 min-h-[420px]">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center w-full h-full p-12 text-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-[#86868b] text-xs">Đang tải biểu mẫu...</p>
              </div>
            }>
            <ResetPasswordContent />
          </Suspense>

          <div className="relative hidden w-full h-full min-h-[360px] md:block overflow-hidden rounded-2xl">
            <Image
              src="/asset/login-bg.png"
              alt="Reset password banner"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover dark:brightness-[0.8]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

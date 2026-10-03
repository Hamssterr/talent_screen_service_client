"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getApiError } from "@/lib/api/api-error";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "../schemas/forgot-password.schema";
import { useForgotPasswordMutation } from "../hooks/use-auth";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { mutate: sendResetLink, isPending } = useForgotPasswordMutation({
    onSuccess: (data) => {
      setIsSuccess(true);
      toast.success(
        data?.message ||
          "Nếu email tồn tại, thư hướng dẫn đặt lại mật khẩu đã được gửi.",
      );
    },
    onError: (error) => {
      const apiError = getApiError(error);
      toast.error(apiError.message || "Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    setSubmittedEmail(data.email);
    sendResetLink({ email: data.email });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border border-border bg-card text-card-foreground shadow-lg rounded-2xl">
        <CardContent className="grid p-3 md:grid-cols-2 min-h-[420px]">
          {/* Left Column: Form / Success State */}
          <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            {!isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <FieldGroup className="w-full flex flex-col gap-5">
                  <div className="flex flex-col gap-2 mb-2">
                    <div className="size-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-1 text-primary">
                      <KeyRound className="size-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      Quên mật khẩu?
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu.
                    </p>
                  </div>

                  <Field className="space-y-1.5">
                    <FieldLabel
                      htmlFor="email"
                      className="text-xs font-medium text-foreground">
                      Địa chỉ Email
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      disabled={isPending}
                      {...register("email")}
                      className="h-10 px-3.5 text-sm rounded-lg"
                    />
                    {errors.email && (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </Field>

                  <Field className="pt-2">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-10 text-sm font-medium rounded-lg shadow-xs">
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang gửi yêu cầu...
                        </>
                      ) : (
                        "Gửi liên kết đặt lại mật khẩu"
                      )}
                    </Button>
                  </Field>

                  <div className="mt-2 text-center">
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                      <ArrowLeft className="size-4 mr-2" />
                      Quay lại trang đăng nhập
                    </Link>
                  </div>
                </FieldGroup>
              </form>
            ) : (
              <div className="w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="size-14 bg-success-soft border border-success/20 text-success-foreground rounded-2xl flex items-center justify-center mb-5">
                  <CheckCircle className="size-7 text-success" />
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                  Kiểm tra hộp thư của bạn
                </h1>
                <p className="text-muted-foreground text-xs mb-6 leading-relaxed max-w-xs">
                  Nếu email <span className="font-semibold text-foreground">{submittedEmail}</span> tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center w-full h-10 text-sm font-medium rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
                    <ArrowLeft className="size-4 mr-2" />
                    Quay lại trang đăng nhập
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Image Banner */}
          <div className="relative hidden w-full h-full min-h-[360px] md:block overflow-hidden rounded-xl">
            <Image
              src="/asset/login-bg.png"
              alt="Forgot password banner"
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

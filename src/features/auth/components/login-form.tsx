"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getApiError } from "@/lib/api/api-error";
import { LoginFormValues, loginSchema } from "../schemas/login.schema";
import { useLoginMutation } from "../hooks/use-auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginAccount, isPending } = useLoginMutation({
    onSuccess: () => {
      toast.success("Đăng nhập thành công!");
      router.push("/");
    },
    onError: (error) => {
      const apiError = getApiError(error);
      toast.error(apiError.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginAccount(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-black border-[#333336] rounded-[28px] text-[#f5f5f7] shadow-2xl">
        <CardContent className="grid p-3 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center p-6 md:p-8">
            <FieldGroup className="w-full flex flex-col gap-5">
              {/* Header Title */}
              <div className="flex flex-col items-center gap-1.5 text-center mb-1">
                <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#f5f5f7]">
                  TalentScreen
                </h1>
                <p className="text-xs text-[#86868b]">
                  Đăng nhập vào hệ thống phỏng vấn và đánh giá ứng viên
                </p>
              </div>

              {/* Field: Email */}
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="email"
                  className="text-[13px] font-normal text-[#86868b]">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  disabled={isPending}
                  {...register("email")}
                  className="h-11 px-3.5 text-sm rounded-xl transition-all bg-[#1d1d1f] border-[#38383a] text-[#f5f5f7] placeholder:text-[#6e6e73] focus-visible:ring-1"
                />
                {errors.email && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              {/* Field: Password */}
              <Field className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="password"
                    className="text-[13px] font-normal text-[#86868b]">
                    Mật khẩu
                  </FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isPending}
                    placeholder="••••••••"
                    {...register("password")}
                    className="h-11 pl-3.5 pr-11 text-sm rounded-xl transition-all bg-[#1d1d1f] border-[#38383a] text-[#f5f5f7] placeholder:text-[#6e6e73] focus-visible:ring-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#86868b] hover:text-[#f5f5f7] transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-1">
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              {/* Submit Button */}
              <Field className="pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.99] shadow-sm">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          {/* Right column banner */}
          <div className="relative hidden w-full h-full min-h-[360px] md:block overflow-hidden rounded-2xl">
            <Image
              src="/asset/login-bg.png"
              alt="TalentScreen Authentication"
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

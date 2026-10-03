import { Suspense } from "react";
import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";
import { SessionExpiredMessage } from "@/components/auth/session-expired-message";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Đăng nhập | TalentScreen",
  description: "Đăng nhập vào hệ thống TalentScreen",
};

export default function LoginPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Suspense fallback={null}>
          <SessionExpiredMessage />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

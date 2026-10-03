import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata = {
  title: "Đặt lại mật khẩu | TalentScreen",
  description: "Thiết lập mật khẩu mới cho tài khoản TalentScreen",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-4 md:p-8">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ResetPasswordForm />
      </div>
    </main>
  );
}

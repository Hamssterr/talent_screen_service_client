import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Đăng nhập | TalentScreen",
  description: "Đăng nhập vào hệ thống TalentScreen",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </main>
  );
}

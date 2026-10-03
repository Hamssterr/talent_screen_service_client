import { ActivateAccountForm } from "@/features/auth/components/activate-account-form";

export const metadata = {
  title: "Kích hoạt tài khoản | TalentScreen",
  description: "Thiết lập mật khẩu ban đầu để kích hoạt tài khoản TalentScreen",
};

export default function ActivateAccountPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-muted/30">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ActivateAccountForm />
      </div>
    </main>
  );
}

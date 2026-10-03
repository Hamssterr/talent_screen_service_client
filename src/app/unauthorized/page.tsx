import { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Không có quyền truy cập | TalentScreen",
  description: "Bạn không có quyền truy cập tài nguyên hoặc chức năng này",
};

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="size-16 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center mb-5 shadow-xs">
        <ShieldAlert className="size-8" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
        403 — Không có quyền truy cập
      </h1>

      <p className="max-w-md text-sm text-muted-foreground leading-relaxed mb-6">
        Tài khoản của bạn hiện không có quyền hạn (Permission) phù hợp để truy cập chức năng này. Vui lòng liên hệ quản trị viên (Admin) nếu bạn cần được cấp thêm quyền.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "default", size: "default" })}>
          <Home className="size-4 mr-2" />
          Về trang làm việc chính
        </Link>
        <Link
          href="/auth/login"
          className={buttonVariants({ variant: "outline", size: "default" })}>
          <ArrowLeft className="size-4 mr-2" />
          Đăng nhập tài khoản khác
        </Link>
      </div>
    </main>
  );
}

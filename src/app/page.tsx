import Link from "next/link";
import { ArrowRight, Lock, UserCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function RootLandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground transition-colors duration-200">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs">
            TS
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">
            TalentScreen
          </span>
        </div>
        <ThemeToggle variant="compact" />
      </header>

      <main className="container mx-auto flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
            Nền tảng tuyển dụng & Phỏng vấn AI
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Tuyển dụng thông minh, Đánh giá chuẩn xác
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Hệ thống quản lý quy trình tuyển dụng, trích xuất hồ sơ ứng viên và
            tự động hóa phỏng vấn với công nghệ AI tiên tiến.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "default", size: "lg" })}>
              <Lock className="size-4 mr-2" />
              Truy cập Workspace nội bộ
              <ArrowRight className="size-4 ml-2" />
            </Link>
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "outline", size: "lg" })}>
              <UserCheck className="size-4 mr-2" />
              Đăng nhập nhân sự
            </Link>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TalentScreen Platform.
      </footer>
    </div>
  );
}

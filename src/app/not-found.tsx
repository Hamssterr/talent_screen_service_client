import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Không tìm thấy trang | TalentScreen",
  description: "Trang hoặc tài nguyên bạn tìm kiếm không tồn tại",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="size-16 rounded-2xl bg-muted text-muted-foreground border border-border flex items-center justify-center mb-5 shadow-xs">
        <FileQuestion className="size-8" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
        404 — Không tìm thấy trang
      </h1>

      <p className="max-w-md text-sm text-muted-foreground leading-relaxed mb-6">
        Đường dẫn bạn yêu cầu không tồn tại, đã bị xóa hoặc bạn không có quyền xem thông tin chi tiết (Resource Hiding).
      </p>

      <div className="flex items-center justify-center">
        <Link href="/dashboard" className={buttonVariants({ variant: "default" })}>
          <Home className="size-4 mr-2" />
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}

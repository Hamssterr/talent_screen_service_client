"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Tổng quan",
  jobs: "Vị trí tuyển dụng",
  candidates: "Ứng viên",
  applications: "Hồ sơ ứng tuyển",
  overview: "Tổng quan",
  cv: "Hồ sơ & CV",
  questions: "Bộ câu hỏi",
  interviews: "Phỏng vấn AI",
  review: "Đánh giá & Quyết định",
  new: "Tạo mới",
  edit: "Chỉnh sửa",
  admin: "Quản trị hệ thống",
  users: "Người dùng",
  roles: "Vai trò",
  permissions: "Danh mục quyền",
  "audit-logs": "Nhật ký kiểm toán",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function AppBreadcrumb() {
  const pathname = usePathname();

  const segments = React.useMemo(() => {
    return pathname.split("/").filter(Boolean);
  }, [pathname]);

  if (segments.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");

          let label = ROUTE_LABELS[segment] || segment;
          if (UUID_REGEX.test(segment)) {
            label = "Chi tiết";
          }

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AppBreadcrumb;

"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { useCan } from "@/features/authorization/hooks/use-can";
import { Permissions } from "@/features/authorization/permission.constants";
import { PageHeader } from "@/components/shared/page-header";
import { OffsetPagination } from "@/components/shared/offset-pagination";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";
import {
  useAdminUsersQuery,
  UserFilterBar,
  UserTable,
  InviteUserDialog,
  UserStatus,
} from "@/features/admin";
import { UserPlus } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const canInvite = useCan(Permissions.UsersInvite);
  const [inviteOpen, setInviteOpen] = React.useState(false);

  // Parse query params from URL
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const search = searchParams.get("search") || "";
  const status = (searchParams.get("status") || "") as UserStatus | "";

  const [prevSearch, setPrevSearch] = React.useState(search);
  const [searchInput, setSearchInput] = React.useState(search);

  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  // Debounced search sync to URL
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchInput.trim()) {
          params.set("search", searchInput.trim());
        } else {
          params.delete("search");
        }
        params.set("page", "1"); // Reset to page 1 on new search
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, search, searchParams, pathname, router]);

  const handleStatusChange = (newStatus: UserStatus | "") => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus) {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data, isLoading, isError, error, refetch } = useAdminUsersQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: status || undefined,
  });

  const users = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return (
    <RequirePermission permission={Permissions.UsersRead}>
      <div className="space-y-6">
        <PageHeader
          title="Quản lý thành viên"
          description="Danh sách tài khoản, trạng thái phân quyền và kiểm soát quyền truy cập hệ thống."
          actions={
            canInvite && (
              <Button onClick={() => setInviteOpen(true)} className="gap-2">
                <UserPlus className="size-4" />
                <span>Mời thành viên</span>
              </Button>
            )
          }
        />

        <UserFilterBar
          search={searchInput}
          onSearchChange={setSearchInput}
          status={status}
          onStatusChange={handleStatusChange}
        />

        {isLoading ? (
          <LoadingState mode="skeleton" rows={5} />
        ) : isError ? (
          <ErrorState
            title="Không thể tải danh sách thành viên"
            message={
              error?.message || "Đã xảy ra lỗi khi truy xuất danh sách người dùng."
            }
            onRetry={() => refetch()}
          />
        ) : (
          <div className="space-y-4">
            <UserTable users={users} />

            <OffsetPagination
              page={meta.page}
              limit={meta.limit}
              totalItems={meta.totalItems}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Invite User Dialog */}
        <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      </div>
    </RequirePermission>
  );
}

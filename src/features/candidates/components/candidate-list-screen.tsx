"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { UserPlus, User, Search, RefreshCw, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { OffsetPagination } from "@/components/shared/offset-pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { useCandidatesQuery } from "../hooks/use-candidates-query";
import { CandidateTable } from "./candidate-table";
import { cn } from "@/lib/utils";

export function CandidateListScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { can } = useSession();

  const canCreate = can(Permissions.CandidatesCreate);

  // Read URL params
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const searchParam = searchParams.get("search") || "";

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : 10;

  const [prevSearch, setPrevSearch] = React.useState(searchParam);
  const [searchInput, setSearchInput] = React.useState(searchParam);

  if (prevSearch !== searchParam) {
    setPrevSearch(searchParam);
    setSearchInput(searchParam);
  }

  const { data, isLoading, isError, error, refetch, isFetching } = useCandidatesQuery({
    page,
    limit,
    search: searchParam || undefined,
  });

  // Debounced URL update for search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParam) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchInput.trim()) {
          params.set("search", searchInput.trim());
        } else {
          params.delete("search");
        }
        params.delete("page"); // Reset to page 1 on search
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, searchParam, searchParams, pathname, router]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Ứng viên"
        description="Danh sách thông tin các ứng viên tiềm năng và tiền sử nộp hồ sơ vào các vị trí tuyển dụng."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
            {canCreate && (
              <Link
                href="/candidates/new"
                className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
              >
                <UserPlus className="size-4" />
                <span>Tạo ứng viên mới</span>
              </Link>
            )}
          </div>
        }
      />

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 pr-9 h-9 text-xs"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Xóa tìm kiếm"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Không thể tải danh sách ứng viên"
          message={error instanceof Error ? error.message : "Đã có lỗi xảy ra."}
          onRetry={() => refetch()}
        />
      ) : !data || data.data.length === 0 ? (
        searchParam ? (
          <EmptyState
            icon={User}
            title="Không tìm thấy ứng viên phù hợp"
            description={`Không tìm thấy kết quả nào khớp với từ khóa "${searchParam}".`}
            primaryAction={
              <Button variant="outline" size="sm" onClick={handleClearSearch}>
                Xóa tìm kiếm
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={User}
            title="Chưa có ứng viên nào"
            description="Bắt đầu tạo hồ sơ ứng viên đầu tiên để quản lý và nộp hồ sơ ứng tuyển vào các vị trí."
            primaryAction={
              canCreate ? (
                <Link
                  href="/candidates/new"
                  className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
                >
                  <UserPlus className="size-4" />
                  <span>Tạo ứng viên mới</span>
                </Link>
              ) : undefined
            }
          />
        )
      ) : (
        <div className="space-y-4">
          <CandidateTable candidates={data.data} />

          <OffsetPagination
            page={data.meta.page}
            limit={data.meta.limit}
            totalItems={data.meta.totalItems}
            totalPages={data.meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

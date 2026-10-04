"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, ArrowRight, Plus, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { apiClient } from "@/lib/api/api-client";
import { unwrapPaginatedResponse } from "@/lib/api/unwrap-response";
import { PaginatedResponse } from "@/lib/api/api-response";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
import { Application } from "@/features/applications/types/application.types";
import { cn } from "@/lib/utils";

export interface CandidateApplicationsProps {
  candidateId: string;
  candidateName: string;
}

export function CandidateApplications({ candidateId, candidateName }: CandidateApplicationsProps) {
  const { can } = useSession();
  const canCreateApp = can(Permissions.ApplicationsCreate);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["applications", "candidate", candidateId],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<Application>>("/applications", {
        params: { candidateId, limit: 50 },
      });
      return unwrapPaginatedResponse(res);
    },
    enabled: Boolean(candidateId),
    staleTime: 30 * 1000,
  });

  const applications = data?.data || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="size-4 text-primary" />
            <span>Hồ sơ ứng tuyển ({applications.length})</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Danh sách các vị trí tuyển dụng mà ứng viên này đã nộp hồ sơ
          </CardDescription>
        </div>

        {canCreateApp && (
          <Link
            href={`/applications/new?candidateId=${candidateId}`}
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5 text-xs")}
          >
            <Plus className="size-3.5" />
            <span>Nộp hồ sơ mới</span>
          </Link>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : isError ? (
          <ErrorState
            title="Không thể tải danh sách hồ sơ ứng tuyển"
            message={error instanceof Error ? error.message : "Đã có lỗi xảy ra."}
            onRetry={() => refetch()}
            className="py-6"
          />
        ) : applications.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Chưa có hồ sơ ứng tuyển nào"
            description={`Ứng viên ${candidateName} chưa được nộp hồ sơ vào bất kỳ vị trí tuyển dụng nào.`}
            primaryAction={
              canCreateApp ? (
                <Link
                  href={`/applications/new?candidateId=${candidateId}`}
                  className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
                >
                  <Plus className="size-3.5" />
                  <span>Nộp hồ sơ vào vị trí tuyển dụng</span>
                </Link>
              ) : undefined
            }
            className="py-8"
          />
        ) : (
          <div className="divide-y divide-border/60">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/applications/${app.id}/overview`}
                      className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
                    >
                      {app.job?.title || "Vị trí tuyển dụng"}
                    </Link>
                    <ApplicationStatusBadge status={app.status} />
                    <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                      v{app.version}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      Nộp lúc: {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    {app.currentCvVersionId ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <FileText className="size-3" />
                        Đã có CV
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60 italic">Chưa tải lên CV</span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <Link
                    href={`/applications/${app.id}/overview`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-8 text-xs gap-1.5",
                    )}
                  >
                    <span>Mở Workspace</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

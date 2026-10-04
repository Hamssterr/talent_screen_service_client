"use client";

import * as React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { Application } from "../types/application.types";
import { ApplicationStatusBadge } from "./application-status-badge";
import { WithdrawApplicationDialog } from "./withdraw-application-dialog";
import { DeleteApplicationDialog } from "./delete-application-dialog";
import {
  MoreHorizontal,
  ExternalLink,
  Lock,
  Trash2,
  FileText,
} from "lucide-react";

export interface ApplicationTableProps {
  applications: Application[];
  onRefresh?: () => void;
}

export function ApplicationTable({ applications, onRefresh }: ApplicationTableProps) {
  const { user, can } = useSession();

  const hasWithdrawPermission = can(Permissions.ApplicationsWithdraw);
  const hasManagePermission = can(Permissions.ApplicationsManage);

  const [selectedAppForWithdraw, setSelectedAppForWithdraw] = React.useState<Application | null>(
    null,
  );
  const [selectedAppForDelete, setSelectedAppForDelete] = React.useState<Application | null>(
    null,
  );

  return (
    <>
      <DataTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[240px]">Ứng viên</TableHead>
              <TableHead className="w-[220px]">Vị trí tuyển dụng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="hidden md:table-cell">Hồ sơ CV</TableHead>
              <TableHead className="hidden lg:table-cell">Người phụ trách</TableHead>
              <TableHead className="hidden sm:table-cell">Ngày nộp</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => {
              const isTerminal =
                app.status === "approved" ||
                app.status === "rejected" ||
                app.status === "withdrawn";

              const isOwner = Boolean(user?.id && app.owner?.ownerId === user.id);
              const canWithdraw =
                !isTerminal && hasWithdrawPermission && (isOwner || hasManagePermission);
              const canDelete = hasManagePermission;

              return (
                <TableRow key={app.id} className="group">
                  {/* Candidate */}
                  <TableCell>
                    <div className="space-y-0.5 min-w-0">
                      <Link
                        href={`/applications/${app.id}/overview`}
                        className="font-semibold text-foreground hover:text-primary transition-colors truncate block text-xs sm:text-sm"
                      >
                        {app.candidate?.fullName || "Ứng viên"}
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">
                        {app.candidate?.email}
                      </p>
                    </div>
                  </TableCell>

                  {/* Job */}
                  <TableCell>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-medium text-foreground truncate text-xs sm:text-sm">
                        {app.job?.title || "Vị trí tuyển dụng"}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">
                        {app.jobId.slice(0, 8)}...
                      </p>
                    </div>
                  </TableCell>

                  {/* Status Badge & Version */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <ApplicationStatusBadge status={app.status} />
                      <Badge variant="outline" className="font-mono text-[10px] px-1 py-0">
                        v{app.version}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* CV State */}
                  <TableCell className="hidden md:table-cell">
                    {app.currentCvVersionId ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <FileText className="size-3.5" />
                        Đã có CV
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/60 italic">
                        Chưa có CV
                      </span>
                    )}
                  </TableCell>

                  {/* Owner */}
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground truncate max-w-[120px] block">
                      {app.owner?.name || (isOwner ? "Bạn" : "Hệ thống")}
                    </span>
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-border/60 hover:bg-accent text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Thao tác cho hồ sơ của ${app.candidate?.fullName || "ứng viên"}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem render={<Link href={`/applications/${app.id}/overview`} />}>
                          <ExternalLink className="size-3.5 text-muted-foreground" />
                          <span>Mở Workspace</span>
                        </DropdownMenuItem>

                        {canWithdraw && (
                          <DropdownMenuItem
                            onClick={() => setSelectedAppForWithdraw(app)}
                            className="cursor-pointer text-amber-600 dark:text-amber-400 focus:text-amber-700"
                          >
                            <Lock className="size-3.5" />
                            <span>Rút hồ sơ</span>
                          </DropdownMenuItem>
                        )}

                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setSelectedAppForDelete(app)}
                              variant="destructive"
                              className="cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Xóa hồ sơ</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DataTableShell>

      {/* Withdraw Dialog */}
      {selectedAppForWithdraw && (
        <WithdrawApplicationDialog
          application={selectedAppForWithdraw}
          open={Boolean(selectedAppForWithdraw)}
          onOpenChange={(open) => !open && setSelectedAppForWithdraw(null)}
          onSuccess={() => {
            setSelectedAppForWithdraw(null);
            onRefresh?.();
          }}
        />
      )}

      {/* Delete Dialog */}
      {selectedAppForDelete && (
        <DeleteApplicationDialog
          application={selectedAppForDelete}
          open={Boolean(selectedAppForDelete)}
          onOpenChange={(open) => !open && setSelectedAppForDelete(null)}
          onSuccess={() => {
            setSelectedAppForDelete(null);
            onRefresh?.();
          }}
        />
      )}
    </>
  );
}

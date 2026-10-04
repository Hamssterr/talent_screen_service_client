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
import { Job } from "../types/job.types";
import { JobStatusBadge } from "./job-status-badge";
import { CloseJobDialog } from "./close-job-dialog";
import { DeleteJobDialog } from "./delete-job-dialog";
import { getJobActionCapabilities } from "../utils/job-state";
import {
  MoreHorizontal,
  Eye,
  Edit,
  PowerOff,
  Trash2,
  UserCheck,
  Share2,
} from "lucide-react";

export interface JobTableProps {
  jobs: Job[];
}

export function JobTable({ jobs }: JobTableProps) {
  const { user, can } = useSession();

  const hasReadPermission = can(Permissions.JobsRead);
  const hasUpdatePermission = can(Permissions.JobsUpdate);
  const hasClosePermission = can(Permissions.JobsClose);
  const hasManagePermission = can(Permissions.JobsManage);

  const [selectedJobForClose, setSelectedJobForClose] = React.useState<Job | null>(
    null,
  );
  const [selectedJobForDelete, setSelectedJobForDelete] = React.useState<Job | null>(
    null,
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <DataTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[280px]">Vị trí tuyển dụng</TableHead>
              <TableHead className="w-[140px]">Trạng thái</TableHead>
              <TableHead className="w-[130px] text-center">Kỹ năng</TableHead>
              <TableHead className="w-[130px] text-center">Tiêu chí</TableHead>
              <TableHead className="w-[140px]">Sở hữu</TableHead>
              <TableHead className="w-[160px]">Cập nhật gần nhất</TableHead>
              <TableHead className="w-[70px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  Không tìm thấy vị trí tuyển dụng nào.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => {
                const isOwner = Boolean(user?.id && job.ownerId === user.id);
                const capabilities = getJobActionCapabilities({
                  job,
                  currentUserId: user?.id,
                  hasReadPermission,
                  hasUpdatePermission,
                  hasClosePermission,
                  hasManagePermission,
                });

                return (
                  <TableRow key={job.id} className="hover:bg-muted/40">
                    {/* Title & snippet */}
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-semibold text-sm text-foreground hover:text-primary transition-colors hover:underline line-clamp-1"
                        >
                          {job.title}
                        </Link>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {job.description}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <JobStatusBadge status={job.status} />
                    </TableCell>

                    {/* Required Skills count */}
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono text-xs">
                        {job.requiredSkills?.length ?? 0}
                      </Badge>
                    </TableCell>

                    {/* Evaluation Criteria count */}
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono text-xs">
                        {job.evaluationCriteria?.length ?? 0}
                      </Badge>
                    </TableCell>

                    {/* Ownership Presentation */}
                    <TableCell>
                      {isOwner ? (
                        <Badge
                          variant="secondary"
                          className="gap-1 text-[11px] font-medium bg-primary/10 text-primary border-primary/20"
                        >
                          <UserCheck className="size-3" />
                          <span>Của tôi</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="gap-1 text-[11px] font-normal text-muted-foreground"
                        >
                          <Share2 className="size-3" />
                          <span>Được chia sẻ</span>
                        </Badge>
                      )}
                    </TableCell>

                    {/* Updated time */}
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {formatDate(job.updatedAt)}
                    </TableCell>

                    {/* Action Dropdown Menu */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-border/60 hover:bg-accent text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Tùy chọn thao tác"
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem render={<Link href={`/jobs/${job.id}`} />}>
                            <Eye className="size-4 text-muted-foreground" />
                            <span>Xem chi tiết</span>
                          </DropdownMenuItem>

                          {capabilities.canEdit && (
                            <DropdownMenuItem render={<Link href={`/jobs/${job.id}/edit`} />}>
                              <Edit className="size-4 text-muted-foreground" />
                              <span>Chỉnh sửa</span>
                            </DropdownMenuItem>
                          )}

                          {capabilities.canClose && (
                            <DropdownMenuItem
                              onClick={() => setSelectedJobForClose(job)}
                              className="cursor-pointer"
                            >
                              <PowerOff className="size-4 text-warning" />
                              <span>Đóng tuyển dụng</span>
                            </DropdownMenuItem>
                          )}

                          {capabilities.canDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setSelectedJobForDelete(job)}
                                variant="destructive"
                                className="cursor-pointer"
                              >
                                <Trash2 className="size-4 text-destructive" />
                                <span>Xóa vị trí (Admin)</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </DataTableShell>

      {/* Close Job Dialog */}
      <CloseJobDialog
        job={selectedJobForClose}
        open={Boolean(selectedJobForClose)}
        onOpenChange={(open) => !open && setSelectedJobForClose(null)}
      />

      {/* Delete Job Dialog */}
      <DeleteJobDialog
        job={selectedJobForDelete}
        open={Boolean(selectedJobForDelete)}
        onOpenChange={(open) => !open && setSelectedJobForDelete(null)}
      />
    </>
  );
}

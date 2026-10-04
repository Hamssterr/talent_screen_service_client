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
import { Candidate } from "../types/candidate.types";
import { DeleteCandidateDialog } from "./delete-candidate-dialog";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FilePlus,
  Mail,
  Phone,
  User,
} from "lucide-react";

export interface CandidateTableProps {
  candidates: Candidate[];
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  const { user, can } = useSession();

  const hasUpdatePermission = can(Permissions.CandidatesUpdate);
  const hasManagePermission = can(Permissions.CandidatesManage);
  const hasAppCreatePermission = can(Permissions.ApplicationsCreate);

  const [selectedCandidateForDelete, setSelectedCandidateForDelete] =
    React.useState<Candidate | null>(null);

  return (
    <>
      <DataTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Ứng viên</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead className="hidden md:table-cell">Người tạo</TableHead>
              <TableHead className="hidden sm:table-cell">Ngày tạo</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => {
              const isOwner = Boolean(
                user?.id && candidate.owner?.ownerId === user.id,
              );
              const canEdit = hasUpdatePermission && (isOwner || hasManagePermission);
              const canDelete = hasManagePermission;

              const initials = candidate.fullName
                .split(" ")
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <TableRow key={candidate.id} className="group">
                  {/* Candidate Name & Avatar */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {initials || <User className="size-4" />}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <Link
                          href={`/candidates/${candidate.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {candidate.fullName}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <Mail className="size-3 shrink-0" />
                          <span className="truncate">{candidate.email}</span>
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Phone & Contact */}
                  <TableCell>
                    {candidate.phone ? (
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <Phone className="size-3" />
                        {candidate.phone}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/60 italic">
                        Chưa có SĐT
                      </span>
                    )}
                  </TableCell>

                  {/* Owner */}
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs text-muted-foreground truncate max-w-[140px] block">
                      {candidate.owner ? candidate.owner.name : "Hệ thống"}
                    </span>
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {new Date(candidate.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-border/60 hover:bg-accent text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Thao tác cho ứng viên ${candidate.fullName}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem render={<Link href={`/candidates/${candidate.id}`} />}>
                          <Eye className="size-3.5 text-muted-foreground" />
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>

                        {hasAppCreatePermission && (
                          <DropdownMenuItem render={<Link href={`/applications/new?candidateId=${candidate.id}`} />}>
                            <FilePlus className="size-3.5 text-primary" />
                            <span className="text-primary font-medium">Nộp hồ sơ ứng tuyển</span>
                          </DropdownMenuItem>
                        )}

                        {canEdit && (
                          <DropdownMenuItem render={<Link href={`/candidates/${candidate.id}/edit`} />}>
                            <Edit className="size-3.5 text-muted-foreground" />
                            <span>Chỉnh sửa thông tin</span>
                          </DropdownMenuItem>
                        )}

                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setSelectedCandidateForDelete(candidate)}
                              variant="destructive"
                              className="cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Xóa ứng viên</span>
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

      {/* Delete Confirmation Dialog */}
      {selectedCandidateForDelete && (
        <DeleteCandidateDialog
          candidate={selectedCandidateForDelete}
          open={Boolean(selectedCandidateForDelete)}
          onOpenChange={(open) => !open && setSelectedCandidateForDelete(null)}
          onSuccess={() => setSelectedCandidateForDelete(null)}
        />
      )}
    </>
  );
}

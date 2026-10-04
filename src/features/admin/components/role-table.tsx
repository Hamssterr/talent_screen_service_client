"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { AdminRole } from "../types/admin.types";
import { Shield, Lock } from "lucide-react";

export interface RoleTableProps {
  roles: AdminRole[];
  isLoading?: boolean;
}

export function RoleTable({ roles }: RoleTableProps) {

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <DataTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Mã vai trò (Key)</TableHead>
            <TableHead className="w-[220px]">Tên vai trò</TableHead>
            <TableHead className="min-w-[260px]">Mô tả</TableHead>
            <TableHead className="w-[130px]">Phân loại</TableHead>
            <TableHead className="w-[120px] text-center">Số quyền</TableHead>
            <TableHead className="w-[130px]">Trạng thái</TableHead>
            <TableHead className="w-[120px]">Ngày tạo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-28 text-center text-sm text-muted-foreground"
              >
                Không có vai trò nào trong hệ thống.
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
                    <Shield className="size-3.5 text-primary" />
                    <span>{role.key}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm font-medium text-foreground">
                    {role.name}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {role.description || "—"}
                  </span>
                </TableCell>

                <TableCell>
                  {role.isSystem ? (
                    <Badge variant="outline" className="gap-1 text-[11px] font-medium bg-muted/30">
                      <Lock className="size-3 text-muted-foreground" />
                      <span>Hệ thống</span>
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      Tùy biến
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="muted" className="text-xs font-semibold">
                    {role.permissions?.length ?? 0}
                  </Badge>
                </TableCell>

                <TableCell>
                  <StatusBadge
                    tone={role.isActive ? "success" : "neutral"}
                    label={role.isActive ? "Hoạt động" : "Tạm ngưng"}
                  />
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(role.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </DataTableShell>
  );
}

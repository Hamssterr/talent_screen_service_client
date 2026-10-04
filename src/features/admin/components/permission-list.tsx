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
import { AdminPermission } from "../types/admin.types";
import { KeyRound, FolderKey } from "lucide-react";

export interface PermissionListProps {
  permissions: AdminPermission[];
  isLoading?: boolean;
}

export function PermissionList({ permissions }: PermissionListProps) {

  // Group permissions by resource
  const grouped = React.useMemo(() => {
    const map = new Map<string, AdminPermission[]>();
    for (const perm of permissions) {
      const list = map.get(perm.resource) || [];
      list.push(perm);
      map.set(perm.resource, list);
    }
    return map;
  }, [permissions]);

  const resources = Array.from(grouped.keys()).sort();

  return (
    <div className="space-y-6">
      {resources.length === 0 ? (
        <DataTableShell>
          <div className="py-12 text-center text-sm text-muted-foreground">
            Không tìm thấy danh mục quyền hạn nào.
          </div>
        </DataTableShell>
      ) : (
        resources.map((resource) => {
          const items = grouped.get(resource) || [];
          return (
            <div key={resource} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <FolderKey className="size-4 text-primary" />
                <h3 className="text-sm font-semibold capitalize text-foreground">
                  Tài nguyên: {resource}
                </h3>
                <Badge variant="muted" className="text-[11px] font-normal">
                  {items.length} quyền
                </Badge>
              </div>

              <DataTableShell>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[220px]">Mã quyền hạn (Key)</TableHead>
                      <TableHead className="w-[180px]">Tên quyền hạn</TableHead>
                      <TableHead className="w-[120px]">Hành động</TableHead>
                      <TableHead className="min-w-[240px]">Mô tả</TableHead>
                      <TableHead className="w-[100px] text-right">Phân loại</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((perm) => (
                      <TableRow key={perm.id}>
                        <TableCell>
                          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
                            <KeyRound className="size-3 text-muted-foreground" />
                            <span>{perm.key}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm font-medium text-foreground">
                            {perm.name}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[11px]">
                            {perm.action}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {perm.description || "—"}
                          </span>
                        </TableCell>

                        <TableCell className="text-right">
                          {perm.isSystem ? (
                            <Badge variant="outline" className="text-[10px] bg-muted/40">
                              Hệ thống
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">
                              Tùy biến
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DataTableShell>
            </div>
          );
        })
      )}
    </div>
  );
}

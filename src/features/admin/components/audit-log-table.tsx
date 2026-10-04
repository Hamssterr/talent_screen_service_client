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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { AdminAuditLog } from "../types/admin.types";
import { Code, Clock, FileCode2 } from "lucide-react";

export interface AuditLogTableProps {
  logs: AdminAuditLog[];
  isLoading?: boolean;
}

export function AuditLogTable({ logs }: AuditLogTableProps) {

  const [selectedLog, setSelectedLog] = React.useState<AdminAuditLog | null>(
    null,
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <>
      <DataTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Thời gian</TableHead>
              <TableHead className="w-[200px]">Người thực hiện</TableHead>
              <TableHead className="w-[180px]">Hành động (Action)</TableHead>
              <TableHead className="w-[200px]">Đối tượng tác động</TableHead>
              <TableHead className="w-[130px]">Địa chỉ IP</TableHead>
              <TableHead className="w-[90px] text-right">Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  Chưa có nhật ký kiểm toán nào được ghi nhận.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{formatDate(log.createdAt)}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-foreground truncate max-w-[180px]">
                        {log.actorEmail || log.actorId || "System"}
                      </span>
                      {log.actorId && log.actorEmail && (
                        <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px]">
                          {log.actorId}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {log.action}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-xs font-semibold text-foreground capitalize">
                        {log.targetType}
                      </span>
                      {log.targetId && (
                        <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px]">
                          {log.targetId}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {log.ipAddress || "—"}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      className="size-8 p-0 text-muted-foreground hover:text-foreground"
                      title="Xem dữ liệu metadata"
                    >
                      <Code className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DataTableShell>

      {/* Metadata Detail Dialog */}
      <Dialog
        open={Boolean(selectedLog)}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary mb-1">
              <FileCode2 className="size-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Nhật ký kiểm toán
              </span>
            </div>
            <DialogTitle>Dữ liệu sự kiện: {selectedLog?.action}</DialogTitle>
            <DialogDescription>
              Thông tin kỹ thuật chi tiết và payload metadata của sự kiện kiểm toán.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/30 p-3 rounded-xl border border-border/60">
                <div>
                  <span className="text-muted-foreground">Mã sự kiện:</span>
                  <p className="font-mono font-medium truncate mt-0.5">
                    {selectedLog.id}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Thời điểm:</span>
                  <p className="font-medium mt-0.5">
                    {formatDate(selectedLog.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tác tử (Actor):</span>
                  <p className="font-medium truncate mt-0.5">
                    {selectedLog.actorEmail || selectedLog.actorId || "System"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">User Agent:</span>
                  <p className="font-mono text-[11px] truncate mt-0.5">
                    {selectedLog.userAgent || "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-foreground">
                  Payload Metadata (JSON):
                </span>
                <pre className="p-3 rounded-xl border border-border bg-muted/40 font-mono text-xs overflow-x-auto max-h-64 text-foreground">
                  {selectedLog.metadata
                    ? JSON.stringify(selectedLog.metadata, null, 2)
                    : "// Không có metadata bổ sung"}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

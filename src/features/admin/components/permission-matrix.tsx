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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { AsyncButton } from "@/components/shared/async-button";
import { useBulkMutateRolePermissionsMutation } from "../hooks/use-admin-roles";
import { AdminPermission, AdminRole } from "../types/admin.types";
import { Search, Save, RotateCcw, Info } from "lucide-react";

export interface PermissionMatrixProps {
  roles: AdminRole[];
  permissions: AdminPermission[];
  canEdit?: boolean;
}

export function PermissionMatrix({
  roles,
  permissions,
  canEdit = true,
}: PermissionMatrixProps) {
  const bulkMutation = useBulkMutateRolePermissionsMutation();
  const [search, setSearch] = React.useState("");

  // Map: roleId -> Set<permissionKey>
  const initialRolePermissionsMap = React.useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const role of roles) {
      map.set(role.id, new Set(role.permissions || []));
    }
    return map;
  }, [roles]);

  const [overrideMap, setOverrideMap] = React.useState<Map<
    string,
    Set<string>
  > | null>(null);

  const currentMap = overrideMap ?? initialRolePermissionsMap;

  // Compute diffs: what to grant and what to revoke for each role
  const diffs = React.useMemo(() => {
    const grants: { roleId: string; permissionKey: string }[] = [];
    const revokes: { roleId: string; permissionKey: string }[] = [];

    for (const role of roles) {
      const initialSet = initialRolePermissionsMap.get(role.id) || new Set();
      const roleCurrentSet = currentMap.get(role.id) || new Set();

      // Find granted
      for (const permKey of roleCurrentSet) {
        if (!initialSet.has(permKey)) {
          grants.push({ roleId: role.id, permissionKey: permKey });
        }
      }

      // Find revoked
      for (const permKey of initialSet) {
        if (!roleCurrentSet.has(permKey)) {
          revokes.push({ roleId: role.id, permissionKey: permKey });
        }
      }
    }

    return { grants, revokes, totalChanges: grants.length + revokes.length };
  }, [roles, initialRolePermissionsMap, currentMap]);

  const togglePermission = (roleId: string, permissionKey: string) => {
    if (!canEdit) return;

    setOverrideMap((prev) => {
      const base = prev ?? initialRolePermissionsMap;
      const next = new Map(base);
      const set = new Set(next.get(roleId) || []);
      if (set.has(permissionKey)) {
        set.delete(permissionKey);
      } else {
        set.add(permissionKey);
      }
      next.set(roleId, set);
      return next;
    });
  };

  const handleReset = () => {
    setOverrideMap(null);
  };

  const handleSave = async () => {
    if (diffs.totalChanges === 0) return;

    // Execute bulk grant if any
    if (diffs.grants.length > 0) {
      const roleToPerms = new Map<string, string[]>();
      for (const g of diffs.grants) {
        const list = roleToPerms.get(g.roleId) || [];
        list.push(g.permissionKey);
        roleToPerms.set(g.roleId, list);
      }

      for (const [roleId, permKeys] of roleToPerms.entries()) {
        await bulkMutation.mutateAsync({
          roleIds: [roleId],
          permissionKeys: permKeys,
          mode: "grant",
        });
      }
    }

    // Execute bulk revoke if any
    if (diffs.revokes.length > 0) {
      const roleToPerms = new Map<string, string[]>();
      for (const r of diffs.revokes) {
        const list = roleToPerms.get(r.roleId) || [];
        list.push(r.permissionKey);
        roleToPerms.set(r.roleId, list);
      }

      for (const [roleId, permKeys] of roleToPerms.entries()) {
        await bulkMutation.mutateAsync({
          roleIds: [roleId],
          permissionKeys: permKeys,
          mode: "revoke",
        });
      }
    }

    setOverrideMap(null);
  };

  const filteredPermissions = React.useMemo(() => {
    if (!search.trim()) return permissions;
    const query = search.toLowerCase().trim();
    return permissions.filter(
      (p) =>
        p.key.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.resource.toLowerCase().includes(query),
    );
  }, [permissions, search]);

  return (
    <div className="space-y-4">
      {/* Matrix Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl border border-border bg-card">
        <div className="relative min-w-[260px] max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Lọc quyền theo tên hoặc resource..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        {canEdit && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {diffs.totalChanges > 0 && (
              <span className="text-xs font-medium text-warning flex items-center gap-1 mr-1">
                <Info className="size-3.5" />
                {diffs.totalChanges} thay đổi chưa lưu
              </span>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={diffs.totalChanges === 0 || bulkMutation.isPending}
              className="h-8 text-xs"
            >
              <RotateCcw className="mr-1.5 size-3.5" />
              Khôi phục
            </Button>

            <AsyncButton
              size="sm"
              onClick={handleSave}
              disabled={diffs.totalChanges === 0}
              isPending={bulkMutation.isPending}
              loadingText="Đang lưu..."
              className="h-8 text-xs"
            >
              <Save className="mr-1.5 size-3.5" />
              Lưu thay đổi
            </AsyncButton>
          </div>
        )}
      </div>

      {/* Permission Matrix Table */}
      <DataTableShell className="overflow-x-auto max-h-[680px]">
        <Table className="relative">
          <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-xs z-10 shadow-xs">
            <TableRow>
              <TableHead className="w-[280px] min-w-[240px] bg-background">
                Quyền hạn (Resource / Key)
              </TableHead>
              {roles.map((role) => (
                <TableHead
                  key={role.id}
                  className="w-[120px] min-w-[110px] text-center font-medium bg-background"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">
                      {role.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[100px]">
                      {role.key}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPermissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={roles.length + 1}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  Không tìm thấy quyền hạn nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              filteredPermissions.map((perm) => (
                <TableRow key={perm.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex flex-col space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground">
                          {perm.name}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono">
                          {perm.resource}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {perm.key}
                      </span>
                    </div>
                  </TableCell>

                  {roles.map((role) => {
                    const isChecked = Boolean(
                      currentMap.get(role.id)?.has(perm.key),
                    );
                    const initialChecked = Boolean(
                      initialRolePermissionsMap.get(role.id)?.has(perm.key),
                    );
                    const isModified = isChecked !== initialChecked;

                    return (
                      <TableCell
                        key={`${role.id}-${perm.id}`}
                        className={`text-center transition-colors ${
                          isModified ? "bg-warning/10" : ""
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() =>
                              togglePermission(role.id, perm.key)
                            }
                            disabled={!canEdit || bulkMutation.isPending}
                            aria-label={`Quyền ${perm.key} cho vai trò ${role.name}`}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DataTableShell>
    </div>
  );
}

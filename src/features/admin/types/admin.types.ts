import { PaginationMeta } from "@/lib/api/pagination";

export type UserStatus = "pending" | "active" | "inactive" | "suspended";

export interface AdminUserRoleSummary {
  id: string;
  key: string;
  name: string;
  description?: string | null;
}

export interface AdminUserListItem {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export interface AdminUserDetail {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  roles: AdminUserRoleSummary[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus | "";
  role?: string;
}

export interface InviteUserRequest {
  name: string;
  email: string;
  roleKeys: string[];
}

export interface AssignUserRolesRequest {
  roleKeys: string[];
}

export interface AdminRole {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  isSystem: boolean;
  isActive: boolean;
  version: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminRoleListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateRoleRequest {
  key: string;
  name: string;
  description?: string;
}

export interface AdminPermission {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  resource: string;
  action: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPermissionListParams {
  page?: number;
  limit?: number;
  search?: string;
  resource?: string;
}

export interface BulkRolePermissionsRequest {
  roleIds: string[];
  permissionKeys: string[];
  mode: "grant" | "revoke";
}

export interface BulkRolePermissionsResponse {
  message: string;
  affected: number;
}

export interface AdminAuditLog {
  id: string;
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface AdminAuditLogListParams {
  page?: number;
  limit?: number;
  actorId?: string;
  targetType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

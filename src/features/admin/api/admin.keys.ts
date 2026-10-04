import {
  AdminAuditLogListParams,
  AdminPermissionListParams,
  AdminRoleListParams,
  AdminUserListParams,
} from "../types/admin.types";

export const adminKeys = {
  all: ["admin"] as const,

  users: {
    all: ["admin", "users"] as const,
    lists: () => [...adminKeys.users.all, "list"] as const,
    list: (params?: AdminUserListParams) =>
      [...adminKeys.users.lists(), params ?? {}] as const,
    details: () => [...adminKeys.users.all, "detail"] as const,
    detail: (id: string) => [...adminKeys.users.details(), id] as const,
  },

  roles: {
    all: ["admin", "roles"] as const,
    lists: () => [...adminKeys.roles.all, "list"] as const,
    list: (params?: AdminRoleListParams) =>
      [...adminKeys.roles.lists(), params ?? {}] as const,
    details: () => [...adminKeys.roles.all, "detail"] as const,
    detail: (id: string) => [...adminKeys.roles.details(), id] as const,
  },

  permissions: {
    all: ["admin", "permissions"] as const,
    lists: () => [...adminKeys.permissions.all, "list"] as const,
    list: (params?: AdminPermissionListParams) =>
      [...adminKeys.permissions.lists(), params ?? {}] as const,
  },

  audit: {
    all: ["admin", "audit"] as const,
    lists: () => [...adminKeys.audit.all, "list"] as const,
    list: (params?: AdminAuditLogListParams) =>
      [...adminKeys.audit.lists(), params ?? {}] as const,
  },
};

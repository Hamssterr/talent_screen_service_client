import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { adminAuditApi } from "../api/admin-audit.api";
import { adminKeys } from "../api/admin.keys";
import {
  AdminAuditLog,
  AdminAuditLogListParams,
  PaginatedResult,
} from "../types/admin.types";

/**
 * Query hook to list platform audit logs.
 */
export const useAdminAuditLogsQuery = (
  params?: AdminAuditLogListParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResult<AdminAuditLog>,
      Error,
      PaginatedResult<AdminAuditLog>,
      readonly unknown[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminKeys.audit.list(params),
    queryFn: () => adminAuditApi.listAuditLogs(params),
    ...options,
  });
};

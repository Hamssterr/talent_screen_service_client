import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { adminPermissionsApi } from "../api/admin-permissions.api";
import { adminKeys } from "../api/admin.keys";
import {
  AdminPermission,
  AdminPermissionListParams,
  PaginatedResult,
} from "../types/admin.types";

/**
 * Query hook to list permissions catalogue.
 */
export const useAdminPermissionsQuery = (
  params?: AdminPermissionListParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResult<AdminPermission>,
      Error,
      PaginatedResult<AdminPermission>,
      readonly unknown[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminKeys.permissions.list(params),
    queryFn: () => adminPermissionsApi.listPermissions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    ...options,
  });
};

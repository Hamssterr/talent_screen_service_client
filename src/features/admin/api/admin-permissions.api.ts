import { apiClient } from "@/lib/api/api-client";
import { PaginatedResponse } from "@/lib/api/api-response";
import { unwrapPaginatedResponse } from "@/lib/api/unwrap-response";
import {
  AdminPermission,
  AdminPermissionListParams,
  PaginatedResult,
} from "../types/admin.types";

export const adminPermissionsApi = {
  listPermissions: async (
    params?: AdminPermissionListParams,
  ): Promise<PaginatedResult<AdminPermission>> => {
    const response = await apiClient.get<PaginatedResponse<AdminPermission>>(
      "/admin/permissions",
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 100,
          search: params?.search?.trim() || undefined,
          resource: params?.resource || undefined,
        },
      },
    );
    return unwrapPaginatedResponse(response);
  },
};

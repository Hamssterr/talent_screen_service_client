import { apiClient } from "@/lib/api/api-client";
import { ApiResponse, PaginatedResponse } from "@/lib/api/api-response";
import { unwrapPaginatedResponse, unwrapResponse } from "@/lib/api/unwrap-response";
import {
  AdminRole,
  AdminRoleListParams,
  BulkRolePermissionsRequest,
  BulkRolePermissionsResponse,
  CreateRoleRequest,
  PaginatedResult,
} from "../types/admin.types";

export const adminRolesApi = {
  listRoles: async (
    params?: AdminRoleListParams,
  ): Promise<PaginatedResult<AdminRole>> => {
    const response = await apiClient.get<PaginatedResponse<AdminRole>>(
      "/admin/roles",
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search?.trim() || undefined,
        },
      },
    );
    return unwrapPaginatedResponse(response);
  },

  createRole: async (
    data: CreateRoleRequest,
  ): Promise<{ message: string; role: AdminRole }> => {
    const response = await apiClient.post<ApiResponse<AdminRole>>(
      "/admin/roles",
      data,
    );
    return {
      message: response.data.message || "Tạo vai trò mới thành công",
      role: unwrapResponse(response),
    };
  },

  grantPermissions: async (
    id: string,
    permissionKeys: string[],
  ): Promise<{ message: string; permissions: string[] }> => {
    const response = await apiClient.post<ApiResponse<string[]>>(
      `/admin/roles/${id}/permissions`,
      { permissionKeys },
    );
    return {
      message: response.data.message || "Gán quyền hạn thành công",
      permissions: unwrapResponse(response),
    };
  },

  revokePermission: async (
    id: string,
    permissionKey: string,
  ): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/admin/roles/${id}/permissions/${permissionKey}`,
    );
    return {
      message: response.data.message || "Thu hồi quyền hạn thành công",
    };
  },

  bulkMutatePermissions: async (
    data: BulkRolePermissionsRequest,
  ): Promise<BulkRolePermissionsResponse> => {
    const response = await apiClient.post<ApiResponse<BulkRolePermissionsResponse>>(
      "/admin/role-permissions/bulk",
      data,
    );
    return {
      message: response.data.message || "Cập nhật quyền hạn hàng loạt thành công",
      affected: (response.data.data as { affected?: number })?.affected ?? 0,
    };
  },
};

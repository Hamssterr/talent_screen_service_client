import { apiClient } from "@/lib/api/api-client";
import { ApiResponse, PaginatedResponse } from "@/lib/api/api-response";
import { unwrapPaginatedResponse, unwrapResponse } from "@/lib/api/unwrap-response";
import {
  AdminUserDetail,
  AdminUserListItem,
  AdminUserListParams,
  AssignUserRolesRequest,
  InviteUserRequest,
  PaginatedResult,
} from "../types/admin.types";

export const adminUsersApi = {
  listUsers: async (
    params?: AdminUserListParams,
  ): Promise<PaginatedResult<AdminUserListItem>> => {
    const response = await apiClient.get<PaginatedResponse<AdminUserListItem>>(
      "/admin/users",
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search?.trim() || undefined,
          status: params?.status || undefined,
          role: params?.role || undefined,
        },
      },
    );
    return unwrapPaginatedResponse(response);
  },

  getUser: async (id: string): Promise<AdminUserDetail> => {
    const response = await apiClient.get<ApiResponse<AdminUserDetail>>(
      `/admin/users/${id}`,
    );
    return unwrapResponse(response);
  },

  inviteUser: async (
    data: InviteUserRequest,
  ): Promise<{ message: string; user: AdminUserListItem }> => {
    const response = await apiClient.post<ApiResponse<AdminUserListItem>>(
      "/admin/users/invitations",
      data,
    );
    return {
      message: response.data.message || "Lời mời đã được gửi thành công",
      user: unwrapResponse(response),
    };
  },

  resendInvitation: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<null>>(
      `/admin/users/${id}/resend-invitation`,
      {},
    );
    return {
      message: response.data.message || "Đã gửi lại email kích hoạt tài khoản",
    };
  },

  assignRoles: async (
    id: string,
    data: AssignUserRolesRequest,
  ): Promise<{ message: string; roles: string[] }> => {
    const response = await apiClient.post<ApiResponse<string[]>>(
      `/admin/users/${id}/roles`,
      data,
    );
    return {
      message: response.data.message || "Cập nhật vai trò thành công",
      roles: unwrapResponse(response),
    };
  },

  removeRole: async (
    id: string,
    roleKey: string,
  ): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/admin/users/${id}/roles/${roleKey}`,
    );
    return {
      message: response.data.message || "Đã gỡ vai trò khỏi người dùng",
    };
  },

  disableUser: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<null>>(
      `/admin/users/${id}/disable`,
      {},
    );
    return {
      message: response.data.message || "Đã vô hiệu hóa tài khoản",
    };
  },
};

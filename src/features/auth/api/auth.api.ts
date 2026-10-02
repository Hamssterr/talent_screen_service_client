import { apiClient } from "@/lib/api/api-client";
import { ApiResponse } from "@/lib/api/api-response";
import { unwrapResponse } from "@/lib/api/unwrap-response";
import {
  ActivateAccountRequest,
  AuthorizationContext,
  ChangePasswordRequest,
  CurrentUser,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResult,
  ResetPasswordRequest,
} from "../types/auth.types";

/**
 * Authentication and authorization API adapter.
 * Encapsulates all backend transport envelopes and normalizes payloads into typed domain objects.
 */
export const authApi = {
  /**
   * Login with email and password.
   * Expects backend response: { message: "...", data: { accessToken: "..." } }
   */
  login: async (data: LoginRequest): Promise<LoginResult> => {
    const response = await apiClient.post<ApiResponse<LoginResult>>(
      "/auth/login",
      data,
    );
    return unwrapResponse(response);
  },

  /**
   * Refresh expired access token using HttpOnly refresh cookie.
   */
  refresh: async (): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      "/auth/refresh",
      {},
    );
    return unwrapResponse(response);
  },

  /**
   * Logout from current device. Revokes refresh token on server and clears cookie.
   */
  logout: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>("/auth/logout", {});
  },

  /**
   * Logout from all devices (revokes all refresh tokens of the user).
   */
  logoutAll: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>("/auth/logout-all", {});
  },

  /**
   * Request password reset link.
   */
  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<{ message: string | null }> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/auth/forgot-password",
      data,
    );
    return { message: response.data.message };
  },

  /**
   * Set new password using token received via email.
   */
  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<{ message: string | null }> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/auth/reset-password",
      data,
    );
    return { message: response.data.message };
  },

  /**
   * Activate invited account and set initial password.
   */
  activateAccount: async (
    data: ActivateAccountRequest,
  ): Promise<{ message: string | null }> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/auth/activate-account",
      data,
    );
    return { message: response.data.message };
  },

  /**
   * Change current user's password.
   */
  changePassword: async (
    data: ChangePasswordRequest,
  ): Promise<{ message: string | null }> => {
    const response = await apiClient.patch<ApiResponse<null>>(
      "/auth/change-password",
      data,
    );
    return { message: response.data.message };
  },

  /**
   * Fetch current user basic identity.
   */
  getCurrentUser: async (): Promise<CurrentUser> => {
    const response = await apiClient.get<ApiResponse<CurrentUser>>("/auth/me");
    return unwrapResponse(response);
  },

  /**
   * Fetch current user roles and effective permissions.
   * Isolates nested envelope: { data: { success: true, data: { roles, permissions } } }
   */
  getMyAuthorization: async (): Promise<AuthorizationContext> => {
    const response = await apiClient.get<
      ApiResponse<{
        roles?: string[];
        permissions?: string[];
        success?: boolean;
        data?: { roles: string[]; permissions: string[] };
      }>
    >("/authorization/me");

    const rootData = response.data?.data;

    // Handle nested format if present
    if (rootData && typeof rootData === "object" && "data" in rootData && rootData.data) {
      return {
        roles: Array.isArray(rootData.data.roles) ? rootData.data.roles : [],
        permissions: Array.isArray(rootData.data.permissions)
          ? rootData.data.permissions
          : [],
      };
    }

    // Handle standard flat format
    if (rootData && typeof rootData === "object") {
      return {
        roles: Array.isArray(rootData.roles) ? rootData.roles : [],
        permissions: Array.isArray(rootData.permissions)
          ? rootData.permissions
          : [],
      };
    }

    return { roles: [], permissions: [] };
  },
};

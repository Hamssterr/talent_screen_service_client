import { apiClient } from "@/lib/api/api-client";
import { ApiResponse } from "@/lib/api/api-response";
import { AuthorizationContext } from "../types/authorization.types";

interface RawAuthorizationPayload {
  roles?: string[];
  permissions?: string[];
  success?: boolean;
  data?: {
    roles?: string[];
    permissions?: string[];
  };
}

export const authorizationApi = {
  /**
   * Fetches the current user's assigned roles and effective permissions.
   * Endpoint: GET /api/v1/authorization/me
   */
  getMyAuthorization: async (): Promise<AuthorizationContext> => {
    const response = await apiClient.get<ApiResponse<RawAuthorizationPayload>>(
      "/authorization/me",
    );

    const rootData = response.data?.data;

    // 1. Handle nested response: { message, data: { success: true, data: { roles, permissions } } }
    if (rootData && typeof rootData === "object" && "data" in rootData && rootData.data) {
      const nested = rootData.data;
      return {
        roles: Array.isArray(nested.roles) ? [...new Set(nested.roles)].sort() : [],
        permissions: Array.isArray(nested.permissions)
          ? [...new Set(nested.permissions)].sort()
          : [],
      };
    }

    // 2. Handle standard flat response: { message, data: { roles, permissions } }
    if (rootData && typeof rootData === "object") {
      return {
        roles: Array.isArray(rootData.roles) ? [...new Set(rootData.roles)].sort() : [],
        permissions: Array.isArray(rootData.permissions)
          ? [...new Set(rootData.permissions)].sort()
          : [],
      };
    }

    return { roles: [], permissions: [] };
  },
};

export default authorizationApi;

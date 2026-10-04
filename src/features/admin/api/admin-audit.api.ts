import { apiClient } from "@/lib/api/api-client";
import { PaginatedResponse } from "@/lib/api/api-response";
import { unwrapPaginatedResponse } from "@/lib/api/unwrap-response";
import {
  AdminAuditLog,
  AdminAuditLogListParams,
  PaginatedResult,
} from "../types/admin.types";

export const adminAuditApi = {
  listAuditLogs: async (
    params?: AdminAuditLogListParams,
  ): Promise<PaginatedResult<AdminAuditLog>> => {
    const response = await apiClient.get<PaginatedResponse<AdminAuditLog>>(
      "/admin/audit-logs",
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          actorId: params?.actorId || undefined,
          targetType: params?.targetType || undefined,
          action: params?.action || undefined,
          startDate: params?.startDate || undefined,
          endDate: params?.endDate || undefined,
        },
      },
    );
    return unwrapPaginatedResponse(response);
  },
};

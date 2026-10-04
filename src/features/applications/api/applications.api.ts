import { apiClient } from "@/lib/api/api-client";
import { unwrapResponse, unwrapPaginatedResponse } from "@/lib/api/unwrap-response";
import { ApiResponse, PaginatedResponse } from "@/lib/api/api-response";
import {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  WithdrawApplicationInput,
  ListApplicationsParams,
  PaginatedApplicationsResult,
} from "../types/application.types";

export const applicationsApi = {
  /**
   * List applications with offset pagination and filters (status, scope, jobId, candidateId).
   */
  async listApplications(
    params?: ListApplicationsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedApplicationsResult> {
    const res = await apiClient.get<PaginatedResponse<Application>>("/applications", {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        jobId: params?.jobId || undefined,
        candidateId: params?.candidateId || undefined,
        status: params?.status || undefined,
        scope: params?.scope || undefined,
      },
      signal,
    });
    return unwrapPaginatedResponse(res);
  },

  /**
   * Get single application by ID with Candidate and Job summaries.
   */
  async getApplication(id: string): Promise<Application> {
    const res = await apiClient.get<ApiResponse<Application>>(`/applications/${id}`);
    return unwrapResponse(res);
  },

  /**
   * Create a new application with required Idempotency-Key.
   */
  async createApplication(
    data: CreateApplicationInput,
    idempotencyKey: string,
  ): Promise<Application> {
    const payload: Record<string, unknown> = {
      candidateId: data.candidateId,
      jobId: data.jobId,
    };
    if (data.notes?.trim()) {
      payload.notes = data.notes.trim();
    }
    const res = await apiClient.post<ApiResponse<Application>>("/applications", payload, {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    });
    return unwrapResponse(res);
  },

  /**
   * Update application notes with expectedVersion (OCC).
   */
  async updateApplication(
    id: string,
    data: UpdateApplicationInput,
  ): Promise<Application> {
    const payload: Record<string, unknown> = {
      expectedVersion: data.expectedVersion,
    };
    if (data.notes !== undefined) {
      payload.notes = data.notes.trim() || undefined;
    }
    const res = await apiClient.patch<ApiResponse<Application>>(`/applications/${id}`, payload);
    return unwrapResponse(res);
  },

  /**
   * Withdraw application with expectedVersion (OCC).
   */
  async withdrawApplication(
    id: string,
    data: WithdrawApplicationInput,
  ): Promise<Application> {
    const payload: Record<string, unknown> = {
      expectedVersion: data.expectedVersion,
    };
    if (data.reason?.trim()) {
      payload.reason = data.reason.trim();
    }
    const res = await apiClient.post<ApiResponse<Application>>(
      `/applications/${id}/withdraw`,
      payload,
    );
    return unwrapResponse(res);
  },

  /**
   * Soft delete application by ID (Admin only).
   */
  async deleteApplication(id: string): Promise<void> {
    await apiClient.delete(`/applications/${id}`);
  },
};

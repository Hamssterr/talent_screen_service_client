import { apiClient } from "@/lib/api/api-client";
import { unwrapResponse, unwrapPaginatedResponse } from "@/lib/api/unwrap-response";
import { ApiResponse, PaginatedResponse } from "@/lib/api/api-response";
import {
  Candidate,
  CreateCandidateInput,
  UpdateCandidateInput,
  ListCandidatesParams,
  PaginatedCandidatesResult,
} from "../types/candidate.types";

export const candidatesApi = {
  /**
   * List candidates with offset pagination and name/email search.
   */
  async listCandidates(
    params?: ListCandidatesParams,
    signal?: AbortSignal,
  ): Promise<PaginatedCandidatesResult> {
    const res = await apiClient.get<PaginatedResponse<Candidate>>("/candidates", {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search?.trim() || undefined,
      },
      signal,
    });
    return unwrapPaginatedResponse(res);
  },

  /**
   * Get single candidate by ID.
   */
  async getCandidate(id: string): Promise<Candidate> {
    const res = await apiClient.get<ApiResponse<Candidate>>(`/candidates/${id}`);
    return unwrapResponse(res);
  },

  /**
   * Create a new candidate.
   */
  async createCandidate(data: CreateCandidateInput): Promise<Candidate> {
    const payload: Record<string, unknown> = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
    };
    if (data.phone?.trim()) {
      payload.phone = data.phone.trim();
    }
    if (data.notes?.trim()) {
      payload.notes = data.notes.trim();
    }
    const res = await apiClient.post<ApiResponse<Candidate>>("/candidates", payload);
    return unwrapResponse(res);
  },

  /**
   * Update candidate by ID.
   */
  async updateCandidate(id: string, data: UpdateCandidateInput): Promise<Candidate> {
    const payload: Record<string, unknown> = {};
    if (data.fullName !== undefined) {
      payload.fullName = data.fullName.trim();
    }
    if (data.email !== undefined) {
      payload.email = data.email.trim();
    }
    if (data.phone !== undefined) {
      payload.phone = data.phone.trim() || undefined;
    }
    if (data.notes !== undefined) {
      payload.notes = data.notes.trim() || undefined;
    }
    const res = await apiClient.patch<ApiResponse<Candidate>>(`/candidates/${id}`, payload);
    return unwrapResponse(res);
  },

  /**
   * Soft delete candidate by ID (Admin only).
   */
  async deleteCandidate(id: string): Promise<void> {
    await apiClient.delete(`/candidates/${id}`);
  },
};

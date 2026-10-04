import { apiClient } from "@/lib/api/api-client";
import { ApiResponse, PaginatedResponse } from "@/lib/api/api-response";
import {
  unwrapPaginatedResponse,
  unwrapResponse,
} from "@/lib/api/unwrap-response";
import {
  CloseJobInput,
  CreateJobInput,
  Job,
  JobListParams,
  PaginatedJobsResult,
  UpdateJobInput,
} from "../types/job.types";

export const jobApi = {
  /**
   * Fetch paginated list of jobs matching query parameters.
   */
  listJobs: async (params?: JobListParams): Promise<PaginatedJobsResult> => {
    const response = await apiClient.get<PaginatedResponse<Job>>("/jobs", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        status: params?.status || undefined,
        scope: params?.scope || "all",
      },
    });
    return unwrapPaginatedResponse(response);
  },

  /**
   * Fetch full details of a specific job by UUID.
   */
  getJob: async (id: string): Promise<Job> => {
    const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return unwrapResponse(response);
  },

  /**
   * Create a new job in draft or open status.
   */
  createJob: async (data: CreateJobInput): Promise<Job> => {
    const response = await apiClient.post<ApiResponse<Job>>("/jobs", data);
    return unwrapResponse(response);
  },

  /**
   * Update an existing job with optimistic concurrency check (expectedVersion).
   */
  updateJob: async (id: string, data: UpdateJobInput): Promise<Job> => {
    const response = await apiClient.patch<ApiResponse<Job>>(
      `/jobs/${id}`,
      data,
    );
    return unwrapResponse(response);
  },

  /**
   * Close a job with optimistic concurrency check (expectedVersion).
   */
  closeJob: async (id: string, data: CloseJobInput): Promise<Job> => {
    const response = await apiClient.post<ApiResponse<Job>>(
      `/jobs/${id}/close`,
      data,
    );
    return unwrapResponse(response);
  },

  /**
   * Soft delete a job (Admin only with jobs:manage permission).
   */
  deleteJob: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/jobs/${id}`,
    );
    return {
      message: response.data?.message || "Đã xóa vị trí tuyển dụng thành công",
    };
  },
};

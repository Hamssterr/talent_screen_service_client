import { AxiosProgressEvent } from "axios";
import { apiClient } from "@/lib/api/api-client";
import { unwrapResponse, unwrapPaginatedResponse } from "@/lib/api/unwrap-response";
import { ApiResponse, PaginatedResponse } from "@/lib/api/api-response";
import {
  CvVersionSafe,
  CvVersionDetail,
  CvExtractionResponse,
  ListCvVersionsParams,
  PaginatedCvVersionsResult,
  UpdateCvProfileInput,
  ApproveCvProfileInput,
  ExtractCvProfileInput,
  RetryCvExtractionInput,
} from "../types/cv.types";

export const cvApi = {
  /**
   * Upload a new PDF CV version for an application with required Idempotency-Key.
   */
  async uploadCvVersion(
    applicationId: string,
    file: File,
    idempotencyKey: string,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
    signal?: AbortSignal,
  ): Promise<CvVersionSafe> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<ApiResponse<CvVersionSafe>>(
      `/applications/${applicationId}/cv-versions`,
      formData,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
        onUploadProgress,
        signal,
      },
    );

    return unwrapResponse(res);
  },

  /**
   * List CV versions of an application with offset pagination.
   */
  async listCvVersions(
    applicationId: string,
    params?: ListCvVersionsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedCvVersionsResult> {
    const res = await apiClient.get<PaginatedResponse<CvVersionSafe>>(
      `/applications/${applicationId}/cv-versions`,
      {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
        signal,
      },
    );

    return unwrapPaginatedResponse(res);
  },

  /**
   * Get single CV version details including structured profile, extraction status, and version.
   */
  async getCvVersion(id: string, signal?: AbortSignal): Promise<CvVersionDetail> {
    const res = await apiClient.get<ApiResponse<CvVersionDetail>>(`/cv-versions/${id}`, {
      signal,
    });

    return unwrapResponse(res);
  },

  /**
   * Download or stream the raw PDF blob using authenticated Bearer token.
   * Note: Bypasses JSON response unwrapper.
   */
  async downloadCvPdf(id: string, signal?: AbortSignal): Promise<Blob> {
    const res = await apiClient.get<Blob>(`/cv-versions/${id}/download`, {
      responseType: "blob",
      signal,
    });

    return res.data;
  },

  /**
   * Manually update the structured CV profile (profile.v1) with expectedProfileVersion (OCC).
   */
  async updateCvProfile(
    id: string,
    data: UpdateCvProfileInput,
  ): Promise<CvVersionDetail> {
    const payload = {
      expectedProfileVersion: data.expectedProfileVersion,
      profile: data.profile,
    };

    const res = await apiClient.patch<ApiResponse<CvVersionDetail>>(
      `/cv-versions/${id}/profile`,
      payload,
    );

    return unwrapResponse(res);
  },

  /**
   * Approve CV profile (immutable lock) with expectedProfileVersion (OCC).
   */
  async approveCvProfile(
    id: string,
    data: ApproveCvProfileInput,
  ): Promise<CvVersionDetail> {
    const payload = {
      expectedProfileVersion: data.expectedProfileVersion,
    };

    const res = await apiClient.post<ApiResponse<CvVersionDetail>>(
      `/cv-versions/${id}/approve-profile`,
      payload,
    );

    return unwrapResponse(res);
  },

  /**
   * Trigger direct AI profile extraction with expectedProcessingVersion and Idempotency-Key.
   */
  async extractCvProfile(
    id: string,
    data: ExtractCvProfileInput,
    idempotencyKey: string,
  ): Promise<CvExtractionResponse> {
    const payload = {
      expectedProcessingVersion: data.expectedProcessingVersion,
    };

    const res = await apiClient.post<ApiResponse<CvExtractionResponse>>(
      `/cv-versions/${id}/extract-profile`,
      payload,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      },
    );

    return unwrapResponse(res);
  },

  /**
   * Retry AI profile extraction for failed or stale CV version with Idempotency-Key.
   */
  async retryCvExtraction(
    id: string,
    data: RetryCvExtractionInput,
    idempotencyKey: string,
  ): Promise<CvExtractionResponse> {
    const payload = {
      expectedProcessingVersion: data.expectedProcessingVersion,
    };

    const res = await apiClient.post<ApiResponse<CvExtractionResponse>>(
      `/cv-versions/${id}/retry-extraction`,
      payload,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      },
    );

    return unwrapResponse(res);
  },

  /**
   * Soft delete a CV version (Admin with cv:manage only).
   */
  async deleteCvVersion(id: string): Promise<void> {
    await apiClient.delete(`/cv-versions/${id}`);
  },
};

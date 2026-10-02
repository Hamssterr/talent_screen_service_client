import { AxiosResponse } from "axios";
import { ApiResponse, PaginatedResponse } from "./api-response";
import { PaginationMeta } from "./pagination";

/**
 * Type guard to check if an object is an AxiosResponse.
 */
function isAxiosResponse<T>(res: unknown): res is AxiosResponse<T> {
  return typeof res === "object" && res !== null && "data" in res && "status" in res && "headers" in res;
}

/**
 * Extracts payload from an ApiResponse or AxiosResponse<ApiResponse>.
 * Throws an Error if data is null/undefined.
 */
export function unwrapResponse<T>(
  response: ApiResponse<T> | AxiosResponse<ApiResponse<T>>,
): T {
  const envelope: ApiResponse<T> = isAxiosResponse(response)
    ? response.data
    : response;

  if (envelope === null || envelope === undefined) {
    throw new Error("Phản hồi từ máy chủ không hợp lệ.");
  }

  // Handle direct payload (if response was not enveloped)
  if (typeof envelope === "object" && !("data" in envelope)) {
    return envelope as unknown as T;
  }

  if (envelope.data === null || envelope.data === undefined) {
    throw new Error(
      envelope.message || "Dữ liệu trả về từ máy chủ trống.",
    );
  }

  return envelope.data;
}

/**
 * Extracts payload from an ApiResponse or AxiosResponse<ApiResponse> allowing nullable data.
 */
export function unwrapNullableResponse<T>(
  response: ApiResponse<T> | AxiosResponse<ApiResponse<T>>,
): T | null {
  const envelope: ApiResponse<T> = isAxiosResponse(response)
    ? response.data
    : response;

  if (envelope === null || envelope === undefined) {
    return null;
  }

  if (typeof envelope === "object" && !("data" in envelope)) {
    return envelope as unknown as T;
  }

  return envelope.data;
}

/**
 * Extracts data and pagination metadata from a PaginatedResponse.
 */
export function unwrapPaginatedResponse<T>(
  response: PaginatedResponse<T> | AxiosResponse<PaginatedResponse<T>>,
): { data: T[]; meta: PaginationMeta } {
  const envelope: PaginatedResponse<T> = isAxiosResponse(response)
    ? response.data
    : response;

  if (!envelope || !Array.isArray(envelope.data) || !envelope.meta) {
    throw new Error("Dữ liệu phân trang không hợp lệ.");
  }

  return {
    data: envelope.data,
    meta: envelope.meta,
  };
}

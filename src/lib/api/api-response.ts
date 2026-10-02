import { PaginationMeta } from "./pagination";

/**
 * Standard backend success envelope.
 * Source: nestjs-auth/src/common/interceptors/transform-response.interceptor.ts
 */
export interface ApiResponse<T> {
  message: string | null;
  data: T | null;
  meta?: PaginationMeta;
}

/**
 * Paginated response envelope with non-optional meta and array data.
 */
export interface PaginatedResponse<T> {
  message: string | null;
  data: T[];
  meta: PaginationMeta;
}

/**
 * Standard backend error payload.
 * Source: nestjs-auth/src/common/filters/global-exception.filter.ts
 */
export interface ApiErrorPayload {
  code: string;
  message: string;
  requestId: string;
  details?: unknown;
}

/**
 * Standard backend error response envelope.
 */
export interface ApiErrorResponse {
  error: ApiErrorPayload;
}

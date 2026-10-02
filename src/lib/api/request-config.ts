import { AxiosRequestConfig } from "axios";

/**
 * Standard typed request options for API calls across features.
 * Prepares support for Idempotency-Key, expectedVersion, and custom headers.
 */
export interface RequestOptions extends Omit<AxiosRequestConfig, "headers"> {
  idempotencyKey?: string;
  expectedVersion?: number;
  headers?: Record<string, string>;
}

/**
 * Builds standard header dictionary with optional Idempotency-Key and If-Match (expectedVersion).
 */
export function createRequestHeaders(
  options?: RequestOptions,
): Record<string, string> {
  const headers: Record<string, string> = {
    ...(options?.headers || {}),
  };

  if (options?.idempotencyKey) {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }

  if (typeof options?.expectedVersion === "number") {
    headers["If-Match"] = String(options.expectedVersion);
  }

  return headers;
}

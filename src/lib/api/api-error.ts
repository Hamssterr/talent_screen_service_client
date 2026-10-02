import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "./api-response";

/**
 * Normalized application API error representation.
 */
export interface AppApiError {
  status?: number;
  code: string;
  message: string;
  requestId?: string;
  details?: unknown;
}

/**
 * Default fallback error messages by HTTP status.
 */
const STATUS_MESSAGE_MAP: Record<number, { code: string; message: string }> = {
  400: { code: "BAD_REQUEST", message: "Yêu cầu không hợp lệ." },
  401: { code: "AUTHENTICATION_REQUIRED", message: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ." },
  403: { code: "MISSING_PERMISSION", message: "Bạn không có quyền thực hiện thao tác này." },
  404: { code: "RESOURCE_NOT_FOUND", message: "Không tìm thấy dữ liệu yêu cầu." },
  409: { code: "RESOURCE_CONFLICT", message: "Dữ liệu bị xung đột hoặc đã tồn tại." },
  422: { code: "VALIDATION_FAILED", message: "Dữ liệu nhập vào không hợp lệ." },
  429: { code: "RATE_LIMITED", message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau giây lát." },
  500: { code: "INTERNAL_SERVER_ERROR", message: "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau." },
  502: { code: "BAD_GATEWAY", message: "Dịch vụ máy chủ tạm thời không khả dụng." },
  503: { code: "SERVICE_UNAVAILABLE", message: "Hệ thống đang bảo trì. Vui lòng thử lại sau." },
  504: { code: "GATEWAY_TIMEOUT", message: "Hết thời gian chờ phản hồi từ máy chủ." },
};

/**
 * Parses and normalizes any unknown error into a structured AppApiError.
 */
export function getApiError(error: unknown): AppApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse | { message?: string }>;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data;

    // 1. Structured backend error envelope: { error: { code, message, requestId, details } }
    if (responseData && typeof responseData === "object" && "error" in responseData && responseData.error) {
      const backendError = responseData.error;
      return {
        status,
        code: backendError.code || (status ? STATUS_MESSAGE_MAP[status]?.code || "API_ERROR" : "API_ERROR"),
        message: backendError.message || "Đã có lỗi xảy ra từ máy chủ.",
        requestId: backendError.requestId,
        details: backendError.details,
      };
    }

    // 2. Unwrapped message or legacy format: { message: "..." }
    if (responseData && typeof responseData === "object" && "message" in responseData && typeof responseData.message === "string") {
      return {
        status,
        code: status ? STATUS_MESSAGE_MAP[status]?.code || "API_ERROR" : "API_ERROR",
        message: responseData.message,
      };
    }

    // 3. Network or Timeout error (No response from server)
    if (axiosError.code === "ECONNABORTED" || axiosError.message.includes("timeout")) {
      return {
        code: "TIMEOUT",
        message: "Hết thời gian chờ phản hồi. Vui lòng kiểm tra kết nối mạng và thử lại.",
      };
    }

    if (axiosError.code === "ERR_NETWORK" || !axiosError.response) {
      return {
        code: "NETWORK_ERROR",
        message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng.",
      };
    }

    // 4. HTTP status fallback
    if (status && STATUS_MESSAGE_MAP[status]) {
      return {
        status,
        code: STATUS_MESSAGE_MAP[status].code,
        message: STATUS_MESSAGE_MAP[status].message,
      };
    }
  }

  // 5. Standard JavaScript Error
  if (error instanceof Error) {
    return {
      code: "CLIENT_ERROR",
      message: error.message || "Đã có lỗi xảy ra trong ứng dụng.",
    };
  }

  // 6. Unknown Error fallback
  return {
    code: "UNKNOWN_ERROR",
    message: "Đã có lỗi không xác định xảy ra.",
  };
}

/**
 * Type-safe error code check helper.
 */
export function isApiErrorCode(error: unknown, code: string): boolean {
  const apiError = getApiError(error);
  return apiError.code === code;
}

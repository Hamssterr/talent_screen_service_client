import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { tokenStorage } from "@/lib/auth/token-storage";
import { ApiResponse } from "./api-response";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

// 1. Core API client instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
});

// 2. Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Response Interceptor: 401 Handling & Refresh Queue
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Checks if a request URL should bypass automatic token refresh.
 */
function shouldSkipRefresh(url?: string): boolean {
  if (!url) return false;
  const skipEndpoints = [
    "/auth/login",
    "/auth/refresh",
    "/auth/logout",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/activate-account",
    "/interviews/", // Candidate public runtime boundary
  ];
  return skipEndpoints.some((endpoint) => url.includes(endpoint));
}

/**
 * Executes a refresh token request via dedicated Axios call without triggering interceptor loop.
 */
async function executeRefreshToken(): Promise<string> {
  const response = await axios.post<ApiResponse<{ accessToken: string }>>(
    `${env.apiBaseUrl}/auth/refresh`,
    {},
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    },
  );

  const data = response.data?.data;
  if (!data || !data.accessToken) {
    throw new Error("Phản hồi làm mới token không hợp lệ.");
  }

  return data.accessToken;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const isExcluded = shouldSkipRefresh(originalRequest.url);

    // Only attempt refresh on 401 for non-excluded requests that haven't retried yet
    if (status === 401 && !originalRequest._retry && !isExcluded) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await executeRefreshToken();
        tokenStorage.setAccessToken(newAccessToken);

        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearAccessToken();

        // Redirect to login if in browser environment and not on public auth page
        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          if (!pathname.startsWith("/auth/")) {
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.href = "/auth/login?reason=session_expired";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { accessTokenStore } from "@/lib/auth/access-token-store";
import { refreshAccessToken } from "@/lib/auth/session-bootstrap";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 1. Core API client instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
});

// 2. Request Interceptor: Attach Access Token from in-memory store
apiClient.interceptors.request.use(
  (config) => {
    const token = accessTokenStore.getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Checks if a request URL should bypass automatic token refresh on 401.
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

// 3. Response Interceptor: 401 Handling via Shared Single-Flight Refresh
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
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return apiClient(originalRequest);
      } catch (refreshError) {
        accessTokenStore.clearAccessToken();

        // Redirect to login with reason if in browser and on a protected route
        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          if (!pathname.startsWith("/auth/") && !pathname.startsWith("/interview/")) {
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.href = "/auth/login?reason=session_expired";
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

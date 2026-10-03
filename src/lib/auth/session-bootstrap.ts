import axios from "axios";
import { env } from "@/config/env";
import { accessTokenStore } from "./access-token-store";
import { ApiResponse } from "@/lib/api/api-response";

let refreshPromise: Promise<string> | null = null;

/**
 * Shared Single-Flight Token Refresh Function.
 *
 * Guarantees:
 * 1. Single-Flight Deduplication: Multiple concurrent 401s or React StrictMode lifecycles
 *    share the EXACT SAME in-flight refresh request.
 * 2. Dedicated Axios Instance: Direct call prevents recursive interceptor loops.
 * 3. Automatic Store Sync: Updates in-memory access token upon success; clears it upon failure.
 * 4. Browser HttpOnly Refresh Cookie: Automatically attached via `withCredentials: true`.
 */
export async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
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
        throw new Error("Phản hồi làm mới token không hợp lệ từ máy chủ.");
      }

      accessTokenStore.setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      accessTokenStore.clearAccessToken();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export default refreshAccessToken;

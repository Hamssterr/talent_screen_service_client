import { useQuery } from "@tanstack/react-query";
import { authorizationApi } from "../api/authorization.api";
import { authorizationKeys } from "../api/authorization.keys";
import { AuthorizationContext } from "../types/authorization.types";
import { accessTokenStore } from "@/lib/auth/access-token-store";

export function useAuthorizationQuery(options?: { enabled?: boolean }) {
  const hasToken = typeof window !== "undefined" && Boolean(accessTokenStore.getAccessToken());

  return useQuery<AuthorizationContext, Error>({
    queryKey: authorizationKeys.current(),
    queryFn: authorizationApi.getMyAuthorization,
    enabled: options?.enabled !== undefined ? options.enabled : hasToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";
import { authKeys } from "@/features/auth/api/auth.keys";
import { authorizationApi } from "@/features/authorization/api/authorization.api";
import { authorizationKeys } from "@/features/authorization/api/authorization.keys";
import { CurrentUser, AuthorizationContext } from "@/features/auth/types/auth.types";
import { PermissionKey } from "@/features/authorization/permission.constants";
import { can as checkCan, canAny as checkCanAny, canAll as checkCanAll } from "@/features/authorization/utils/permission-checker";
import { accessTokenStore } from "@/lib/auth/access-token-store";
import { refreshAccessToken } from "@/lib/auth/session-bootstrap";
import { SessionContextValue, SessionStatus } from "@/lib/auth/session.types";

const SessionContext = React.createContext<SessionContextValue | null>(null);

export interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = React.useState<SessionStatus>("bootstrapping");
  const [user, setUser] = React.useState<CurrentUser | null>(null);
  const [authorization, setAuthorization] = React.useState<AuthorizationContext | null>(null);

  // Synchronize session bootstrap on mount
  React.useEffect(() => {
    let isMounted = true;

    const performBootstrap = async () => {
      try {
        // 1. Obtain fresh access token via silent refresh (HttpOnly cookie)
        let token = accessTokenStore.getAccessToken();
        if (!token) {
          token = await refreshAccessToken();
        }

        if (!token) {
          if (isMounted) {
            setStatus("unauthenticated");
            setUser(null);
            setAuthorization(null);
          }
          return;
        }

        // 2. Concurrently load Current User identity and Effective Permissions
        const [currentUser, userAuth] = await Promise.all([
          queryClient.fetchQuery({
            queryKey: authKeys.currentUser(),
            queryFn: authApi.getCurrentUser,
            staleTime: 5 * 60 * 1000,
          }),
          queryClient.fetchQuery({
            queryKey: authorizationKeys.current(),
            queryFn: authorizationApi.getMyAuthorization,
            staleTime: 5 * 60 * 1000,
          }),
        ]);

        if (isMounted) {
          setUser(currentUser);
          setAuthorization(userAuth);
          setStatus("authenticated");
        }
      } catch {
        if (isMounted) {
          accessTokenStore.clearAccessToken();
          setUser(null);
          setAuthorization(null);
          setStatus("unauthenticated");
        }
      }
    };

    performBootstrap();

    return () => {
      isMounted = false;
    };
  }, [queryClient]);

  // Explicit session refresh
  const handleRefreshSession = React.useCallback(async (): Promise<string | null> => {
    try {
      setStatus("refreshing");
      const newToken = await refreshAccessToken();

      const [currentUser, userAuth] = await Promise.all([
        queryClient.fetchQuery({
          queryKey: authKeys.currentUser(),
          queryFn: authApi.getCurrentUser,
          staleTime: 5 * 60 * 1000,
        }),
        queryClient.fetchQuery({
          queryKey: authorizationKeys.current(),
          queryFn: authorizationApi.getMyAuthorization,
          staleTime: 5 * 60 * 1000,
        }),
      ]);

      setUser(currentUser);
      setAuthorization(userAuth);
      setStatus("authenticated");
      return newToken;
    } catch {
      accessTokenStore.clearAccessToken();
      setUser(null);
      setAuthorization(null);
      setStatus("unauthenticated");
      return null;
    }
  }, [queryClient]);

  // Logout from current device
  const handleLogout = React.useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("[SessionProvider] Logout revoke failed on server.", err);
    } finally {
      accessTokenStore.clearAccessToken();
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: authorizationKeys.all });
      queryClient.clear();
      setUser(null);
      setAuthorization(null);
      setStatus("unauthenticated");
    }
  }, [queryClient]);

  // Logout from all devices
  const handleLogoutAll = React.useCallback(async () => {
    try {
      await authApi.logoutAll();
    } catch (err) {
      console.warn("[SessionProvider] Logout-all revoke failed on server.", err);
    } finally {
      accessTokenStore.clearAccessToken();
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: authorizationKeys.all });
      queryClient.clear();
      setUser(null);
      setAuthorization(null);
      setStatus("unauthenticated");
    }
  }, [queryClient]);

  // Permission helpers
  const can = React.useCallback(
    (permission: PermissionKey): boolean => {
      return checkCan(authorization, permission);
    },
    [authorization],
  );

  const canAny = React.useCallback(
    (permissions: PermissionKey[]): boolean => {
      return checkCanAny(authorization, permissions);
    },
    [authorization],
  );

  const canAll = React.useCallback(
    (permissions: PermissionKey[]): boolean => {
      return checkCanAll(authorization, permissions);
    },
    [authorization],
  );

  const value = React.useMemo<SessionContextValue>(
    () => ({
      status,
      user,
      authorization,
      isBootstrapping: status === "bootstrapping",
      isAuthenticated: status === "authenticated",
      refreshSession: handleRefreshSession,
      logout: handleLogout,
      logoutAll: handleLogoutAll,
      can,
      canAny,
      canAll,
    }),
    [
      status,
      user,
      authorization,
      handleRefreshSession,
      handleLogout,
      handleLogoutAll,
      can,
      canAny,
      canAll,
    ],
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider.");
  }
  return context;
}

export default SessionProvider;

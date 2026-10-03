"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/providers/session-provider";
import { AuthLoadingScreen } from "./auth-loading-screen";

export interface AuthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Workspace Authentication Gate.
 *
 * Guarantees:
 * 1. Blocks rendering workspace children until initial session bootstrap is completed.
 * 2. Displays accessible loading screen during bootstrapping / silent refresh.
 * 3. Safely redirects unauthenticated users to /auth/login with returnTo query parameter.
 * 4. Does NOT leak unauthenticated frames.
 */
export function AuthGate({ children, fallback }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      const returnParam =
        pathname && pathname !== "/"
          ? `?returnTo=${encodeURIComponent(pathname)}`
          : "";
      router.replace(`/auth/login${returnParam}`);
    }
  }, [status, router, pathname]);

  if (status === "bootstrapping" || status === "refreshing") {
    return fallback ? <>{fallback}</> : <AuthLoadingScreen />;
  }

  if (status === "unauthenticated") {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <AuthLoadingScreen message="Đang chuyển hướng đến trang đăng nhập..." />
    );
  }

  return <>{children}</>;
}

export default AuthGate;

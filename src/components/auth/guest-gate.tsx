"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { accessTokenStore } from "@/lib/auth/access-token-store";
import { getSafeReturnTo } from "@/lib/auth/return-to";

export interface GuestGateProps {
  children: React.ReactNode;
}

/**
 * Lightweight client-side gate for public auth pages.
 * If user already has an active in-memory session, redirects to /dashboard or returnTo.
 */
export function GuestGate({ children }: GuestGateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const hasToken = typeof window !== "undefined" && Boolean(accessTokenStore.getAccessToken());
    if (hasToken) {
      const returnTo = getSafeReturnTo(searchParams.get("returnTo"));
      router.replace(returnTo);
    }
  }, [router, searchParams]);

  return <>{children}</>;
}

export default GuestGate;

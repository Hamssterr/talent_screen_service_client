"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PermissionKey } from "../permission.constants";
import { useAuthorizationQuery } from "../hooks/use-authorization";
import { can, canAny, canAll } from "../utils/permission-checker";
import { LoadingState } from "@/components/feedback/loading-state";

export interface RequirePermissionProps {
  permission?: PermissionKey;
  anyOf?: PermissionKey[];
  allOf?: PermissionKey[];
  redirectTo?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RequirePermission({
  permission,
  anyOf,
  allOf,
  redirectTo = "/unauthorized",
  fallback,
  children,
}: RequirePermissionProps) {
  const router = useRouter();
  const { data: context, isLoading } = useAuthorizationQuery();

  let isAllowed = true;
  if (permission) {
    isAllowed = can(context, permission);
  } else if (anyOf && anyOf.length > 0) {
    isAllowed = canAny(context, anyOf);
  } else if (allOf && allOf.length > 0) {
    isAllowed = canAll(context, allOf);
  }

  React.useEffect(() => {
    if (!isLoading && !isAllowed && redirectTo) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAllowed, redirectTo, router]);

  if (isLoading) {
    return <LoadingState mode="page" title="Đang kiểm tra quyền truy cập..." />;
  }

  if (!isAllowed) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

export default RequirePermission;

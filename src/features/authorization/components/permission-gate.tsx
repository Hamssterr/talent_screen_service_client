import * as React from "react";
import { PermissionKey } from "../permission.constants";
import { useAuthorizationQuery } from "../hooks/use-authorization";
import { can, canAny, canAll } from "../utils/permission-checker";

export interface PermissionGateProps {
  permission?: PermissionKey;
  anyOf?: PermissionKey[];
  allOf?: PermissionKey[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Presentation-level permission gate.
 * Conditionally renders children if the authenticated user holds the required permissions.
 *
 * NOTE: PermissionGate controls UI presentation only. The backend API is always the final enforcement boundary.
 */
export function PermissionGate({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { data: context, isLoading } = useAuthorizationQuery();

  if (isLoading) {
    return null;
  }

  let isAllowed = true;

  if (permission) {
    isAllowed = can(context, permission);
  } else if (anyOf && anyOf.length > 0) {
    isAllowed = canAny(context, anyOf);
  } else if (allOf && allOf.length > 0) {
    isAllowed = canAll(context, allOf);
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default PermissionGate;

import * as React from "react";
import { PermissionKey } from "../permission.constants";
import { can as checkCan, canAny as checkCanAny, canAll as checkCanAll } from "../utils/permission-checker";
import { useAuthorizationQuery } from "./use-authorization";

export function useCan(permission?: PermissionKey): boolean {
  const { data: authContext } = useAuthorizationQuery();
  return React.useMemo(() => {
    if (!permission) return true;
    return checkCan(authContext, permission);
  }, [authContext, permission]);
}

export function useCanAny(permissions: PermissionKey[]): boolean {
  const { data: authContext } = useAuthorizationQuery();
  return React.useMemo(() => {
    return checkCanAny(authContext, permissions);
  }, [authContext, permissions]);
}

export function useCanAll(permissions: PermissionKey[]): boolean {
  const { data: authContext } = useAuthorizationQuery();
  return React.useMemo(() => {
    return checkCanAll(authContext, permissions);
  }, [authContext, permissions]);
}

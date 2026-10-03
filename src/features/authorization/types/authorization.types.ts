import { PermissionKey, SystemRoleKey } from "../permission.constants";

export type { PermissionKey, SystemRoleKey };

export interface AuthorizationContext {
  roles: string[];
  permissions: string[];
}

export interface PermissionCheckOptions {
  context: AuthorizationContext | null;
  permission?: PermissionKey;
  anyOf?: PermissionKey[];
  allOf?: PermissionKey[];
}

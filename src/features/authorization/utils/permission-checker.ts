import { AuthorizationContext } from "../types/authorization.types";
import { PermissionKey } from "../permission.constants";

/**
 * Pure authorization checker functions.
 *
 * Rules:
 * - If context is null/undefined or permissions array is empty, returns false.
 * - Does NOT mutate input context or arrays.
 * - Does NOT hardcode admin bypass (NestJS backend provides all effective permissions directly).
 */

export function can(
  context: AuthorizationContext | null | undefined,
  permission: PermissionKey,
): boolean {
  if (!context || !Array.isArray(context.permissions)) {
    return false;
  }
  return context.permissions.includes(permission);
}

export function canAny(
  context: AuthorizationContext | null | undefined,
  permissions: PermissionKey[],
): boolean {
  if (!context || !Array.isArray(context.permissions) || permissions.length === 0) {
    return false;
  }
  return permissions.some((perm) => context.permissions.includes(perm));
}

export function canAll(
  context: AuthorizationContext | null | undefined,
  permissions: PermissionKey[],
): boolean {
  if (!context || !Array.isArray(context.permissions) || permissions.length === 0) {
    return false;
  }
  return permissions.every((perm) => context.permissions.includes(perm));
}

export function hasRole(
  context: AuthorizationContext | null | undefined,
  roleKey: string,
): boolean {
  if (!context || !Array.isArray(context.roles)) {
    return false;
  }
  return context.roles.includes(roleKey);
}

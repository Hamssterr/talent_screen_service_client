import { CurrentUser, AuthorizationContext } from "@/features/auth/types/auth.types";
import { PermissionKey } from "@/features/authorization/permission.constants";

export type SessionStatus =
  | "bootstrapping"
  | "authenticated"
  | "unauthenticated"
  | "refreshing";

export interface SessionContextValue {
  status: SessionStatus;
  user: CurrentUser | null;
  authorization: AuthorizationContext | null;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<string | null>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  can: (permission: PermissionKey) => boolean;
  canAny: (permissions: PermissionKey[]) => boolean;
  canAll: (permissions: PermissionKey[]) => boolean;
}

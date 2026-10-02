/**
 * Domain types for authentication and authorization.
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ActivateAccountRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/**
 * Current authenticated user identity matching GET /auth/me payload.
 */
export interface CurrentUser {
  id: string;
  email: string;
  name?: string;
  status?: string;
}

/**
 * Normalized user roles and effective permissions matching GET /authorization/me.
 */
export interface AuthorizationContext {
  roles: string[];
  permissions: string[];
}

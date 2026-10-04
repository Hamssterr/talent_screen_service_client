import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import { authKeys } from "../api/auth.keys";
import {
  ActivateAccountRequest,
  ChangePasswordRequest,
  CurrentUser,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResult,
  ResetPasswordRequest,
} from "../types/auth.types";
import { accessTokenStore } from "@/lib/auth/access-token-store";
import { authorizationKeys } from "@/features/authorization/api/authorization.keys";

/**
 * Mutation hook for login.
 */
export const useLoginMutation = (
  options?: UseMutationOptions<LoginResult, Error, LoginRequest>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      if (data?.accessToken) {
        accessTokenStore.setAccessToken(data.accessToken);
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        queryClient.invalidateQueries({ queryKey: authorizationKeys.all });
      }
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

/**
 * Mutation hook for logout.
 */
export interface LogoutMutationOptions extends UseMutationOptions<
  void,
  Error,
  void
> {
  redirectTo?: string | false;
}

/**
 * Mutation hook for logout.
 */
export const useLogoutMutation = (options?: LogoutMutationOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch (err) {
        // Even if server revoke fails (e.g. session already expired or network issue), proceed to clear client session
        console.warn(
          "[Auth] Server logout notification failed, clearing local session.",
          err,
        );
      }
    },
    ...options,
    onSettled: (...args) => {
      accessTokenStore.clearAccessToken();
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: authorizationKeys.all });
      queryClient.clear(); // Clear all cached query data for security
      if (options?.redirectTo !== false) {
        router.push(options?.redirectTo ?? "/auth/login");
      }
      if (options?.onSettled) {
        options.onSettled(...args);
      }
    },
  });
};

/**
 * Mutation hook for logout from all devices.
 */
export const useLogoutAllMutation = (options?: LogoutMutationOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await authApi.logoutAll();
    },
    ...options,
    onSettled: (...args) => {
      accessTokenStore.clearAccessToken();
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: authorizationKeys.all });
      queryClient.clear();
      if (options?.redirectTo !== false) {
        router.push(options?.redirectTo ?? "/auth/login");
      }
      if (options?.onSettled) {
        options.onSettled(...args);
      }
    },
  });
};

/**
 * Mutation hook for forgot password.
 */
export const useForgotPasswordMutation = (
  options?: UseMutationOptions<
    { message: string | null },
    Error,
    ForgotPasswordRequest
  >,
) => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    ...options,
  });
};

/**
 * Mutation hook for reset password.
 */
export const useResetPasswordMutation = (
  options?: UseMutationOptions<
    { message: string | null },
    Error,
    ResetPasswordRequest
  >,
) => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    ...options,
  });
};

/**
 * Mutation hook for activate account.
 */
export const useActivateAccountMutation = (
  options?: UseMutationOptions<
    { message: string | null },
    Error,
    ActivateAccountRequest
  >,
) => {
  return useMutation({
    mutationFn: (data: ActivateAccountRequest) => authApi.activateAccount(data),
    ...options,
  });
};

/**
 * Mutation hook for change password.
 */
export const useChangePasswordMutation = (
  options?: UseMutationOptions<
    { message: string | null },
    Error,
    ChangePasswordRequest
  >,
) => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    ...options,
  });
};

/**
 * Query hook for current user identity matching GET /auth/me.
 */
export const useCurrentUserQuery = (
  options?: Omit<
    UseQueryOptions<CurrentUser, Error, CurrentUser, readonly unknown[]>,
    "queryKey" | "queryFn"
  >,
) => {
  const hasToken =
    typeof window !== "undefined" && Boolean(accessTokenStore.getAccessToken());

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authApi.getCurrentUser(),
    enabled:
      hasToken && (options?.enabled !== undefined ? options.enabled : true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...options,
  });
};

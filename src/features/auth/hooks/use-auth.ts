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
  AuthorizationContext,
  CurrentUser,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResult,
  ResetPasswordRequest,
} from "../types/auth.types";
import { tokenStorage } from "@/lib/auth/token-storage";

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
        tokenStorage.setAccessToken(data.accessToken);
        // Invalidate auth queries so that fresh user profile and permissions will be loaded
        queryClient.invalidateQueries({ queryKey: authKeys.all });
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
export const useLogoutMutation = (
  options?: UseMutationOptions<void, Error, void>,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch (err) {
        // Even if server revoke fails (e.g. network lost), proceed to clear client session
        console.warn("[Auth] Server logout failed, clearing local session.", err);
      }
    },
    ...options,
    onSettled: (...args) => {
      tokenStorage.clearAccessToken();
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear(); // Clear all cached query data for security
      router.push("/auth/login");
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
 * Query hook for current user identity.
 */
export const useCurrentUserQuery = (
  options?: Omit<
    UseQueryOptions<CurrentUser, Error, CurrentUser, readonly unknown[]>,
    "queryKey" | "queryFn"
  >,
) => {
  const hasToken = typeof window !== "undefined" ? !!tokenStorage.getAccessToken() : false;

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authApi.getCurrentUser(),
    enabled: hasToken && (options?.enabled !== undefined ? options.enabled : true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...options,
  });
};

/**
 * Query hook for user authorization (roles and permissions).
 */
export const useAuthorizationQuery = (
  options?: Omit<
    UseQueryOptions<
      AuthorizationContext,
      Error,
      AuthorizationContext,
      readonly unknown[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const hasToken = typeof window !== "undefined" ? !!tokenStorage.getAccessToken() : false;

  return useQuery({
    queryKey: authKeys.authorization(),
    queryFn: () => authApi.getMyAuthorization(),
    enabled: hasToken && (options?.enabled !== undefined ? options.enabled : true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...options,
  });
};

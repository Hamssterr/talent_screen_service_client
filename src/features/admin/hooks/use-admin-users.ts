import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { adminUsersApi } from "../api/admin-users.api";
import { adminKeys } from "../api/admin.keys";
import {
  AdminUserDetail,
  AdminUserListItem,
  AdminUserListParams,
  AssignUserRolesRequest,
  InviteUserRequest,
  PaginatedResult,
} from "../types/admin.types";

/**
 * Query hook to list admin users with filtering and pagination.
 */
export const useAdminUsersQuery = (
  params?: AdminUserListParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResult<AdminUserListItem>,
      Error,
      PaginatedResult<AdminUserListItem>,
      readonly unknown[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminKeys.users.list(params),
    queryFn: () => adminUsersApi.listUsers(params),
    ...options,
  });
};

/**
 * Query hook to fetch detail of a specific user.
 */
export const useAdminUserDetailQuery = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      AdminUserDetail,
      Error,
      AdminUserDetail,
      readonly unknown[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminKeys.users.detail(id),
    queryFn: () => adminUsersApi.getUser(id),
    enabled: Boolean(id) && (options?.enabled !== undefined ? options.enabled : true),
    ...options,
  });
};

/**
 * Mutation hook to invite a new user.
 */
export const useInviteUserMutation = (
  options?: UseMutationOptions<
    { message: string; user: AdminUserListItem },
    Error,
    InviteUserRequest
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserRequest) => adminUsersApi.inviteUser(data),
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all });
      toast.success(data?.message || "Gửi lời mời thành công");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể gửi lời mời tham gia");
      options?.onError?.(...args);
    },
  });
};

/**
 * Mutation hook to resend invitation email to pending user.
 */
export const useResendInvitationMutation = (
  options?: UseMutationOptions<{ message: string }, Error, string>,
) => {
  return useMutation({
    mutationFn: (id: string) => adminUsersApi.resendInvitation(id),
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      toast.success(data?.message || "Đã gửi lại email kích hoạt");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể gửi lại email kích hoạt");
      options?.onError?.(...args);
    },
  });
};

/**
 * Mutation hook to assign roles to user.
 */
export const useAssignUserRolesMutation = (
  options?: UseMutationOptions<
    { message: string; roles: string[] },
    Error,
    { id: string; data: AssignUserRolesRequest }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminUsersApi.assignRoles(id, data),
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all });
      toast.success(data?.message || "Cập nhật vai trò thành công");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể cập nhật vai trò người dùng");
      options?.onError?.(...args);
    },
  });
};

/**
 * Mutation hook to remove a specific role from user.
 */
export const useRemoveUserRoleMutation = (
  options?: UseMutationOptions<
    { message: string },
    Error,
    { id: string; roleKey: string }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleKey }) => adminUsersApi.removeRole(id, roleKey),
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all });
      toast.success(data?.message || "Đã gỡ vai trò khỏi người dùng");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể gỡ vai trò người dùng");
      options?.onError?.(...args);
    },
  });
};

/**
 * Mutation hook to disable user account.
 */
export const useDisableUserMutation = (
  options?: UseMutationOptions<{ message: string }, Error, string>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminUsersApi.disableUser(id),
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all });
      toast.success(data?.message || "Đã vô hiệu hóa tài khoản");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể vô hiệu hóa tài khoản");
      options?.onError?.(...args);
    },
  });
};

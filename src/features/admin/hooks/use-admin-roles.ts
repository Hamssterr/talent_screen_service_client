import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { adminRolesApi } from "../api/admin-roles.api";
import { adminKeys } from "../api/admin.keys";
import {
  AdminRole,
  AdminRoleListParams,
  BulkRolePermissionsRequest,
  BulkRolePermissionsResponse,
  CreateRoleRequest,
  PaginatedResult,
} from "../types/admin.types";

/**
 * Query hook to list roles.
 */
export const useAdminRolesQuery = (
  params?: AdminRoleListParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResult<AdminRole>,
      Error,
      PaginatedResult<AdminRole>,
      readonly unknown[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminKeys.roles.list(params),
    queryFn: () => adminRolesApi.listRoles(params),
    ...options,
  });
};

/**
 * Mutation hook to create a new role.
 */
export const useCreateRoleMutation = (
  options?: UseMutationOptions<
    { message: string; role: AdminRole },
    Error,
    CreateRoleRequest
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => adminRolesApi.createRole(data),
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.invalidateQueries({ queryKey: adminKeys.roles.all });
      toast.success(data?.message || "Tạo vai trò thành công");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể tạo vai trò");
      options?.onError?.(...args);
    },
  });
};

/**
 * Mutation hook to grant permissions to a role.
 */
export const useGrantRolePermissionsMutation = (
  options?: UseMutationOptions<
    { message: string; permissions: string[] },
    Error,
    { id: string; permissionKeys: string[] }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionKeys }) =>
      adminRolesApi.grantPermissions(id, permissionKeys),
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.invalidateQueries({ queryKey: adminKeys.roles.all });
      toast.success(data?.message || "Gán quyền thành công");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể gán quyền cho vai trò");
      options?.onError?.(...args);
    },
  });
};

/**
 * Mutation hook to revoke a permission from a role.
 */
export const useRevokeRolePermissionMutation = (
  options?: UseMutationOptions<
    { message: string },
    Error,
    { id: string; permissionKey: string }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionKey }) =>
      adminRolesApi.revokePermission(id, permissionKey),
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.invalidateQueries({ queryKey: adminKeys.roles.all });
      toast.success(data?.message || "Thu hồi quyền thành công");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể thu hồi quyền từ vai trò");
      options?.onError?.(...args);
    },
  });
};

/**
 * Mutation hook to bulk grant or revoke permissions across multiple roles.
 */
export const useBulkMutateRolePermissionsMutation = (
  options?: UseMutationOptions<
    BulkRolePermissionsResponse,
    Error,
    BulkRolePermissionsRequest
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkRolePermissionsRequest) =>
      adminRolesApi.bulkMutatePermissions(data),
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.invalidateQueries({ queryKey: adminKeys.roles.all });
      toast.success(
        data?.message || `Đã cập nhật quyền cho ${data?.affected} vai trò`,
      );
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể cập nhật phân quyền hàng loạt");
      options?.onError?.(...args);
    },
  });
};

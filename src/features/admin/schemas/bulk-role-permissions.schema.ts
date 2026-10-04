import { z } from "zod";

export const bulkRolePermissionsSchema = z.object({
  roleIds: z
    .array(z.string().uuid("ID vai trò không hợp lệ"))
    .min(1, "Vui lòng chọn ít nhất một vai trò"),
  permissionKeys: z
    .array(z.string().min(1, "Mã quyền không hợp lệ"))
    .min(1, "Vui lòng chọn ít nhất một quyền hạn"),
  mode: z.enum(["grant", "revoke"], {
    message: "Chế độ phải là 'grant' (cấp quyền) hoặc 'revoke' (thu hồi)",
  }),
});

export type BulkRolePermissionsFormData = z.infer<typeof bulkRolePermissionsSchema>;

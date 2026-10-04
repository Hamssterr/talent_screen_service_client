import { z } from "zod";

export const assignUserRolesSchema = z.object({
  roleKeys: z
    .array(z.string().min(1, "Vai trò không hợp lệ"))
    .min(1, "Vui lòng chọn ít nhất một vai trò")
    .max(20, "Không thể gán vượt quá 20 vai trò cùng lúc"),
});

export type AssignUserRolesFormData = z.infer<typeof assignUserRolesSchema>;

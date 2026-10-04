import { z } from "zod";

export const inviteUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự"),
  email: z
    .string()
    .trim()
    .email("Email không đúng định dạng")
    .toLowerCase(),
  roleKeys: z
    .array(z.string().min(1, "Vai trò không hợp lệ"))
    .min(1, "Vui lòng chọn ít nhất một vai trò")
    .max(10, "Không thể gán vượt quá 10 vai trò cùng lúc"),
});

export type InviteUserFormData = z.infer<typeof inviteUserSchema>;

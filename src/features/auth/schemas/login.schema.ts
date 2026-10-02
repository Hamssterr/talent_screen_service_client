import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không đúng định dạng"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có từ 8 đến 100 ký tự")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

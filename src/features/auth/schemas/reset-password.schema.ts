import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải có từ 8 đến 100 ký tự")
      .max(100, "Mật khẩu mới không được vượt quá 100 ký tự"),
    confirmPassword: z
      .string()
      .min(8, "Vui lòng xác nhận mật khẩu mới")
      .max(100, "Mật khẩu xác nhận không được vượt quá 100 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

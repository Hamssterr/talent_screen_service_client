import { z } from "zod";

export const activateAccountSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mật khẩu phải có từ 8 đến 100 ký tự")
      .max(100, "Mật khẩu không được vượt quá 100 ký tự"),
    confirmPassword: z
      .string()
      .min(8, "Vui lòng xác nhận mật khẩu")
      .max(100, "Mật khẩu xác nhận không được vượt quá 100 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ActivateAccountFormValues = z.infer<typeof activateAccountSchema>;

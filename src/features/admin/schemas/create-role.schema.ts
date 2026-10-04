import { z } from "zod";

export const createRoleSchema = z.object({
  key: z
    .string()
    .trim()
    .regex(
      /^[a-z][a-z0-9-]{1,79}$/,
      "Mã vai trò phải bắt đầu bằng chữ cái thường và chỉ chứa chữ thường, số, dấu gạch ngang (2-80 ký tự)",
    ),
  name: z
    .string()
    .trim()
    .min(2, "Tên vai trò phải có ít nhất 2 ký tự")
    .max(120, "Tên vai trò không được vượt quá 120 ký tự"),
  description: z
    .string()
    .trim()
    .max(500, "Mô tả không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;

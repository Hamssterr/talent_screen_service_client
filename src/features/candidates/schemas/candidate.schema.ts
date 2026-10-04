import { z } from "zod";

export const candidateFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Họ và tên không được để trống")
    .max(200, "Họ và tên không được vượt quá 200 ký tự"),
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Định dạng email không hợp lệ")
    .max(254, "Email không được vượt quá 254 ký tự"),
  phone: z
    .string()
    .trim()
    .max(40, "Số điện thoại không được vượt quá 40 ký tự")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type CandidateFormData = z.infer<typeof candidateFormSchema>;

import { z } from "zod";

export const createApplicationSchema = z.object({
  candidateId: z
    .string()
    .min(1, "Vui lòng chọn ứng viên")
    .uuid("Mã định danh ứng viên không hợp lệ"),
  jobId: z
    .string()
    .min(1, "Vui lòng chọn vị trí tuyển dụng")
    .uuid("Mã định danh vị trí tuyển dụng không hợp lệ"),
  notes: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type CreateApplicationFormData = z.infer<typeof createApplicationSchema>;

export const updateApplicationSchema = z.object({
  expectedVersion: z.number().int().min(1, "expectedVersion không hợp lệ"),
  notes: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type UpdateApplicationFormData = z.infer<typeof updateApplicationSchema>;

export const withdrawApplicationSchema = z.object({
  expectedVersion: z.number().int().min(1, "expectedVersion không hợp lệ"),
  reason: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type WithdrawApplicationFormData = z.infer<typeof withdrawApplicationSchema>;

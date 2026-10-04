import { z } from "zod";

export const evaluationCriterionSchema = z.object({
  id: z.string().optional(),
  _clientId: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Tên tiêu chí không được để trống")
    .max(120, "Tên tiêu chí không được vượt quá 120 ký tự"),
  description: z
    .string()
    .trim()
    .min(1, "Mô tả tiêu chí không được để trống")
    .max(1000, "Mô tả tiêu chí không được vượt quá 1000 ký tự"),
});

export const singleSkillSchema = z
  .string()
  .trim()
  .min(1, "Kỹ năng không được để trống")
  .max(100, "Kỹ năng không được vượt quá 100 ký tự");

export const jobFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Tiêu đề không được để trống")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  description: z
    .string()
    .trim()
    .min(1, "Mô tả không được để trống")
    .max(20000, "Mô tả không được vượt quá 20.000 ký tự"),
  requiredSkills: z
    .array(singleSkillSchema)
    .max(50, "Tối đa 50 kỹ năng yêu cầu"),
  evaluationCriteria: z
    .array(evaluationCriterionSchema)
    .max(10, "Tối đa 10 tiêu chí đánh giá"),
  status: z.enum(["draft", "open"], {
    message: "Trạng thái phải là 'draft' (bản nháp) hoặc 'open' (đang tuyển)",
  }),
});

export type JobFormData = z.infer<typeof jobFormSchema>;

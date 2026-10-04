import { z } from "zod";

export const cvSkillEvidenceSchema = z.object({
  page: z
    .number()
    .int("Trang phải là số nguyên")
    .min(1, "Trang tối thiểu là 1")
    .optional(),
  quote: z
    .string()
    .max(500, "Đoạn trích dẫn không được vượt quá 500 ký tự")
    .optional(),
});

export const cvSkillSchema = z.object({
  name: z
    .string()
    .min(1, "Tên kỹ năng không được để trống")
    .max(100, "Tên kỹ năng không được vượt quá 100 ký tự"),
  evidence: cvSkillEvidenceSchema.optional(),
});

export const cvExperienceSchema = z.object({
  role: z
    .string()
    .min(1, "Vị trí/vai trò không được để trống")
    .max(150, "Vị trí không được vượt quá 150 ký tự"),
  organization: z
    .string()
    .max(150, "Tên công ty/tổ chức không được vượt quá 150 ký tự")
    .nullable()
    .optional(),
  startDate: z
    .string()
    .max(50, "Ngày bắt đầu không được vượt quá 50 ký tự")
    .nullable()
    .optional(),
  endDate: z
    .string()
    .max(50, "Ngày kết thúc không được vượt quá 50 ký tự")
    .nullable()
    .optional(),
  description: z
    .string()
    .max(2000, "Mô tả công việc không được vượt quá 2000 ký tự")
    .nullable()
    .optional(),
});

export const cvProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Tên dự án không được để trống")
    .max(150, "Tên dự án không được vượt quá 150 ký tự"),
  technologies: z
    .array(z.string().max(100, "Tên công nghệ tối đa 100 ký tự"))
    .max(30, "Tối đa 30 công nghệ cho một dự án"),
  contribution: z
    .string()
    .max(2000, "Đóng góp không được vượt quá 2000 ký tự")
    .nullable()
    .optional(),
  evidence: cvSkillEvidenceSchema.optional(),
});

export const cvEducationSchema = z.object({
  institution: z
    .string()
    .max(150, "Tên cơ sở giáo dục không được vượt quá 150 ký tự")
    .nullable()
    .optional(),
  degree: z
    .string()
    .max(100, "Bằng cấp không được vượt quá 100 ký tự")
    .nullable()
    .optional(),
  field: z
    .string()
    .max(100, "Chuyên ngành không được vượt quá 100 ký tự")
    .nullable()
    .optional(),
  startDate: z
    .string()
    .max(50, "Ngày bắt đầu không được vượt quá 50 ký tự")
    .nullable()
    .optional(),
  endDate: z
    .string()
    .max(50, "Ngày kết thúc không được vượt quá 50 ký tự")
    .nullable()
    .optional(),
});

export const cvProfileV1Schema = z.object({
  schemaVersion: z.literal("profile.v1"),
  summary: z
    .string()
    .max(3000, "Tóm tắt không được vượt quá 3000 ký tự")
    .nullable()
    .optional(),
  skills: z
    .array(cvSkillSchema)
    .max(50, "Tối đa 50 kỹ năng"),
  experiences: z
    .array(cvExperienceSchema)
    .max(30, "Tối đa 30 kinh nghiệm làm việc"),
  projects: z
    .array(cvProjectSchema)
    .max(30, "Tối đa 30 dự án"),
  education: z
    .array(cvEducationSchema)
    .max(20, "Tối đa 20 mục học vấn"),
  missingInformation: z
    .array(z.string().max(300, "Mỗi mục thông tin thiếu tối đa 300 ký tự"))
    .max(50, "Tối đa 50 mục thông tin còn thiếu"),
});

export type CvProfileV1FormData = z.infer<typeof cvProfileV1Schema>;

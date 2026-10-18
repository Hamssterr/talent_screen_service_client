import { z } from "zod";

export const createQuestionSetSchema = z
  .object({
    mode: z.enum(["manual", "ai"]),
    cvVersionId: z.string().uuid("cvVersionId phải là UUID hợp lệ").optional(),
    language: z.enum(["vi", "en"]),
    questionCount: z.number().int().min(1, "Số câu hỏi tối thiểu là 1").max(12, "Số câu hỏi tối đa là 12"),
  })
  .refine(
    (data) => {
      if (data.mode === "manual" && !data.cvVersionId) {
        return false;
      }
      return true;
    },
    {
      message: "cvVersionId không được để trống khi tạo thủ công",
      path: ["cvVersionId"],
    },
  );

export type CreateQuestionSetFormValues = z.infer<typeof createQuestionSetSchema>;

export const questionItemInputSchema = z
  .object({
    position: z.number().int().min(1).max(12),
    text: z
      .string()
      .trim()
      .min(5, "Nội dung câu hỏi phải có ít nhất 5 ký tự")
      .max(2000, "Nội dung câu hỏi không được vượt quá 2000 ký tự"),
    competency: z
      .string()
      .trim()
      .max(150, "Năng lực không được vượt quá 150 ký tự")
      .optional()
      .nullable(),
    evaluationCriterionId: z.string().trim().optional().nullable(),
    difficulty: z.enum(["basic", "intermediate", "advanced"]).default("intermediate"),
    allowFollowUp: z.boolean().default(true),
    maxFollowUps: z.coerce
      .number()
      .int()
      .min(0, "Số câu follow-up tối thiểu là 0")
      .max(2, "Số câu follow-up tối đa là 2")
      .default(1),
    evidenceRefs: z.array(z.unknown()).optional().nullable(),
    reviewNotes: z.string().trim().optional().nullable(),
  })
  .transform((item) => ({
    ...item,
    competency: item.competency && item.competency.trim().length > 0 ? item.competency.trim() : null,
    evaluationCriterionId:
      item.evaluationCriterionId && item.evaluationCriterionId.trim().length > 0
        ? item.evaluationCriterionId.trim()
        : null,
    reviewNotes:
      item.reviewNotes && item.reviewNotes.trim().length > 0 ? item.reviewNotes.trim() : null,
    maxFollowUps: item.allowFollowUp ? item.maxFollowUps : 0,
  }));

export const updateQuestionSetItemsSchema = z.object({
  expectedVersion: z.number().int().min(1, "expectedVersion không hợp lệ"),
  items: z
    .array(questionItemInputSchema)
    .min(1, "Bộ câu hỏi phải có ít nhất 1 câu hỏi")
    .max(12, "Bộ câu hỏi tối đa 12 câu hỏi")
    .refine(
      (items) => {
        // Check continuous positions 1..N
        for (let i = 0; i < items.length; i++) {
          if (items[i].position !== i + 1) {
            return false;
          }
        }
        return true;
      },
      {
        message: "Thứ tự câu hỏi phải liên tục bắt đầu từ vị trí 1",
      },
    ),
});

export type UpdateQuestionSetItemsFormValues = z.infer<typeof updateQuestionSetItemsSchema>;

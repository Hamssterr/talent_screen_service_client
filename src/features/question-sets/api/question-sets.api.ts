import { apiClient } from "@/lib/api/api-client";
import { unwrapResponse, unwrapPaginatedResponse } from "@/lib/api/unwrap-response";
import { ApiResponse, PaginatedResponse } from "@/lib/api/api-response";
import {
  QuestionSetSummary,
  QuestionSetDetail,
  CreateQuestionSetInput,
  UpdateQuestionSetItemsInput,
  ApproveQuestionSetInput,
  RetryQuestionGenerationInput,
  ListQuestionSetsParams,
  PaginatedQuestionSetsResult,
} from "../types/question-set.types";

export const questionSetsApi = {
  /**
   * Tạo Question Set thủ công (manual) hoặc bằng AI Gemini.
   * Với mode=ai, bắt buộc truyền header Idempotency-Key.
   */
  async createQuestionSet(
    applicationId: string,
    data: CreateQuestionSetInput,
    idempotencyKey?: string,
  ): Promise<QuestionSetDetail> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    }

    const res = await apiClient.post<ApiResponse<QuestionSetDetail>>(
      `/applications/${applicationId}/question-sets`,
      data,
      { headers },
    );

    return unwrapResponse(res);
  },

  /**
   * Lấy danh sách Question Sets của một Application (Phân trang offset).
   */
  async listByApplication(
    applicationId: string,
    params?: ListQuestionSetsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedQuestionSetsResult> {
    const res = await apiClient.get<PaginatedResponse<QuestionSetSummary>>(
      `/applications/${applicationId}/question-sets`,
      {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
        signal,
      },
    );

    return unwrapPaginatedResponse(res);
  },

  /**
   * Lấy chi tiết Question Set kèm snapshot và danh sách câu hỏi.
   */
  async getQuestionSet(id: string, signal?: AbortSignal): Promise<QuestionSetDetail> {
    const res = await apiClient.get<ApiResponse<QuestionSetDetail>>(
      `/question-sets/${id}`,
      { signal },
    );

    return unwrapResponse(res);
  },

  /**
   * Thay thế toàn bộ danh sách câu hỏi của Question Set (Atomic Replace / Reorder) với expectedVersion (OCC).
   */
  async updateItems(
    id: string,
    data: UpdateQuestionSetItemsInput,
  ): Promise<QuestionSetDetail> {
    const res = await apiClient.put<ApiResponse<QuestionSetDetail>>(
      `/question-sets/${id}/items`,
      data,
    );

    return unwrapResponse(res);
  },

  /**
   * Phê duyệt Question Set (khóa bất biến) với expectedVersion (OCC).
   */
  async approve(
    id: string,
    data: ApproveQuestionSetInput,
  ): Promise<QuestionSetDetail> {
    const res = await apiClient.post<ApiResponse<QuestionSetDetail>>(
      `/question-sets/${id}/approve`,
      data,
    );

    return unwrapResponse(res);
  },

  /**
   * Nhân bản (clone) Question Set thành một draft mới độc lập.
   */
  async clone(id: string): Promise<QuestionSetDetail> {
    const res = await apiClient.post<ApiResponse<QuestionSetDetail>>(
      `/question-sets/${id}/clone`,
      {},
    );

    return unwrapResponse(res);
  },

  /**
   * Thử lại việc sinh bộ câu hỏi bằng AI khi thất bại hoặc stale với expectedGenerationVersion (OCC) và Idempotency-Key.
   */
  async retryGeneration(
    id: string,
    data: RetryQuestionGenerationInput,
    idempotencyKey: string,
  ): Promise<QuestionSetDetail> {
    const res = await apiClient.post<ApiResponse<QuestionSetDetail>>(
      `/question-sets/${id}/retry-generation`,
      data,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      },
    );

    return unwrapResponse(res);
  },

  /**
   * Xóa mềm Question Set (chỉ Admin có quyền question-sets:manage).
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/question-sets/${id}`);
  },
};

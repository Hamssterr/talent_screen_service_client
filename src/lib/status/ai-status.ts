import { StatusPresentation } from "./status.types";

export type AiRunStatusKey = "processing" | "succeeded" | "failed" | "superseded";
export type AiRunStatus = AiRunStatusKey;

export const AI_RUN_STATUS_MAP: Record<AiRunStatusKey, StatusPresentation> = {
  processing: {
    label: "Đang phân tích AI",
    tone: "ai",
    description: "Mô hình AI đang trích xuất dữ liệu hoặc xử lý đánh giá",
  },
  succeeded: {
    label: "Phân tích hoàn tất",
    tone: "success",
    description: "Kết quả xử lý AI đã sẵn sàng và được lưu vào hệ thống",
  },
  failed: {
    label: "Phân tích thất bại",
    tone: "danger",
    description: "Có lỗi xảy ra trong quá trình xử lý của mô hình AI",
  },
  superseded: {
    label: "Đã thay thế",
    tone: "neutral",
    description: "Kết quả đã được thay thế bởi phiên xử lý mới hơn",
  },
};

export type CvExtractionStatusKey =
  | "pending"
  | "processing"
  | "ready"
  | "failed"
  | "needs_manual_input";

export type CvExtractionStatus = CvExtractionStatusKey;

export const CV_EXTRACTION_STATUS_MAP: Record<CvExtractionStatusKey, StatusPresentation> = {
  pending: {
    label: "Chờ trích xuất",
    tone: "neutral",
    description: "Tài liệu CV đang chờ được trích xuất thông tin",
  },
  processing: {
    label: "Đang đọc CV",
    tone: "ai",
    description: "AI đang phân tích và chuẩn hóa thông tin từ tệp CV",
  },
  ready: {
    label: "Hồ sơ hoàn tất",
    tone: "success",
    description: "Hồ sơ ứng viên đã được trích xuất thành công",
  },
  failed: {
    label: "Lỗi trích xuất",
    tone: "danger",
    description: "Không thể đọc nội dung tệp CV (có thể do tệp bị khóa hoặc lỗi định dạng)",
  },
  needs_manual_input: {
    label: "Cần bổ sung",
    tone: "warning",
    description: "CV thiếu một số trường thông tin bắt buộc, cần nhập thủ công",
  },
};

export function getAiRunStatusPresentation(status?: string | null): StatusPresentation {
  if (!status || !(status in AI_RUN_STATUS_MAP)) {
    return { label: status || "Chưa xác định", tone: "neutral" };
  }
  return AI_RUN_STATUS_MAP[status as AiRunStatusKey];
}

export function getCvExtractionStatusPresentation(status?: string | null): StatusPresentation {
  if (!status || !(status in CV_EXTRACTION_STATUS_MAP)) {
    return { label: status || "Chưa xác định", tone: "neutral" };
  }
  return CV_EXTRACTION_STATUS_MAP[status as CvExtractionStatusKey];
}

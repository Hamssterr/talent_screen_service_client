import { StatusPresentation } from "./status.types";

export type InterviewStatusKey =
  | "invited"
  | "in_progress"
  | "completed"
  | "expired"
  | "cancelled";

export type InterviewStatus = InterviewStatusKey;

export const INTERVIEW_STATUS_MAP: Record<InterviewStatusKey, StatusPresentation> = {
  invited: {
    label: "Đã gửi thư mời",
    tone: "info",
    description: "Thư mời phỏng vấn đã được phát hành tới ứng viên",
  },
  in_progress: {
    label: "Đang diễn ra",
    tone: "info",
    description: "Ứng viên đã bắt đầu phiên phỏng vấn",
  },
  completed: {
    label: "Đã hoàn thành",
    tone: "success",
    description: "Ứng viên đã trả lời toàn bộ câu hỏi phỏng vấn",
  },
  expired: {
    label: "Đã hết hạn",
    tone: "warning",
    description: "Liên kết thư mời đã quá thời hạn truy cập",
  },
  cancelled: {
    label: "Đã hủy",
    tone: "danger",
    description: "Phiên phỏng vấn đã bị thu hồi hoặc hủy bỏ",
  },
};

export function getInterviewStatusPresentation(status?: string | null): StatusPresentation {
  if (!status || !(status in INTERVIEW_STATUS_MAP)) {
    return { label: status || "Chưa xác định", tone: "neutral" };
  }
  return INTERVIEW_STATUS_MAP[status as InterviewStatusKey];
}

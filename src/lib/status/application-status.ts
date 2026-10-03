import { StatusPresentation } from "./status.types";

export type ApplicationStatusKey =
  | "shortlisted"
  | "interviewing"
  | "under_review"
  | "approved"
  | "rejected"
  | "withdrawn";

export type ApplicationStatus = ApplicationStatusKey;

export const APPLICATION_STATUS_MAP: Record<ApplicationStatusKey, StatusPresentation> = {
  shortlisted: {
    label: "Đã sơ tuyển",
    tone: "peach",
    description: "Ứng viên đã vượt qua vòng lọc hồ sơ",
  },
  interviewing: {
    label: "Đang phỏng vấn",
    tone: "info",
    description: "Ứng viên đang trong quá trình phỏng vấn AI",
  },
  under_review: {
    label: "Chờ HR đánh giá",
    tone: "warning",
    description: "Đã hoàn thành phỏng vấn, đang chờ chuyên viên HR xem xét",
  },
  approved: {
    label: "Đã duyệt tuyển",
    tone: "success",
    description: "Hồ sơ đã được phê duyệt quyết định tuyển dụng",
  },
  rejected: {
    label: "Đã từ chối",
    tone: "danger",
    description: "Hồ sơ không đạt yêu cầu tuyển dụng",
  },
  withdrawn: {
    label: "Đã rút hồ sơ",
    tone: "neutral",
    description: "Ứng viên chủ động rút khỏi quy trình tuyển dụng",
  },
};

export function getApplicationStatusPresentation(status?: string | null): StatusPresentation {
  if (!status || !(status in APPLICATION_STATUS_MAP)) {
    return { label: status || "Chưa xác định", tone: "neutral" };
  }
  return APPLICATION_STATUS_MAP[status as ApplicationStatusKey];
}

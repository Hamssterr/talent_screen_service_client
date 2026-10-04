import { StatusPresentation } from "./status.types";

export type JobStatusKey = "draft" | "open" | "closed";
export type JobStatus = JobStatusKey;

export const JOB_STATUS_MAP: Record<JobStatusKey, StatusPresentation> = {
  draft: {
    label: "Bản nháp",
    tone: "neutral",
    description: "Tin tuyển dụng chưa được công bố",
  },
  open: {
    label: "Đang mở tuyển",
    tone: "success",
    description: "Tin tuyển dụng đang tiếp nhận hồ sơ ứng tuyển",
  },
  closed: {
    label: "Đã đóng tuyển",
    tone: "neutral",
    description: "Tin tuyển dụng đã dừng nhận hồ sơ mới",
  },
};


export function getJobStatusPresentation(status?: string | null): StatusPresentation {
  if (!status || !(status in JOB_STATUS_MAP)) {
    return { label: status || "Chưa xác định", tone: "neutral" };
  }
  return JOB_STATUS_MAP[status as JobStatusKey];
}

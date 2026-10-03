import { StatusPresentation } from "./status.types";

export type NotificationStatusKey =
  | "pending"
  | "sending"
  | "accepted"
  | "delivered"
  | "failed"
  | "unknown"
  | "suppressed";

export type NotificationStatus = NotificationStatusKey;

export const NOTIFICATION_STATUS_MAP: Record<NotificationStatusKey, StatusPresentation> = {
  pending: {
    label: "Chờ gửi",
    tone: "warning",
    description: "Thông báo đang trong hàng đợi xử lý",
  },
  sending: {
    label: "Đang gửi",
    tone: "info",
    description: "Đang chuyển thông báo tới nhà cung cấp email",
  },
  accepted: {
    label: "Đã tiếp nhận",
    tone: "info",
    description: "Nhà cung cấp đã chấp nhận email để phát tán",
  },
  delivered: {
    label: "Đã gửi thành công",
    tone: "success",
    description: "Email đã được gửi đến hộp thư người nhận",
  },
  failed: {
    label: "Gửi thất bại",
    tone: "danger",
    description: "Không thể chuyển phát email tới người nhận",
  },
  unknown: {
    label: "Chưa rõ trạng thái",
    tone: "warning",
    description: "Chưa nhận được phản hồi xác nhận từ nhà cung cấp",
  },
  suppressed: {
    label: "Đã bỏ qua",
    tone: "neutral",
    description: "Email bị chặn do nằm trong danh sách hạn chế hoặc khiếu nại",
  },
};

export function getNotificationStatusPresentation(status?: string | null): StatusPresentation {
  if (!status || !(status in NOTIFICATION_STATUS_MAP)) {
    return { label: status || "Chưa xác định", tone: "neutral" };
  }
  return NOTIFICATION_STATUS_MAP[status as NotificationStatusKey];
}

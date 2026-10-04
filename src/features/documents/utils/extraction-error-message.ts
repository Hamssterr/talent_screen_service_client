export interface ExtractionErrorInfo {
  title: string;
  message: string;
  suggestion?: string;
  isRetryable?: boolean;
}

const ERROR_MAP: Record<string, ExtractionErrorInfo> = {
  CV_ENCRYPTED_PDF: {
    title: "Tài liệu PDF được bảo vệ bằng mật khẩu",
    message: "Tệp PDF đã bị mã hóa hoặc cài đặt mật khẩu truy cập, hệ thống AI không thể đọc nội dung.",
    suggestion: "Vui lòng gỡ mật khẩu file PDF hoặc tải lên phiên bản không mã hóa, hoặc nhập hồ sơ ứng viên thủ công.",
    isRetryable: false,
  },
  CV_TEXT_UNAVAILABLE: {
    title: "Không tìm thấy văn bản trong tài liệu PDF",
    message: "Tệp PDF có thể là tài liệu dạng ảnh quét (scanned image) hoặc chứa hình ảnh không thể trích xuất văn bản.",
    suggestion: "Bạn có thể nhập thông tin hồ sơ ứng viên thủ công bằng trình chỉnh sửa bên dưới.",
    isRetryable: false,
  },
  CV_PAGE_LIMIT_EXCEEDED: {
    title: "Tài liệu vượt quá số trang cho phép",
    message: "Hồ sơ CV vượt quá giới hạn số trang tối đa cho phép xử lý tự động.",
    suggestion: "Vui lòng tải lên CV tóm tắt hoặc tự nhập các thông tin chính vào hồ sơ.",
    isRetryable: false,
  },
  CV_FILE_TOO_LARGE: {
    title: "Kích thước tệp quá lớn",
    message: "Tệp CV vượt quá dung lượng tối đa 10 MB.",
    suggestion: "Vui lòng nén hoặc giảm dung lượng file PDF trước khi tải lên lại.",
    isRetryable: false,
  },
  CV_FILE_INVALID: {
    title: "Tệp không hợp lệ",
    message: "Định dạng tệp hoặc cấu trúc PDF bị lỗi, không thể mở hoặc phân tích.",
    suggestion: "Kiểm tra lại tính hợp lệ của tệp PDF trên máy trước khi tải lên.",
    isRetryable: false,
  },
  CV_EXTRACTION_FAILED: {
    title: "Trích xuất hồ sơ thất bại",
    message: "Hệ thống gặp lỗi trong quá trình đọc và trích xuất thông tin từ tài liệu CV.",
    suggestion: "Bạn có thể thử lại quá trình trích xuất hoặc nhập thông tin hồ sơ thủ công.",
    isRetryable: true,
  },
  CV_EXTRACTION_IN_PROGRESS: {
    title: "Đang trong quá trình trích xuất",
    message: "Tài liệu CV này đang được hệ thống AI phân tích và xử lý.",
    suggestion: "Vui lòng chờ trong giây lát hoặc làm mới trang để nhận kết quả mới nhất.",
    isRetryable: false,
  },
  CV_PROFILE_ALREADY_APPROVED: {
    title: "Hồ sơ đã được phê duyệt",
    message: "Hồ sơ trích xuất của phiên bản CV này đã được phê duyệt trước đó và đã bị khóa chỉnh sửa.",
    suggestion: "Nếu cần thay đổi, bạn có thể tải lên một phiên bản CV mới.",
    isRetryable: false,
  },
  CV_PROFILE_LOCKED: {
    title: "Hồ sơ đã bị khóa",
    message: "Hồ sơ đã phê duyệt thành công và không thể cập nhật thêm.",
    suggestion: "Tải lên bản CV mới nếu ứng viên cập nhật thông tin.",
    isRetryable: false,
  },
  CV_PROFILE_NOT_READY: {
    title: "Hồ sơ chưa sẵn sàng để phê duyệt",
    message: "Thông tin hồ sơ còn trống hoặc chưa hoàn tất trích xuất.",
    suggestion: "Vui lòng chạy trích xuất AI hoặc nhập thông tin hồ sơ trước khi phê duyệt.",
    isRetryable: false,
  },
  CV_STORAGE_ERROR: {
    title: "Lỗi hệ thống lưu trữ",
    message: "Không thể truy xuất tệp tài liệu từ kho lưu trữ.",
    suggestion: "Vui lòng thử tải lại hoặc liên hệ quản trị viên.",
    isRetryable: true,
  },
  AI_TIMEOUT: {
    title: "Hết thời gian chờ phản hồi từ AI",
    message: "Dịch vụ AI không phản hồi kịp thời trong thời gian quy định.",
    suggestion: "Vui lòng thử lại sau vài phút hoặc nhập thông tin hồ sơ thủ công.",
    isRetryable: true,
  },
  AI_RATE_LIMITED: {
    title: "Vượt quá giới hạn tần suất gọi AI",
    message: "Hệ thống AI đang tiếp nhận số lượng lớn yêu cầu và tạm thời hạn chế tần suất.",
    suggestion: "Vui lòng chờ khoảng 1-2 phút trước khi thử lại.",
    isRetryable: true,
  },
  AI_UNAUTHORIZED: {
    title: "Lỗi xác thực dịch vụ AI",
    message: "Dịch vụ AI chưa được cấp quyền hoặc cấu hình hợp lệ phía máy chủ.",
    suggestion: "Vui lòng liên hệ quản trị viên hệ thống để kiểm tra khóa API.",
    isRetryable: false,
  },
  AI_PROVIDER_UNAVAILABLE: {
    title: "Dịch vụ AI tạm thời không khả dụng",
    message: "Máy chủ AI của nhà cung cấp đang bảo trì hoặc mất kết nối tạm thời.",
    suggestion: "Bạn có thể nhập hồ sơ thủ công hoặc thử lại sau.",
    isRetryable: true,
  },
  AI_INVALID_OUTPUT: {
    title: "Kết quả AI không đúng định dạng",
    message: "Kết quả trả về từ mô hình AI không khớp với cấu trúc hồ sơ chuẩn (profile.v1).",
    suggestion: "Vui lòng nhấn nút 'Thử lại trích xuất' hoặc bổ sung thông tin thủ công.",
    isRetryable: true,
  },
  AI_PROCESSING_CONFLICT: {
    title: "Xung đột tiến trình xử lý",
    message: "Một tiến trình trích xuất khác cho CV này đang được thực hiện.",
    suggestion: "Vui lòng làm mới trang để xem kết quả hiện tại.",
    isRetryable: false,
  },
  AI_RESULT_SUPERSEDED: {
    title: "Kết quả đã bị thay thế",
    message: "Đã có một phiên bản xử lý mới hơn được tạo cho tài liệu này.",
    suggestion: "Vui lòng làm mới trang để tải dữ liệu mới nhất.",
    isRetryable: false,
  },
  VERSION_CONFLICT: {
    title: "Xung đột phiên bản dữ liệu",
    message: "Dữ liệu hồ sơ vừa được cập nhật bởi một người dùng hoặc tiến trình khác.",
    suggestion: "Vui lòng làm mới trang để nhận phiên bản mới nhất trước khi tiếp tục.",
    isRetryable: false,
  },
  APPLICATION_STATE_CONFLICT: {
    title: "Trạng thái hồ sơ ứng tuyển không hợp lệ",
    message: "Chỉ được phép tải lên hoặc chỉnh sửa CV khi hồ sơ ứng tuyển ở trạng thái Sơ loại (shortlisted).",
    suggestion: "Hồ sơ ứng tuyển đã chuyển sang giai đoạn tiếp theo hoặc đã kết thúc.",
    isRetryable: false,
  },
};

/**
 * Returns a human-friendly extraction error info given an errorCode string.
 */
export function getExtractionErrorInfo(errorCode: string | null | undefined): ExtractionErrorInfo {
  if (!errorCode) {
    return {
      title: "Lỗi không xác định",
      message: "Đã xảy ra lỗi trong quá trình xử lý tài liệu CV.",
      suggestion: "Vui lòng thử lại hoặc tự nhập hồ sơ.",
      isRetryable: true,
    };
  }

  const mapped = ERROR_MAP[errorCode];
  if (mapped) {
    return mapped;
  }

  return {
    title: `Lỗi xử lý (${errorCode})`,
    message: "Hệ thống gặp sự cố không xác định khi trích xuất thông tin.",
    suggestion: "Bạn có thể thử lại quá trình trích xuất hoặc nhập thông tin thủ công.",
    isRetryable: true,
  };
}

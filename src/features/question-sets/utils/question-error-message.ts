import { getApiError } from "@/lib/api/api-error";

export function getQuestionErrorMessage(error: unknown): string {
  const apiError = getApiError(error);
  const code = apiError.code;
  const message = apiError.message;
  const status = apiError.status;

  switch (code) {
    case "QUESTION_SET_NOT_FOUND":
      return "Không tìm thấy bộ câu hỏi hoặc bạn không có quyền truy cập.";
    case "QUESTION_SET_ALREADY_APPROVED":
      return "Bộ câu hỏi đã được phê duyệt và đã bị khóa bất biến, không thể chỉnh sửa.";
    case "QUESTION_SET_NOT_EDITABLE":
      return "Bộ câu hỏi đang ở trạng thái không cho phép chỉnh sửa.";
    case "QUESTION_SET_STALE":
      return "Bộ câu hỏi đã bị cũ (stale) do thông tin Job hoặc CV đã cập nhật bản mới. Không thể phê duyệt bộ câu hỏi này; vui lòng tạo mới từ nguồn hiện tại.";
    case "QUESTION_SET_EMPTY":
      return "Bộ câu hỏi đang rỗng. Cần có ít nhất 1 câu hỏi để có thể phê duyệt.";
    case "QUESTION_SET_INVALID_ITEMS":
      return "Danh sách câu hỏi không hợp lệ (số lượng phải từ 1-12, vị trí phải liên tục từ 1, hoặc tiêu chí chưa đúng).";
    case "QUESTION_SET_SOURCE_INVALID":
      return "Nguồn dữ liệu CV hoặc Job không hợp lệ để tạo bộ câu hỏi.";
    case "QUESTION_SET_NOT_APPROVED":
      return "Bộ câu hỏi chưa được phê duyệt nên chưa thể sử dụng.";
    case "QUESTION_GENERATION_FAILED":
      return "Quá trình AI sinh câu hỏi gặp sự cố. Bạn có thể nhấn nút 'Thử lại sinh AI' bên dưới.";
    case "QUESTION_GENERATION_STALE":
      return "Không thể tiếp tục sinh câu hỏi do Job hoặc CV đã cập nhật phiên bản mới hơn.";
    case "QUESTION_INVALID_EVIDENCE":
      return "Dữ liệu dẫn chứng trích xuất từ CV không hợp lệ.";
    case "QUESTION_INVALID_OUTPUT":
      return "Kết quả trả về từ mô hình AI không đúng cấu trúc yêu cầu.";
    case "QUESTION_GENERATION_NOT_RETRYABLE":
      return "Trạng thái hiện tại của bộ câu hỏi không cho phép thử lại quá trình AI.";
    case "CV_PROFILE_NOT_APPROVED":
      return "Hồ sơ CV chưa được phê duyệt. Vui lòng phê duyệt CV trước khi tạo bộ câu hỏi.";
    case "APPLICATION_STATE_CONFLICT":
      return "Chỉ hồ sơ ứng viên ở trạng thái 'shortlisted' mới có thể tạo bộ câu hỏi.";
    default:
      if (status === 409) {
        return "Xung đột phiên bản (OCC): Dữ liệu vừa được người khác cập nhật. Vui lòng làm mới trang và thử lại.";
      }
      if (message) {
        return message;
      }
  }

  return "Đã xảy ra lỗi không xác định trong quá trình thao tác bộ câu hỏi.";
}

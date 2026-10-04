export const MAX_CV_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_CV_MIME_TYPES = ["application/pdf"];
export const ALLOWED_CV_EXTENSIONS = [".pdf"];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a candidate CV file against format, extension, and size limits.
 */
export function validatePdfFile(file: File): FileValidationResult {
  if (!file) {
    return {
      isValid: false,
      error: "Vui lòng chọn một tệp tài liệu PDF.",
    };
  }

  // 1. Check size limit
  if (file.size > MAX_CV_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: "Kích thước tệp vượt quá giới hạn tối đa 10 MB.",
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: "Tệp tải lên rỗng (0 bytes).",
    };
  }

  // 2. Check extension
  const filename = file.name.toLowerCase();
  const hasValidExt = ALLOWED_CV_EXTENSIONS.some((ext) => filename.endsWith(ext));
  if (!hasValidExt) {
    return {
      isValid: false,
      error: "Định dạng tệp không hợp lệ. Chỉ chấp nhận tệp có phần mở rộng .pdf.",
    };
  }

  // 3. Check MIME type (if provided by browser)
  if (file.type && file.type !== "application/pdf") {
    return {
      isValid: false,
      error: "Kiểu tệp (MIME type) không phải là application/pdf.",
    };
  }

  return { isValid: true };
}

/**
 * Async check for '%PDF-' magic bytes header in the browser.
 */
export async function verifyPdfMagicBytes(file: File): Promise<boolean> {
  try {
    const slice = file.slice(0, 5);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const header = String.fromCharCode(...bytes);
    return header === "%PDF-";
  } catch {
    return false;
  }
}

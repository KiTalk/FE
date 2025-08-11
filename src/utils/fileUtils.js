import { FILE_CONFIG } from "../config/api.js";

// 파일 크기를 읽기 쉬운 형태로 변환
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 파일 형식 검증
export const validateFileFormat = (file) => {
  const fileExtension = file.name.split(".").pop().toLowerCase();
  const isValidFormat = FILE_CONFIG.SUPPORTED_FORMATS.includes(fileExtension);
  const isValidMimeType = FILE_CONFIG.SUPPORTED_MIME_TYPES.includes(file.type);

  return isValidFormat || isValidMimeType;
};

// 파일 크기 검증
export const validateFileSize = (file) => {
  return file.size <= FILE_CONFIG.MAX_SIZE;
};

// 파일 전체 검증
export const validateFile = (file) => {
  const errors = [];

  if (!validateFileFormat(file)) {
    errors.push(
      `지원하지 않는 파일 형식입니다. 지원 형식: ${FILE_CONFIG.SUPPORTED_FORMATS.join(
        ", "
      )}`
    );
  }

  if (!validateFileSize(file)) {
    errors.push(
      `파일 크기가 너무 큽니다. 최대 크기: ${formatFileSize(
        FILE_CONFIG.MAX_SIZE
      )}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 텍스트를 파일로 다운로드
export const downloadTextAsFile = (text, filename = "stt-result.txt") => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

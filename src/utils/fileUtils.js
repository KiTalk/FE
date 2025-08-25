import { FILE_CONFIG } from "../config/api.js";

// 파일 크기를 읽기 쉬운 형태로 변환
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// 파일 형식 검증
export function validateFileFormat(file) {
  const allowedTypes = [
    "audio/webm",
    "audio/wav",
    "audio/ogg",
    "audio/mpeg",
    "audio/mp4",
    "audio/flac",
  ];
  return allowedTypes.some(function (type) {
    return file.type.startsWith(type);
  });
}

// 파일 크기 검증
export function validateFileSize(file) {
  const maxSize = 50 * 1024 * 1024; // 50MB
  return file.size <= maxSize;
}

// 파일 유효성 검증 (형식 + 크기)
export function validateFile(file) {
  if (!file) {
    throw new Error("파일이 선택되지 않았습니다.");
  }

  if (!validateFileFormat(file)) {
    throw new Error(
      "지원하지 않는 파일 형식입니다. 오디오 파일만 업로드 가능합니다."
    );
  }

  if (!validateFileSize(file)) {
    throw new Error(
      "파일 크기가 너무 큽니다. 50MB 이하의 파일만 업로드 가능합니다."
    );
  }

  return true;
}

// 텍스트를 파일로 다운로드
export function downloadTextAsFile(text, filename = "stt-result.txt") {
  try {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("파일 다운로드 실패:", error);
    return false;
  }
}

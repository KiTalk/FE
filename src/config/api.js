// API 설정
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  STT: "/stt",
  HEALTH: "/health",
  LANGUAGES: "/languages",
};

// 지원 언어 목록
export const SUPPORTED_LANGUAGES = [
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

// 파일 업로드 설정
export const FILE_CONFIG = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_FORMATS: ["mp3", "wav", "aac", "ogg", "flac"],
  SUPPORTED_MIME_TYPES: [
    "audio/mp3",
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
    "audio/aac",
    "audio/ogg",
    "audio/flac",
  ],
};

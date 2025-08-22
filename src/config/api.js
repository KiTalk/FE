// API 설정
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  STT: "/stt",
  HEALTH: "/health",
  LANGUAGES: "/languages",
  ORDER_COMPLETE: "/order/complete",
  // 주문 처리 시스템
  LOGIC_START: "/logic/start",
  LOGIC_ORDER: (sessionId) => `/logic/order/${sessionId}`,
  LOGIC_PACKAGING: (sessionId) => `/logic/packaging/${sessionId}`,
  LOGIC_SESSION: (sessionId) => `/logic/session/${sessionId}`,
  LOGIC_CONFIRM: "/logic/confirm",
  ORDERS_PATCH_UPDATE: (sessionId) => `/orders/${sessionId}/patch-update`,
  ORDERS_ADD: (sessionId) => `/orders/${sessionId}/add`,
  ORDERS_REMOVE: (sessionId) => `/orders/${sessionId}/remove`,
  ORDERS_CLEAR: (sessionId) => `/orders/${sessionId}/clear`,
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

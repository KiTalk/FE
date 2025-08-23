// API 설정
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// 터치주문용 API 설정
export const TOUCH_ORDER_API_BASE_URL = "http://localhost:8080";

export const API_ENDPOINTS = {
  // API_BASE_URL 사용
  LOGIC_START: "/logic/start",
  PHONE_INPUT: (sessionId) => `/api/phone/input/${sessionId}`,
  PHONE_CHOICE: (sessionId) => `/api/phone/choice/${sessionId}`,
  STT: "/stt",
  HEALTH: "/health",
  LANGUAGES: "/languages",
  ORDER_AT_ONCE_START: "/order-at-once/start",
  LOGIC_ORDER: (sessionId) => `/logic/order/${sessionId}`,
  LOGIC_PACKAGING: (sessionId) => `/logic/packaging/${sessionId}`,
  LOGIC_SESSION: (sessionId) => `/logic/session/${sessionId}`,
  LOGIC_CONFIRM: "/logic/confirm",
  ORDERS_PATCH_UPDATE: (sessionId) => `/orders/${sessionId}/patch-update`,
  ORDERS_ADD: (sessionId) => `/orders/${sessionId}/add`,
  ORDERS_REMOVE: (sessionId) => `/orders/${sessionId}/remove`,
  ORDERS_CLEAR: (sessionId) => `/orders/${sessionId}/clear`,
  ORDER_RETRY_UPDATE_PACKAGING: (sessionId) =>
    `/order-retry/update-packaging/${sessionId}`,
  ORDER_RETRY_UPDATE_TEMP: (sessionId) =>
    `/order-retry/update-temp/${sessionId}`,

  // TOUCH_ORDER_API_BASE_URL 사용
  MENU_LIST: "/api/menu/list",
  TOUCH_CART_ADD: (sessionId) => `/api/touch/cart/${sessionId}/add`,
  TOUCH_CART_GET: (sessionId) => `/api/touch/cart/${sessionId}`,
  TOUCH_CART_CLEAR: (sessionId) => `/api/touch/cart/${sessionId}/clear`,
  TOUCH_CART_UPDATE: (sessionId) => `/api/touch/cart/${sessionId}/update`,
  TOUCH_CART_REMOVE: (sessionId) => `/api/touch/cart/${sessionId}/remove`,
  TOUCH_CART_PACKAGING: (sessionId) => `/api/touch/cart/${sessionId}/packaging`,
  TOUCH_PHONE_CHOICE: (sessionId) => `/api/touch/phone/${sessionId}/choice`,
  TOUCH_PHONE_INPUT: (sessionId) => `/api/touch/phone/${sessionId}/input`,
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

import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api.js";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    console.log("API 요청:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log("API 응답:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API 에러:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// STT API
export const sttService = {
  // 음성 파일을 텍스트로 변환
  convertSpeechToText: async (audioFile, language = "ko") => {
    // 입력 유효성 검사
    if (!audioFile || !(audioFile instanceof File)) {
      throw new Error("유효한 오디오 파일이 아닙니다.");
    }

    if (audioFile.size === 0) {
      throw new Error("오디오 파일이 비어있습니다.");
    }

    if (audioFile.size > 50 * 1024 * 1024) {
      // 50MB 제한
      throw new Error("파일 크기가 너무 큽니다. (최대 50MB)");
    }

    // 프론트엔드 언어 코드를 백엔드 형식으로 변환
    const languageMap = {
      ko: "Kor",
      en: "Eng",
      ja: "Jpn",
      zh: "Chn",
    };

    const backendLanguage = languageMap[language] || "Kor";

    console.log(`🌐 STT API 호출 준비:`);
    console.log(`  - 파일명: ${audioFile.name}`);
    console.log(`  - 파일 타입: ${audioFile.type}`);
    console.log(
      `  - 파일 크기: ${audioFile.size} bytes (${(
        audioFile.size / 1024
      ).toFixed(1)} KB)`
    );
    console.log(`  - 프론트엔드 언어: ${language}`);
    console.log(`  - 백엔드 언어: ${backendLanguage}`);

    // FormData 생성 및 로깅
    const formData = new FormData();
    formData.append("audio_file", audioFile);
    formData.append("lang", backendLanguage);

    // FormData 내용 확인 (디버깅용)
    console.log("📦 FormData 내용:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `  - ${key}: File(${value.name}, ${value.size}bytes, ${value.type})`
        );
      } else {
        console.log(`  - ${key}: ${value}`);
      }
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.STT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📤 업로드 진행률: ${percentCompleted}%`);
        },
      });

      console.log("🎉 STT API 호출 성공");
      return response.data;
    } catch (error) {
      console.error("❌ STT API 호출 실패:", error);

      if (error.response) {
        console.error("  - 응답 상태:", error.response.status);
        console.error("  - 응답 데이터:", error.response.data);
        throw new Error(
          `서버 오류: ${error.response.data?.message || error.response.status}`
        );
      } else if (error.request) {
        console.error("  - 요청 전송 실패:", error.request);
        throw new Error("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      } else {
        console.error("  - 요청 설정 오류:", error.message);
        throw new Error(`요청 오류: ${error.message}`);
      }
    }
  },

  // 헬스 체크
  checkHealth: async () => {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH);
    return response.data;
  },

  // 지원 언어 목록 조회
  getSupportedLanguages: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LANGUAGES);
      return response.data;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      console.warn(
        "언어 목록 API를 사용할 수 없습니다. 기본 언어 목록을 사용합니다."
      );
      return null;
    }
  },
};

// 주문 처리 시스템 API
export const orderService = {
  // 세션 시작
  startSession: async () => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIC_START, {});
    return response.data;
  },

  // 주문 처리 (자연어 텍스트)
  submitOrder: async (sessionId, menuText) => {
    const response = await apiClient.post(
      API_ENDPOINTS.LOGIC_ORDER(sessionId),
      { menu_item: menuText }
    );
    return response.data;
  },

  // 포장 방식 선택
  selectPackaging: async (sessionId, packagingType) => {
    const response = await apiClient.post(
      API_ENDPOINTS.LOGIC_PACKAGING(sessionId),
      { packaging_type: packagingType }
    );
    return response.data;
  },

  // 세션 조회
  getSession: async (sessionId) => {
    const response = await apiClient.get(
      API_ENDPOINTS.LOGIC_SESSION(sessionId)
    );
    return response.data;
  },

  // 주문 수정
  patchUpdate: async (sessionId, orders) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ORDERS_PATCH_UPDATE(sessionId),
      { orders }
    );
    return response.data;
  },

  // 주문 추가
  addOrder: async (sessionId, orderText) => {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS_ADD(sessionId), {
      order_text: orderText,
    });
    return response.data;
  },

  // 주문 삭제
  removeOrder: async (sessionId, menuItem) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.ORDERS_REMOVE(sessionId),
      { data: { menu_item: menuItem } }
    );
    return response.data;
  },

  // 확인 응답 처리
  confirmResponse: async (menuItem) => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIC_CONFIRM, {
      menu_item: menuItem,
    });
    return response.data;
  },
};

export default apiClient;

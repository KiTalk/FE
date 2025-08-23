import axios from "axios";
import {
  API_BASE_URL,
  TOUCH_ORDER_API_BASE_URL,
  API_ENDPOINTS,
} from "../config/api.js";

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// 터치주문 API용 별도 Axios 인스턴스
export const touchOrderApiClient = axios.create({
  baseURL: TOUCH_ORDER_API_BASE_URL,
  timeout: 10000,
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
  patchUpdate: async (sessionId, requestBody) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ORDERS_PATCH_UPDATE(sessionId),
      requestBody
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

  // 주문 삭제 (숫자 menu_id 사용)
  removeOrder: async (sessionId, menuId) => {
    console.log(`🗑️ DELETE API 호출: sessionId=${sessionId}, menuId=${menuId}`);
    const response = await apiClient.delete(
      API_ENDPOINTS.ORDERS_REMOVE(sessionId),
      { data: { menu_id: menuId } }
    );
    console.log("✅ DELETE API 성공");
    return response.data;
  },

  // 전체 주문 삭제
  clearAllOrders: async (sessionId) => {
    console.log(`🧹 전체 주문 삭제 API 호출: sessionId=${sessionId}`);
    const response = await apiClient.delete(
      API_ENDPOINTS.ORDERS_CLEAR(sessionId)
    );
    console.log("✅ 전체 주문 삭제 성공");
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

// 메뉴 API 서비스
export const menuService = {
  // 메뉴 목록 조회
  getMenuList: async (category = null) => {
    try {
      const params = category ? { category } : {};
      const response = await touchOrderApiClient.get(API_ENDPOINTS.MENU_LIST, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("메뉴 API 호출 실패:", error);
      throw error;
    }
  },

  // API 응답 데이터를 기존 데이터 구조로 변환
  transformApiDataToMenuData: (apiResponse) => {
    if (!apiResponse?.success || !Array.isArray(apiResponse.data)) {
      throw new Error("잘못된 API 응답 형식입니다.");
    }

    // API 데이터를 카테고리별로 그룹화
    const menuItems = apiResponse.data;
    const categoryGroups = {};

    // 카테고리별로 메뉴 아이템들을 그룹화
    menuItems.forEach((item) => {
      const apiCategory = item.category || "기타";
      if (!categoryGroups[apiCategory]) {
        categoryGroups[apiCategory] = [];
      }

      // API 데이터를 기존 형식으로 변환
      const transformedItem = {
        id: `${item.name
          .replace(/\s+/g, "-")
          .toLowerCase()}-${item.temperature.toLowerCase()}`,
        name: item.name,
        price: item.price,
        popular: item.isActive, // isActive를 popular로 사용
        temp:
          item.temperature.toLowerCase() === "hot"
            ? "hot"
            : item.temperature.toLowerCase() === "ice"
            ? "ice"
            : "none",
        originalId: item.id, // 원본 API ID 보존
        profileImage: item.profile, // profile 이미지 URL (null일 수 있음)
      };

      categoryGroups[apiCategory].push(transformedItem);
    });

    // API 카테고리를 프론트엔드 구조로 매핑
    const categoryToFrontendMapping = {
      // 커피 관련
      커피: { frontendId: "coffee", label: "커피", sectionTitle: "커피" },

      // 차 관련
      차: { frontendId: "tea", label: "차", sectionTitle: "차" },
      "스페셜 티": {
        frontendId: "tea",
        label: "차",
        sectionTitle: "스페셜 티",
      },

      // 기타 음료 관련
      "기타 음료": {
        frontendId: "drink",
        label: "음료",
        sectionTitle: "기타 음료",
      },
      주스: { frontendId: "drink", label: "음료", sectionTitle: "주스" },
      스무디: { frontendId: "drink", label: "음료", sectionTitle: "스무디" },
      버블티: { frontendId: "drink", label: "음료", sectionTitle: "버블티" },
      에이드: { frontendId: "drink", label: "음료", sectionTitle: "에이드" },
      프라페: { frontendId: "drink", label: "음료", sectionTitle: "프라페" },
      "특색 라떼": {
        frontendId: "drink",
        label: "음료",
        sectionTitle: "특색 라떼",
      },

      // 디저트 관련
      디저트: {
        frontendId: "dessert",
        label: "디저트",
        sectionTitle: "디저트",
      },
    };

    // 프론트엔드 카테고리별로 섹션 구성
    const frontendCategories = {
      coffee: { id: "coffee", label: "커피", sections: [] },
      tea: { id: "tea", label: "차", sections: [] },
      drink: { id: "drink", label: "음료", sections: [] },
      dessert: { id: "dessert", label: "디저트", sections: [] },
    };

    // API 카테고리를 프론트엔드 구조로 변환
    Object.entries(categoryGroups).forEach(([apiCategory, items]) => {
      const mapping = categoryToFrontendMapping[apiCategory];
      if (mapping && items.length > 0) {
        const frontendCategory = frontendCategories[mapping.frontendId];
        if (frontendCategory) {
          frontendCategory.sections.push({
            id: apiCategory.replace(/\s+/g, "-").toLowerCase(),
            title: mapping.sectionTitle,
            products: items,
          });
        }
      }
    });

    // 메뉴 데이터 구조로 변환
    const transformedData = [];

    // "모든 메뉴" 탭 생성
    const allMenuSections = [];
    Object.values(frontendCategories).forEach((category) => {
      if (category.sections.length > 0) {
        allMenuSections.push(...category.sections);
      }
    });

    if (allMenuSections.length > 0) {
      transformedData.push({
        id: "all",
        label: "모든 메뉴",
        sections: allMenuSections,
      });
    }

    // 개별 카테고리 탭들 생성
    Object.values(frontendCategories).forEach((category) => {
      if (category.sections.length > 0) {
        transformedData.push(category);
      }
    });

    return transformedData;
  },

  // 모든 카테고리의 메뉴 데이터를 가져와서 변환
  getTransformedMenuData: async () => {
    try {
      // 모든 메뉴 조회 (카테고리 파라미터 없이)
      const apiResponse = await menuService.getMenuList();
      const transformedData =
        menuService.transformApiDataToMenuData(apiResponse);
      return transformedData;
    } catch (error) {
      console.error("메뉴 데이터 변환 실패:", error);
      // 실패 시 빈 배열 반환하거나 기본 데이터 사용
      return [];
    }
  },

  // 특정 카테고리의 메뉴 데이터를 가져오기 (API 파라미터용)
  getMenuByCategory: async (categoryId) => {
    // 프론트엔드 카테고리 ID에 따른 API 파라미터 매핑
    // API는 단일 카테고리만 필터링하므로, 대표 카테고리만 사용
    const categoryMapping = {
      coffee: "커피",
      tea: "차", // "차"와 "스페셜 티" 중 "차" 사용
      drink: "기타 음료", // 여러 음료 카테고리 중 "기타 음료" 사용
      dessert: "디저트",
    };

    const apiCategory = categoryMapping[categoryId];
    if (!apiCategory) {
      // 전체 메뉴 조회
      return menuService.getMenuList();
    }

    return menuService.getMenuList(apiCategory);
  },
};

// 음성주문 처리 시스템 API (API_BASE_URL 사용)
export const voiceOrderService = {
  // 음성주문 세션 시작 (ORDER_AT_ONCE_START)
  startOrderAtOnce: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDER_AT_ONCE_START);
      console.log("음성주문 세션 시작 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("음성주문 세션 시작 실패:", error);
      throw error;
    }
  },

  // 음성주문 전화번호 입력
  submitPhoneNumber: async (sessionId, phoneNumber) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.PHONE_INPUT(sessionId),
        { phone_number: phoneNumber }
      );
      console.log("음성주문 전화번호 입력 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("음성주문 전화번호 입력 실패:", error);
      throw error;
    }
  },

  // 음성주문 전화번호 저장 선택
  submitPhoneChoice: async (sessionId, wantsPhone) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.PHONE_CHOICE(sessionId),
        { wants_phone: !!wantsPhone }
      );
      console.log("음성주문 전화번호 선택 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("음성주문 전화번호 선택 실패:", error);
      throw error;
    }
  },
};

// 터치주문 처리 시스템 API (TOUCH_ORDER_API_BASE_URL 사용)
export const touchOrderService = {
  // 터치주문 장바구니에 메뉴 추가
  addToTouchCart: async (sessionId, menuId, quantity) => {
    try {
      const response = await touchOrderApiClient.post(
        API_ENDPOINTS.TOUCH_CART_ADD(sessionId),
        { menu_id: menuId, quantity: quantity }
      );
      console.log("터치주문 장바구니 추가 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("터치주문 장바구니 추가 실패:", error);
      throw error;
    }
  },

  // 터치주문 장바구니 조회
  getTouchCart: async (sessionId) => {
    try {
      const response = await touchOrderApiClient.get(
        API_ENDPOINTS.TOUCH_CART_GET(sessionId)
      );
      console.log("터치주문 장바구니 조회 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("터치주문 장바구니 조회 실패:", error);
      throw error;
    }
  },

  // 터치주문 장바구니 전체 삭제
  clearTouchCart: async (sessionId) => {
    try {
      const response = await touchOrderApiClient.delete(
        API_ENDPOINTS.TOUCH_CART_CLEAR(sessionId)
      );
      console.log("터치주문 장바구니 전체 삭제 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("터치주문 장바구니 전체 삭제 실패:", error);
      throw error;
    }
  },

  // 터치주문 장바구니 수량 변경
  updateTouchCartQuantity: async (sessionId, menuId, quantity) => {
    try {
      const response = await touchOrderApiClient.put(
        API_ENDPOINTS.TOUCH_CART_UPDATE(sessionId),
        {
          orders: [
            {
              menu_id: menuId,
              quantity: quantity,
            },
          ],
        }
      );
      console.log("터치주문 장바구니 수량 변경 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("터치주문 장바구니 수량 변경 실패:", error);
      throw error;
    }
  },

  // 터치주문 장바구니 상품 제거
  removeTouchCartItem: async (sessionId, menuId) => {
    try {
      const response = await touchOrderApiClient.delete(
        API_ENDPOINTS.TOUCH_CART_REMOVE(sessionId),
        { data: { menu_id: menuId } }
      );
      console.log("터치주문 장바구니 상품 제거 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("터치주문 장바구니 상품 제거 실패:", error);
      throw error;
    }
  },

  // 터치주문 장바구니 일괄 업데이트 (원자성 보장)
  bulkUpdateTouchCart: async (sessionId, cartItems) => {
    try {
      // cartItems: { menuId: quantity, ... } 형태의 객체
      const orders = Object.entries(cartItems)
        .filter(([, quantity]) => Number(quantity) > 0) // 수량이 0보다 큰 항목만
        .map(([menuId, quantity]) => ({
          menu_id: parseInt(menuId, 10),
          quantity: parseInt(quantity, 10),
        }));

      console.log("bulkUpdateTouchCart - 처리할 주문 수:", orders.length);
      console.log("bulkUpdateTouchCart - orders:", orders);

      // 빈 배열이면 API 호출 생략
      if (orders.length === 0) {
        console.log(
          "터치주문 장바구니 일괄 업데이트: 빈 주문 목록, API 호출 생략"
        );
        return { success: true, message: "빈 주문 목록으로 인한 호출 생략" };
      }

      const response = await touchOrderApiClient.put(
        API_ENDPOINTS.TOUCH_CART_UPDATE(sessionId),
        { orders }
      );
      console.log("터치주문 장바구니 일괄 업데이트 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("터치주문 장바구니 일괄 업데이트 실패:", error);
      throw error;
    }
  },

  // 터치주문 포장 방식 설정
  setTouchCartPackaging: async (sessionId, packagingType) => {
    try {
      const response = await touchOrderApiClient.post(
        API_ENDPOINTS.TOUCH_CART_PACKAGING(sessionId),
        { packagingType }
      );
      console.log("터치주문 포장 방식 설정 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("터치주문 포장 방식 설정 실패:", error);
      throw error;
    }
  },

  // 터치주문 전화번호 선택
  submitTouchPhoneChoice: async (sessionId, wantsPhone) => {
    try {
      const response = await touchOrderApiClient.post(
        API_ENDPOINTS.TOUCH_PHONE_CHOICE(sessionId),
        { wants_phone: wantsPhone }
      );
      console.log("터치주문 전화번호 선택 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("터치주문 전화번호 선택 실패:", error);
      throw error;
    }
  },

  // 터치주문 전화번호 입력
  submitTouchPhoneNumber: async (sessionId, phoneNumber) => {
    try {
      const response = await touchOrderApiClient.post(
        API_ENDPOINTS.TOUCH_PHONE_INPUT(sessionId),
        { phone_number: phoneNumber }
      );
      console.log("터치주문 전화번호 입력 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("터치주문 전화번호 입력 실패:", error);
      throw error;
    }
  },
};

import { useCallback } from "react";
import { orderStorage } from "./storage";
import { orderService } from "../services/api";

/**
 * 간단한 주문 동기화 훅
 * - 수동 동기화 함수만 제공
 * - 음성 인식 완료 시에만 호출
 */
export function useOrderSync(sessionId) {
  // 수동 동기화 함수
  const syncNow = useCallback(async function() {
    if (!sessionId) {
      console.log("❌ 세션 ID가 없습니다");
      return false;
    }

    const storedOrders = orderStorage.getOrders(sessionId);
    if (!storedOrders) {
      console.log("📋 동기화할 주문 내역이 없습니다");
      return false;
    }

    try {
      // localStorage의 데이터를 백엔드 API 형식으로 변환
      const apiOrders = storedOrders
        .filter(function(order) { return order.quantity > 0; }) // 수량이 0인 항목 제거
        .map(function(order) {
          return {
            menu_item: order.menu_item || order.name,
            quantity: Number(order.quantity || 0),
            temp: order.temp || "ice", // 기본값은 ice로 설정
          };
        });

      if (apiOrders.length === 0) {
        console.log("📋 동기화할 유효한 주문이 없습니다");
        return false;
      }

      // 새로운 API 형식에 맞게 orders 키로 래핑
      const requestBody = { orders: apiOrders };
      console.log("🔄 백엔드 동기화 시작:");
      console.log("  - Session ID:", sessionId);
      console.log("  - Request Body:", JSON.stringify(requestBody, null, 2));

      // 백엔드에 동기화
      const response = await orderService.patchUpdate(sessionId, requestBody);
      console.log("✅ 백엔드 동기화 완료:", response);

      return true;
    } catch (error) {
      console.error("❌ 백엔드 동기화 실패:", error);
      if (error.response?.data) {
        console.error("  - 서버 응답 데이터:", error.response.data);
      }
      if (error.response?.status) {
        console.error("  - HTTP 상태 코드:", error.response.status);
      }
      return false;
    }
  }, [sessionId]);

  return {
    syncNow, // 즉시 동기화
  };
}

/**
 * 간단한 동기화 유틸리티 함수들
 */
export const syncUtils = {
  // 주문 변경사항 확인
  hasChanges: function(sessionId, currentOrders) {
    return orderStorage.hasChanges(sessionId, currentOrders);
  },

  // 주문 내역 강제 동기화
  forceSync: async function(sessionId) {
    if (!sessionId) return false;

    const storedOrders = orderStorage.getOrders(sessionId);
    if (!storedOrders) return false;

    try {
      const apiOrders = storedOrders
        .filter(function(order) { return order.quantity > 0; })
        .map(function(order) {
          return {
            menu_item: order.menu_item || order.name,
            quantity: Number(order.quantity || 0),
            temp: order.temp || "ice", // 기본값은 ice로 설정
          };
        });

      // 새로운 API 형식에 맞게 orders 키로 래핑
      const requestBody = { orders: apiOrders };
      await orderService.patchUpdate(sessionId, requestBody);
      console.log("✅ 강제 동기화 완료");
      return true;
    } catch (error) {
      console.error("❌ 강제 동기화 실패:", error);
      if (error.response?.data) {
        console.error("  - 서버 응답 데이터:", error.response.data);
      }
      if (error.response?.status) {
        console.error("  - HTTP 상태 코드:", error.response.status);
      }
      return false;
    }
  },

  // @deprecated 하위 호환을 위한 alias (오타 수정: forcSync → forceSync)
  forcSync: function (sessionId) {
    console.warn(
      "⚠️ 'forcSync'는 deprecated입니다. 'forceSync'를 사용해주세요."
    );
    return this.forceSync(sessionId);
  },

  // 특정 상품 수량 즉시 동기화
  syncItem: async function(sessionId, productId, newQuantity) {
    if (!sessionId) return false;

    try {
      // localStorage 업데이트
      const updatedOrders = orderStorage.updateQuantity(
        sessionId,
        productId,
        newQuantity
      );
      if (!updatedOrders) return false;

      // 백엔드 동기화
      const apiOrders = updatedOrders.map(function(order) {
        return {
          menu_item: order.menu_item || order.name,
          quantity: Number(order.quantity || 0),
          temp: order.temp || "ice", // 기본값은 ice로 설정
        };
      });

      // 새로운 API 형식에 맞게 orders 키로 래핑
      const requestBody = { orders: apiOrders };
      await orderService.patchUpdate(sessionId, requestBody);
      console.log("✅ 개별 상품 동기화 완료");
      return true;
    } catch (error) {
      console.error("❌ 개별 상품 동기화 실패:", error);
      if (error.response?.data) {
        console.error("  - 서버 응답 데이터:", error.response.data);
      }
      if (error.response?.status) {
        console.error("  - HTTP 상태 코드:", error.response.status);
      }
      return false;
    }
  },
};

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
  const syncNow = useCallback(async () => {
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
        .filter((order) => order.quantity > 0) // 수량이 0인 항목 제거
        .map((order) => ({
          menu_item: order.menu_item || order.name,
          price: Number(order.price || 0),
          quantity: Number(order.quantity || 0),
          original: order.original || order.menu_item || order.name,
        }));

      if (apiOrders.length === 0) {
        console.log("📋 동기화할 유효한 주문이 없습니다");
        return false;
      }

      console.log("🔄 백엔드 동기화 시작:", apiOrders);

      // 백엔드에 동기화
      const response = await orderService.patchUpdate(sessionId, apiOrders);
      console.log("✅ 백엔드 동기화 완료:", response);

      return true;
    } catch (error) {
      console.error("❌ 백엔드 동기화 실패:", error);
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
  hasChanges: (sessionId, currentOrders) => {
    return orderStorage.hasChanges(sessionId, currentOrders);
  },

  // 주문 내역 강제 동기화
  forceSync: async (sessionId) => {
    if (!sessionId) return false;

    const storedOrders = orderStorage.getOrders(sessionId);
    if (!storedOrders) return false;

    try {
      const apiOrders = storedOrders
        .filter((order) => order.quantity > 0)
        .map((order) => ({
          menu_item: order.menu_item || order.name,
          price: Number(order.price || 0),
          quantity: Number(order.quantity || 0),
          original: order.original || order.menu_item || order.name,
        }));

      await orderService.patchUpdate(sessionId, apiOrders);
      console.log("✅ 강제 동기화 완료");
      return true;
    } catch (error) {
      console.error("❌ 강제 동기화 실패:", error);
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
  syncItem: async (sessionId, productId, newQuantity) => {
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
      const apiOrders = updatedOrders.map((order) => ({
        menu_item: order.menu_item || order.name,
        price: Number(order.price || 0),
        quantity: Number(order.quantity || 0),
        original: order.original || order.menu_item || order.name,
      }));

      await orderService.patchUpdate(sessionId, apiOrders);
      console.log("✅ 개별 상품 동기화 완료");
      return true;
    } catch (error) {
      console.error("❌ 개별 상품 동기화 실패:", error);
      return false;
    }
  },
};

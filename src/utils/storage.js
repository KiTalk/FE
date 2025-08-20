// 키/ID 정규화 유틸: 반드시 두 컴포넌트에서 동일하게 사용
export function normalizeId(id) {
  if (id == null) return "";
  return String(id).trim().toLowerCase();
}

export function getStorageKey(id) {
  return `added_total_${normalizeId(id)}`;
}

/** added_total_* 키인지 검사 */
export function isAddedTotalKey(key) {
  return typeof key === "string" && key.startsWith("added_total_");
}

/** 현재 localStorage의 added_total_* 키들을 [key] 배열로 반환 */
export function listAddedTotalKeys(
  ls = typeof window !== "undefined" ? window.localStorage : null
) {
  if (!ls) return [];
  const keys = [];
  for (let i = 0; i < ls.length; i++) {
    const k = ls.key(i);
    if (isAddedTotalKey(k)) keys.push(k);
  }
  return keys;
}

/** added_total_* 전부 제거 */
export function clearAllAddedTotals(
  ls = typeof window !== "undefined" ? window.localStorage : null
) {
  if (!ls) return;
  listAddedTotalKeys(ls).forEach((k) => ls.removeItem(k));
}

/** 허용된 id(정규화된 id) 목록만 남기고 나머지 added_total_* 삭제 */
export function purgeAddedTotalsByIds(
  allowedNormIds = [],
  ls = typeof window !== "undefined" ? window.localStorage : null
) {
  if (!ls) return;
  const allowSet = new Set(allowedNormIds.map(normalizeId));
  listAddedTotalKeys(ls).forEach((k) => {
    // k 형태: "added_total_{normId}"
    const normId = k.replace("added_total_", "");
    if (!allowSet.has(normId)) {
      ls.removeItem(k);
    }
  });
}

// 주문 내역 localStorage 관리
export const orderStorage = {
  // 주문 내역 저장
  saveOrders: (sessionId, orders) => {
    if (!sessionId || !orders) return;
    const key = `orders_${sessionId}`;
    localStorage.setItem(key, JSON.stringify(orders));
    console.log("💾 주문 내역 localStorage 저장:", key, orders);
  },

  // 주문 내역 불러오기
  getOrders: (sessionId) => {
    if (!sessionId) return null;
    const key = `orders_${sessionId}`;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("❌ localStorage 주문 내역 읽기 실패:", e);
      return null;
    }
  },

  // 특정 상품 수량 업데이트
  updateQuantity: (sessionId, productId, newQuantity) => {
    const orders = orderStorage.getOrders(sessionId);
    if (!orders) return null;

    const updated = orders
      .map((order) => {
        if (order.id === productId || order.menu_item === productId) {
          return { ...order, quantity: newQuantity };
        }
        return order;
      })
      .filter((order) => order.quantity > 0); // 수량이 0인 항목 제거

    orderStorage.saveOrders(sessionId, updated);
    return updated;
  },

  // 변경사항이 있는지 확인
  hasChanges: (sessionId, currentOrders) => {
    const storedOrders = orderStorage.getOrders(sessionId);
    if (!storedOrders || !currentOrders) return false;

    if (storedOrders.length !== currentOrders.length) return true;

    return storedOrders.some((stored) => {
      const current = currentOrders.find(
        (c) => c.id === stored.id || c.menu_item === stored.menu_item
      );
      return !current || current.quantity !== stored.quantity;
    });
  },

  // localStorage 정리
  clearOrders: (sessionId) => {
    if (!sessionId) return;
    const key = `orders_${sessionId}`;
    localStorage.removeItem(key);
    console.log("🗑️ localStorage 주문 내역 삭제:", key);
  },
};

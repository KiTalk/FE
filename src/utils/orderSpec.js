// src/utils/orderSpec.js

export const ORDER_SPEC_KEY = "order_spec";

/** 기본 스펙 */
function getDefaultOrderSpec() {
  return {
    cart: [],
    package: {},
    point: {},
    // mode는 선택적 — 없으면 기본 라우팅
  };
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** 현재 스펙 읽기 (레거시 호환) */
export function loadOrderSpec() {
  try {
    const raw = window.localStorage.getItem(ORDER_SPEC_KEY);
    if (raw) {
      const parsed = safeParse(raw);
      if (parsed && typeof parsed === "object") {
        const pkg = parsed?.package ?? {};
        const point = parsed?.point ?? {};
        const cartRaw = parsed?.cart;

        // 최신 구조: 배열
        if (Array.isArray(cartRaw)) {
          return { ...parsed, cart: cartRaw, package: pkg, point };
        }

        // 레거시: itemsById -> 배열 변환
        const legacyItemsById = cartRaw?.itemsById ?? {};
        const migratedArray = Object.values(legacyItemsById);
        return { ...parsed, cart: migratedArray, package: pkg, point };
      }
    }
    return getDefaultOrderSpec();
  } catch {
    return getDefaultOrderSpec();
  }
}

/**
 * 병합 저장 (⭐ 중요)
 * - 기존 order_spec을 읽어와 nextSpec를 덮어쓰는 방식으로 병합합니다.
 * - 이렇게 하면 mode 등 다른 필드가 유실되지 않습니다.
 */
export function saveOrderSpec(nextSpec) {
  const current = loadOrderSpec();
  const spec = nextSpec
    ? { ...current, ...nextSpec }
    : { ...current }; // nextSpec가 없으면 현재값 유지
  try {
    window.localStorage.setItem(ORDER_SPEC_KEY, JSON.stringify(spec));
  } catch (err) {
    console.error(err);
  }
}

/** 부분 변경 병합 */
export function updateOrderSpec(patch) {
  const cur = loadOrderSpec();
  const next = { ...cur, ...(patch ?? {}) };
  saveOrderSpec(next);
  return next;
}

/** mode만 간편하게 설정 */
export function setMode(mode) {
  return updateOrderSpec({ mode });
}

/** 카트 항목 저장 — 불필요 필드 정리 + 병합 */
export function saveCartItems(cartOrMap) {
  const itemsArrayRaw = Array.isArray(cartOrMap)
    ? cartOrMap
    : Object.values(cartOrMap ?? {});
  const itemsArray = itemsArrayRaw.map(function (it) {
    if (!it || typeof it !== "object") return it;
    const result = { ...it };
    // 저장 최소화
    delete result.id;
    delete result.popular;
    return result;
  });

  updateOrderSpec({
    cart: itemsArray,
  });
}

/** 포장/수령 옵션 저장 — 병합 */
export function saveOrderPackage(packagePartial) {
  const cur = loadOrderSpec();
  updateOrderSpec({
    package: { ...(cur.package ?? {}), ...(packagePartial ?? {}) },
  });
}

/** 포인트/전화 저장 — 병합 */
export function saveOrderPoint(pointPartial) {
  const cur = loadOrderSpec();
  updateOrderSpec({
    point: { ...(cur.point ?? {}), ...(pointPartial ?? {}) },
  });
}

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
export function listAddedTotalKeys(ls = typeof window !== "undefined" ? window.localStorage : null) {
  if (!ls) return [];
  const keys = [];
  for (let i = 0; i < ls.length; i++) {
    const k = ls.key(i);
    if (isAddedTotalKey(k)) keys.push(k);
  }
  return keys;
}

/** added_total_* 전부 제거 */
export function clearAllAddedTotals(ls = typeof window !== "undefined" ? window.localStorage : null) {
  if (!ls) return;
  listAddedTotalKeys(ls).forEach((k) => ls.removeItem(k));
}

/** 허용된 id(정규화된 id) 목록만 남기고 나머지 added_total_* 삭제 */
export function purgeAddedTotalsByIds(allowedNormIds = [], ls = typeof window !== "undefined" ? window.localStorage : null) {
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

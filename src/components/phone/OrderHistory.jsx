// OrderHistory.jsx (Headless: 데이터/상태 전용)
// 서버 연동 시: fetch(`${import.meta.env.VITE_API_URL}/orders?...`) 로 교체하면 됨

import React, { useEffect, useMemo, useState } from "react";

/* 컴포넌트 함수 선언식: Headless OrderHistory */
export default function OrderHistory({
  children,
  customOrders = null,
  customFavorites = null,
  loading: customLoading = null,
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 날짜 페이징 (가장 최신 날짜부터 시작)
  const MAX_DAYS = 5;
  const [index, setIndex] = useState(0); // 0이 가장 최신 날짜

  /* 내부 동작 함수 선언식 */
  function canPrev() {
    return index > 0; // index가 0보다 클 때(과거 날짜 보는 중) 이전 버튼 활성화
  }
  function canNext() {
    return index < Math.min(MAX_DAYS, orders.length) - 1; // 마지막 날짜가 아닐 때 다음 버튼 활성화
  }
  function handlePrev() {
    if (canPrev()) setIndex((i) => i - 1); // index 감소 = 더 최신 날짜로
  }
  function handleNext() {
    if (canNext()) setIndex((i) => i + 1); // index 증가 = 더 과거 날짜로
  }

  // 체크/수량 상태 (체크리스트 UI가 필요할 때 사용)
  // selected[date][itemId] = { checked: boolean, qty: number }
  const [selected, setSelected] = useState({});

  function initOrders() {
    // customOrders가 제공되면 그것을 사용, 아니면 빈 배열 사용
    const list = customOrders
      ? [...customOrders].sort((a, b) => (a.date > b.date ? -1 : 1))
      : [];
    setOrders(list);

    // 과거 수량으로 초기화(수량>0 → 자동 체크)
    const initSel = {};
    list.forEach((d) => {
      initSel[d.date] = {};
      d.items.forEach((it) => {
        initSel[d.date][it.id] = {
          checked: (it.qty ?? 0) > 0,
          qty: it.qty ?? 0,
        };
      });
    });
    setSelected(initSel);

    // 로딩 상태는 customLoading이 제공되면 그것을 사용
    if (customLoading !== null) {
      setLoading(customLoading);
    } else {
      setLoading(false);
    }
  }

  function toggleDate(date) {
    const allOn =
      Object.values(selected[date] || {}).every((v) => v.checked) &&
      Object.keys(selected[date] || {}).length > 0;
    const next = { ...selected };
    const bucket = { ...(next[date] || {}) };
    Object.keys(bucket).forEach((id) => {
      bucket[id] = { checked: !allOn, qty: !allOn ? 1 : 0 };
    });
    next[date] = bucket;
    setSelected(next);
  }

  function toggleItem(date, itemId) {
    const next = { ...selected };
    const bucket = { ...(next[date] || {}) };
    const cur = bucket[itemId] || { checked: false, qty: 0 };
    bucket[itemId] = { checked: !cur.checked, qty: !cur.checked ? 1 : 0 };
    next[date] = bucket;
    setSelected(next);
  }

  function qtyMinus(date, itemId) {
    const next = { ...selected };
    const bucket = { ...(next[date] || {}) };
    const cur = bucket[itemId] || { checked: false, qty: 0 };
    const q = Math.max(0, (cur.qty || 0) - 1);
    bucket[itemId] = { checked: cur.checked && q > 0, qty: q };
    next[date] = bucket;
    setSelected(next);
  }

  function qtyPlus(date, itemId) {
    const next = { ...selected };
    const bucket = { ...(next[date] || {}) };
    const cur = bucket[itemId] || { checked: false, qty: 0 };
    const q = (cur.qty || 0) + 1;
    bucket[itemId] = { checked: true, qty: q };
    next[date] = bucket;
    setSelected(next);
  }

  function getSelectedList() {
    const out = [];
    orders.forEach((d) => {
      d.items.forEach((it) => {
        const st = selected[d.date]?.[it.id];
        if (st?.checked && st.qty > 0)
          out.push({ product: it, quantity: st.qty });
      });
    });
    return out;
  }

  function clearSelectedItems() {
    setSelected(function (prev) {
      const next = { ...prev };
      Object.keys(next).forEach(function (date) {
        const bucket = { ...next[date] };
        Object.keys(bucket).forEach(function (itemId) {
          bucket[itemId] = { checked: false, qty: 0 };
        });
        next[date] = bucket;
      });
      return next;
    });
  }

  // 즐겨찾기(자주 시킨 메뉴): customFavorites가 제공되면 사용, 아니면 계산
  const favorites = useMemo(
    function () {
      if (customFavorites && Array.isArray(customFavorites)) {
        // API에서 제공된 자주 시킨 메뉴 사용
        return customFavorites;
      }

      // 기존 로직: 수량>0 이었던 날짜 수로 랭킹
      const counter = new Map();
      orders.forEach(function (d) {
        d.items.forEach(function (it) {
          const prev = counter.get(it.id) || { count: 0, item: it };
          counter.set(it.id, {
            count: prev.count + ((it.qty ?? 0) > 0 ? 1 : 0),
            item: it,
          });
        });
      });
      return Array.from(counter.values())
        .sort((a, b) => b.count - a.count)
        .map((x) => ({ ...x.item, _count: x.count }));
    },
    [orders, customFavorites]
  );

  useEffect(initOrders, [customOrders, customLoading]);

  const windowDays = orders.slice(0, MAX_DAYS);
  const currentDay = windowDays[index] || null;

  const api = {
    // 로딩/날짜창
    loading,
    orders,
    windowDays,
    index,
    setIndex,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
    currentDay,
    // 즐겨찾기
    favorites,
    // 체크/수량
    selected,
    toggleDate,
    toggleItem,
    qtyMinus,
    qtyPlus,
    getSelectedList,
    clearSelectedItems,
  };

  return typeof children === "function" ? children(api) : null;
}

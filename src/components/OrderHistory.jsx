// OrderHistory.jsx (Headless: 데이터/상태 전용)
// 서버 연동 시: fetch(`${import.meta.env.VITE_API_URL}/orders?...`) 로 교체하면 됨

import React, { useEffect, useMemo, useState } from "react";

/* 더미데이터 로더 (API 연동 시 제거/대체) */
function loadDummyOrders() {
  return [
    { date: "2025-08-15", items: [
      { id: "ame-ice",  name: "아메리카노 아이스", price: 2500, popular: true,  temp: "ice", qty: 0 },
      { id: "lat-hot",  name: "카페라떼 핫",      price: 3200, popular: false, temp: "hot", qty: 0 },
    ]},
    { date: "2025-08-14", items: [
      { id: "ame-ice",  name: "아메리카노 아이스", price: 2500, popular: true,  temp: "ice", qty: 1 },
      { id: "van-ice",  name: "바닐라라떼 아이스", price: 3500, popular: false, temp: "ice", qty: 0 },
    ]},
    { date: "2025-08-13", items: [
      { id: "cap-hot",  name: "카푸치노 핫",      price: 3400, popular: false, temp: "hot", qty: 0 },
    ]},
    { date: "2025-08-12", items: [
      { id: "ame-ice",  name: "아메리카노 아이스", price: 2500, popular: true,  temp: "ice", qty: 2 },
      { id: "lat-ice",  name: "카페라떼 아이스",   price: 3300, popular: false, temp: "ice", qty: 0 },
      { id: "cap-hot",  name: "카푸치노 핫",      price: 3400, popular: false, temp: "hot", qty: 1 },
    ]},
    { date: "2025-08-11", items: [
      { id: "ame-ice",  name: "아메리카노 아이스", price: 2500, popular: true,  temp: "ice", qty: 0 },
    ]},
  ];
}

/* 컴포넌트 함수 선언식: Headless OrderHistory */
export default function OrderHistory({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 날짜 페이징
  const MAX_DAYS = 5;
  const [index, setIndex] = useState(0);

  /* 내부 동작 함수 선언식 */
  function canPrev() { return index < Math.min(MAX_DAYS, orders.length) - 1; }
  function canNext() { return index > 0; }
  function handlePrev() { if (canPrev()) setIndex(i => i + 1); }
  function handleNext() { if (canNext()) setIndex(i => i - 1); }

  // 체크/수량 상태 (체크리스트 UI가 필요할 때 사용)
  // selected[date][itemId] = { checked: boolean, qty: number }
  const [selected, setSelected] = useState({});

  function initOrders() {
    // 실제 연동 시: fetch(`${import.meta.env.VITE_API_URL}/orders?...`)
    const list = loadDummyOrders().slice().sort((a, b) => (a.date > b.date ? -1 : 1));
    setOrders(list);

    // 과거 수량으로 초기화(수량>0 → 자동 체크)
    const initSel = {};
    list.forEach(d => {
      initSel[d.date] = {};
      d.items.forEach(it => {
        initSel[d.date][it.id] = { checked: (it.qty ?? 0) > 0, qty: it.qty ?? 0 };
      });
    });
    setSelected(initSel);

    setLoading(false);
  }

  function toggleDate(date) {
    const allOn =
      Object.values(selected[date] || {}).every(v => v.checked) && Object.keys(selected[date] || {}).length > 0;
    const next = { ...selected };
    const bucket = { ...(next[date] || {}) };
    Object.keys(bucket).forEach(id => {
      const cur = bucket[id];
      bucket[id] = { checked: !allOn, qty: Math.max(1, cur.qty || 0) };
    });
    next[date] = bucket;
    setSelected(next);
  }

  function toggleItem(date, itemId) {
    const next = { ...selected };
    const bucket = { ...(next[date] || {}) };
    const cur = bucket[itemId] || { checked: false, qty: 0 };
    bucket[itemId] = { checked: !cur.checked, qty: Math.max(1, cur.qty || 0) };
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
    orders.forEach(d => {
      d.items.forEach(it => {
        const st = selected[d.date]?.[it.id];
        if (st?.checked && st.qty > 0) out.push({ product: it, quantity: st.qty });
      });
    });
    return out;
  }

  // 즐겨찾기(자주 시킨 메뉴): 수량>0 이었던 날짜 수로 랭킹
  const favorites = useMemo(function () {
    const counter = new Map();
    orders.forEach(function (d) {
      d.items.forEach(function (it) {
        const prev = counter.get(it.id) || { count: 0, item: it };
        counter.set(it.id, { count: prev.count + ((it.qty ?? 0) > 0 ? 1 : 0), item: it });
      });
    });
    return Array.from(counter.values())
      .sort((a, b) => b.count - a.count)
      .map(x => ({ ...x.item, _count: x.count }));
  }, [orders]);

  useEffect(initOrders, []);

  const windowDays = orders.slice(0, MAX_DAYS);
  const currentDay = windowDays[index] || null;

  const api = {
    // 로딩/날짜창
    loading, orders, windowDays, index, setIndex,
    canPrev, canNext, handlePrev, handleNext,
    currentDay,
    // 즐겨찾기
    favorites,
    // 체크/수량
    selected, toggleDate, toggleItem, qtyMinus, qtyPlus, getSelectedList,
  };

  return typeof children === "function" ? children(api) : null;
}

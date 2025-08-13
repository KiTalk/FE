// CartProvider.jsx
import React, { useMemo, useReducer, useEffect } from "react";
import { CartContext } from "./CartContext.jsx";

/* ✅ 외부에서 정리할 수 있도록 키를 export */
export const CART_STORAGE_KEY = "touch-cart-v1";

/** 로컬스토리지 로드 */
function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { itemsById: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.itemsById) {
      return { itemsById: {} };
    }
    return { itemsById: parsed.itemsById };
  } catch {
    return { itemsById: {} };
  }
}

/** 로컬스토리지 저장 */
function saveToStorage(state) {
  try {
    const safe = { itemsById: state.itemsById ?? {} };
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(safe));
  } catch (err) {
    console.error(err);
  }
}

/** ---------------- Reducer ---------------- **/
function cartReducer(state, action) {
  if (action.type === "ADD") {
    const { product, qty } = action.payload;
    const prev = state.itemsById[product.id] || { ...product, qty: 0 };
    const next = { ...prev, qty: prev.qty + qty };
    return { itemsById: { ...state.itemsById, [product.id]: next } };
  }
  if (action.type === "INC") {
    const cur = state.itemsById[action.payload.id];
    if (!cur) return state;
    return {
      itemsById: { ...state.itemsById, [cur.id]: { ...cur, qty: cur.qty + 1 } },
    };
  }
  if (action.type === "DEC") {
    const cur = state.itemsById[action.payload.id];
    if (!cur) return state;
    const nextQty = Math.max(0, cur.qty - 1);
    return {
      itemsById: { ...state.itemsById, [cur.id]: { ...cur, qty: nextQty } },
    };
  }
  if (action.type === "CLEAR_ZEROES") {
    const next = {};
    Object.values(state.itemsById).forEach(function (it) {
      if (it.qty > 0) next[it.id] = it;
    });
    return { itemsById: next };
  }
  if (action.type === "RESET") {
    return { itemsById: {} };
  }
  return state;
}

/** ---------------- Provider ---------------- **/
export default function CartProvider(props) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage);

  function addItem(product, qty) {
    if (!product?.id || qty <= 0) return;
    dispatch({ type: "ADD", payload: { product, qty } });
  }
  function increase(id) {
    dispatch({ type: "INC", payload: { id } });
  }
  function decrease(id) {
    dispatch({ type: "DEC", payload: { id } });
    dispatch({ type: "CLEAR_ZEROES" });
  }
  function resetCart() {
    dispatch({ type: "RESET" });
  }

  const items = useMemo(
    function () {
      return Object.values(state.itemsById);
    },
    [state.itemsById]
  );
  const totalQty = useMemo(
    function () {
      return items.reduce((a, c) => a + c.qty, 0);
    },
    [items]
  );
  const totalPrice = useMemo(
    function () {
      return items.reduce((a, c) => a + c.price * c.qty, 0);
    },
    [items]
  );

  const value = useMemo(
    function () {
      return {
        items,
        totalQty,
        totalPrice,
        addItem,
        increase,
        decrease,
        resetCart,
      };
    },
    [items, totalQty, totalPrice]
  );

  useEffect(
    function persist() {
      saveToStorage(state);
    },
    [state]
  );

  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
}

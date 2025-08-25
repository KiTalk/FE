// CartProvider.jsx
import React, { useMemo, useReducer, useEffect } from "react";
import { CartContext } from "./CartContext.jsx";
import { loadOrderSpec, saveCartItems } from "../../utils/orderSpec";

function loadFromStorage() {
  try {
    const spec = loadOrderSpec();
    const cartArray = Array.isArray(spec?.cart) ? spec.cart : [];
    const itemsById = {};
    cartArray.forEach(function (stored) {
      if (!stored || typeof stored !== "object") return;
      const key = `${stored.name}|${stored.price}`;
      const productId = stored.id || key; // fallback key if not found
      const merged = {
        id: productId,
        name: stored.name,
        price: Number(stored.price ?? 0),
        popular: !!stored.popular,
        temp: stored.temp || "ice", // 기본값 설정
        qty: Number(stored.qty ?? 0),
      };
      const prev = itemsById[productId];
      if (prev) {
        itemsById[productId] = { ...merged, qty: prev.qty + merged.qty };
      } else {
        itemsById[productId] = merged;
      }
    });
    return { itemsById: {} };
  } catch {
    return { itemsById: {} };
  }
}

/** 로컬스토리지 저장 */
function saveToStorage(state) {
  try {
    const itemsById = state.itemsById ?? {};
    saveCartItems(itemsById);
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
      return items.reduce(function (a, c) {
        return a + c.qty;
      }, 0);
    },
    [items]
  );
  const totalPrice = useMemo(
    function () {
      return items.reduce(function (a, c) {
        return a + c.price * c.qty;
      }, 0);
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

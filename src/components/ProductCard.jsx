import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  ProductCard as ProductCardBox,
  PopularTag,
  ImageArea,
  ProductImage,   // 추가
  InfoArea,
  ProductName,
  ProductPrice,
  QuantityRow,
  QuantityButton,
  QuantityValue,
  AddButton,
  NameRow,
  TemperatureBadge,
  AddedOverlay,
} from "./Product.styles";
import { getStorageKey, normalizeId } from "../utils/storage";
import americanoIceImg from "../assets/images/americano-ice.png"; // ✅ 이미지 import

export default function ProductCard({
  product,
  onAdd,
  mode = "order",
  cartQty = 0,
  onIncrease,
  onDecrease,
  tagLabel,
}) {
  const LS = typeof window !== "undefined" ? window.localStorage : null;
  const normId = normalizeId(product?.id);

  const [quantity, setQuantity] = useState(0);
  const [addedTotal, setAddedTotal] = useState(() => {
    if (!normId || !LS) return 0;
    const raw = LS.getItem(getStorageKey(normId));
    const n = raw != null ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  });

  function getTemperatureLabel(id) {
    if (!id) return null;
    const lowered = String(id).toLowerCase();
    if (lowered.includes("ice")) return "시원한";
    if (lowered.includes("hot")) return "뜨거운";
    return null;
  }

  const temperatureLabel = getTemperatureLabel(product?.id);
  const temperatureVariant =
    temperatureLabel === "시원한" ? "cold" : temperatureLabel === "뜨거운" ? "hot" : null;

  function handleMinus() { setQuantity((q) => Math.max(0, q - 1)); }
  function handlePlus() { setQuantity((q) => q + 1); }

  function handleAdd() {
    if (quantity <= 0) return;
    const nextTotal = addedTotal + quantity;
    setAddedTotal(nextTotal);
    if (normId && LS) LS.setItem(getStorageKey(normId), String(nextTotal));
    if (typeof onAdd === "function") onAdd({ product, quantity, total: nextTotal });
    setQuantity(0);
  }

  function handleCartMinus() { if (typeof onDecrease === "function") onDecrease(product?.id); }
  function handleCartPlus() { if (typeof onIncrease === "function") onIncrease(product?.id); }

  useLayoutEffect(() => {
    if (!normId) { setAddedTotal(0); return; }
    const key = getStorageKey(normId);

    if (mode === "cart") {
      const q = Number(cartQty ?? 0);
      setAddedTotal(q);
      if (!LS) return;
      if (q > 0) LS.setItem(key, String(q));
      else LS.removeItem(key);
    } else {
      if (!LS) { setAddedTotal(0); return; }
      const raw = LS.getItem(key);
      const n = raw != null ? Number(raw) : 0;
      setAddedTotal(Number.isFinite(n) ? n : 0);
    }
  }, [mode, cartQty, normId]);

  useEffect(() => {
    if (mode !== "order" || !normId) return;
    const key = getStorageKey(normId);

    const sync = () => {
      if (!LS) { setAddedTotal(0); return; }
      const raw = LS.getItem(key);
      const n = raw != null ? Number(raw) : 0;
      setAddedTotal(Number.isFinite(n) ? n : 0);
    };

    sync();
    const onFocus = () => sync();
    const onVis = () => { if (!document.hidden) sync(); };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, normId]);

  const displayedQty = mode === "cart" ? Number(cartQty ?? 0) : quantity;
  const overlayCount = addedTotal;
  const showOverlay = overlayCount > 0;
  const addDisabled = mode !== "cart" && quantity <= 0;

  return (
    <ProductCardBox>
      {tagLabel ? <PopularTag>{tagLabel}</PopularTag> : (product?.popular && <PopularTag>인기</PopularTag>)}
      <ImageArea $variant={temperatureVariant}>
        {/* ✅ americano-ice 전용 이미지 */}
        {product?.id === "americano-ice" && (
          <ProductImage src={americanoIceImg} alt={product?.name || "아메리카노 아이스"} />
        )}
      </ImageArea>
      <InfoArea>
        <AddedOverlay $show={showOverlay} aria-live="polite">
          {overlayCount}개 담김
        </AddedOverlay>
        <NameRow>
          <ProductName>{product?.name}</ProductName>
          {temperatureLabel && <TemperatureBadge $variant={temperatureVariant}>{temperatureLabel}</TemperatureBadge>}
        </NameRow>
        <ProductPrice>{Number(product?.price ?? 0).toLocaleString()}원</ProductPrice>
        <QuantityRow>
          {mode === "cart" ? (
            <>
              <QuantityButton $type="minus" onClick={handleCartMinus} />
              <QuantityValue>{displayedQty}</QuantityValue>
              <QuantityButton $type="plus" onClick={handleCartPlus} />
            </>
          ) : (
            <>
              <QuantityButton $type="minus" onClick={handleMinus} />
              <QuantityValue>{displayedQty}</QuantityValue>
              <QuantityButton $type="plus" onClick={handlePlus} />
            </>
          )}
        </QuantityRow>
      </InfoArea>
      {mode !== "cart" && (
        <AddButton onClick={handleAdd} disabled={addDisabled} aria-disabled={addDisabled} $disabled={addDisabled}>
          담기
        </AddButton>
      )}
    </ProductCardBox>
  );
}

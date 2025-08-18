import React, { useState, useEffect } from "react";
import {
  ProductCard as ProductCardBox,
  PopularTag,
  ImageArea,
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

/* ★ 변경사항
   - tagLabel prop 추가: 좌측 상단 뱃지 텍스트를 외부에서 지정(예: '1위', '2위', '3위')
   - 기본 동작: tagLabel이 있으면 '인기' 대신 tagLabel을 표시, 없으면 기존 popular=true일 때 '인기' 표시
*/

export default function ProductCard({
  product,
  onAdd,
  mode = "order",
  cartQty = 0,
  onIncrease,
  onDecrease,
  tagLabel, // ★ 추가
}) {
  const [quantity, setQuantity] = useState(0);
  const [addedTotal, setAddedTotal] = useState(0);

  // 마운트 시 localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(`added_total_${product.id}`);
    if (saved) {
      setAddedTotal(Number(saved));
    }
  }, [product.id]);

  function getTemperatureLabel(id) {
    if (!id) return null;
    const lowered = String(id).toLowerCase();
    if (lowered.includes("ice")) return "시원한";
    if (lowered.includes("hot")) return "뜨거운";
    return null;
  }

  const temperatureLabel = getTemperatureLabel(product?.id);

  const temperatureVariant =
    temperatureLabel === "시원한"
      ? "cold"
      : temperatureLabel === "뜨거운"
      ? "hot"
      : null;

  function handleMinus() {
    setQuantity(function (q) {
      return Math.max(0, q - 1);
    });
  }

  function handlePlus() {
    setQuantity(function (q) {
      return q + 1;
    });
  }

  function handleAdd() {
    if (quantity <= 0) return;
    const nextTotal = addedTotal + quantity;
    setAddedTotal(nextTotal);

    // ★ localStorage에 저장
    localStorage.setItem(`added_total_${product.id}`, String(nextTotal));

    if (typeof onAdd === "function") {
      onAdd({ product, quantity, total: nextTotal });
    }
    setQuantity(0);
  }

  function handleCartMinus() {
    if (typeof onDecrease === "function") onDecrease(product.id);
  }

  function handleCartPlus() {
    if (typeof onIncrease === "function") onIncrease(product.id);
  }

  const displayedQty = mode === "cart" ? Number(cartQty ?? 0) : quantity;
  const overlayCount = mode === "cart" ? Number(cartQty ?? 0) : addedTotal;
  const showOverlay = overlayCount > 0;
  const addDisabled = mode !== "cart" && quantity <= 0;

  return (
    <ProductCardBox>
      {/* ★ 랭킹 뱃지 우선 표시, 없으면 기존 인기 태그 표시 */}
      {tagLabel ? (
        <PopularTag>{tagLabel}</PopularTag>
      ) : (
        product.popular && <PopularTag>인기</PopularTag>
      )}

      <ImageArea $variant={temperatureVariant} />
      <InfoArea>
        <AddedOverlay $show={showOverlay} aria-live="polite">
          {overlayCount}개 담김
        </AddedOverlay>

        <NameRow>
          <ProductName>{product.name}</ProductName>
          {temperatureLabel && (
            <TemperatureBadge $variant={temperatureVariant}>
              {temperatureLabel}
            </TemperatureBadge>
          )}
        </NameRow>

        <ProductPrice>
          {Number(product?.price ?? 0).toLocaleString()}원
        </ProductPrice>

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
        <AddButton
          onClick={handleAdd}
          disabled={addDisabled}
          aria-disabled={addDisabled}
          $disabled={addDisabled}
        >
          담기
        </AddButton>
      )}
    </ProductCardBox>
  );
}

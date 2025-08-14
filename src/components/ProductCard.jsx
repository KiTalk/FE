import React, { useState } from "react";
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

export default function ProductCard({
  product,
  onAdd,
  mode = "order",
  cartQty = 0,
  onIncrease,
  onDecrease,
}) {
  const [quantity, setQuantity] = useState(0);
  const [addedTotal, setAddedTotal] = useState(0);

  function getTemperatureLabel(id) {
    if (!id) return null;
    const lowered = String(id).toLowerCase();
    if (lowered.includes("ice")) return "시원한";
    if (lowered.includes("hot")) return "뜨거운";
    return null;
  }

  const temperatureLabel = getTemperatureLabel(product?.id);

  const temperatureVariant =
    temperatureLabel === "시원한" ? "cold" :
    temperatureLabel === "뜨거운" ? "hot" : null;

  function handleMinus() {
    setQuantity(function (q) { return Math.max(0, q - 1); });
  }

  function handlePlus() {
    setQuantity(function (q) { return q + 1; });
  }

  function handleAdd() {
    if (quantity <= 0) return;
    const nextTotal = addedTotal + quantity;
    setAddedTotal(nextTotal);
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

  const overlayCount  = mode === "cart" ? Number(cartQty ?? 0) : addedTotal;

  const showOverlay   = overlayCount > 0;

  const addDisabled = mode !== "cart" && quantity <= 0;

  return (
    <ProductCardBox>
      {product.popular && <PopularTag>인기</PopularTag>}
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
        <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
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

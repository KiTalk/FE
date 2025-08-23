import React, { useState, useLayoutEffect } from "react";
import {
  ProductCard as ProductCardBox,
  PopularTag,
  ImageArea,
  ProductImage,
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
} from "./ProductCard.styles";

export default function ProductCard({
  product,
  onAdd,
  mode = "order",
  cartQty = 0,
  onIncrease,
  onDecrease,
  tagLabel,
  currentMode,
  selectedMenuType,
}) {
  const [quantity, setQuantity] = useState(0);
  const [addedTotal, setAddedTotal] = useState(0);

  function getTemperatureLabel(temp) {
    if (temp === "ice") return "시원한";
    if (temp === "hot") return "뜨거운";
    return null;
  }

  const temperatureLabel = getTemperatureLabel(product?.temp);
  const temperatureVariant =
    temperatureLabel === "시원한"
      ? "cold"
      : temperatureLabel === "뜨거운"
      ? "hot"
      : null;

  function handleMinus() {
    setQuantity((q) => Math.max(0, q - 1));
  }
  function handlePlus() {
    setQuantity((q) => q + 1);
  }

  function handleAdd() {
    if (quantity <= 0) return;
    if (typeof onAdd === "function")
      onAdd({ product, quantity, total: addedTotal + quantity });
    setQuantity(0);
  }

  function handleCartMinus() {
    if (typeof onDecrease === "function") onDecrease(product?.id);
  }
  function handleCartPlus() {
    if (typeof onIncrease === "function") onIncrease(product?.id);
  }

  useLayoutEffect(() => {
    // 서버 장바구니 수량 사용 (cartQty prop 기반)
    const q = Number(cartQty ?? 0);
    setAddedTotal(q);
  }, [cartQty]);

  const displayedQty = mode === "cart" ? Number(cartQty ?? 0) : quantity;
  const overlayCount = addedTotal;
  const showOverlay = overlayCount > 0;
  const addDisabled = mode !== "cart" && quantity <= 0;

  return (
    <ProductCardBox
      $currentMode={currentMode}
      $productName={product?.name}
      $selectedMenuType={selectedMenuType}
    >
      {tagLabel ? (
        <PopularTag>{tagLabel}</PopularTag>
      ) : (
        product?.popular && <PopularTag>인기</PopularTag>
      )}
      <ImageArea $variant={temperatureVariant}>
        {/* profile 이미지가 있을 때만 표시 */}
        {product?.profileImage && (
          <ProductImage
            src={product.profileImage}
            alt={product?.name || "상품 이미지"}
          />
        )}
      </ImageArea>
      <InfoArea>
        <AddedOverlay $show={showOverlay} aria-live="polite">
          {overlayCount}개 담김
        </AddedOverlay>
        <NameRow>
          <ProductName>{product?.name}</ProductName>
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

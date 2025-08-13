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

export default function ProductCard({ product, onAdd }) {
  const [quantity, setQuantity] = useState(0);
  const [addedTotal, setAddedTotal] = useState(0); // 메뉴(제품)별 누적 수량

  function handleMinus() {
    setQuantity(function (q) { return Math.max(0, q - 1); });
  }

  function handlePlus() {
    setQuantity(function (q) { return q + 1; });
  }

  function handleAdd() {
    if (quantity <= 0) return; // 0개는 담지 않음
    const nextTotal = addedTotal + quantity;
    setAddedTotal(nextTotal);

    if (typeof onAdd === "function") {
      onAdd({ product, quantity, total: nextTotal });
    }
    setQuantity(0);
  }

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

  return (
    <ProductCardBox>
      {product.popular && <PopularTag>인기</PopularTag>}

      <ImageArea>
        {/* <ProductImage src={image} alt={product.name} /> */}
      </ImageArea>

      <InfoArea>
        <AddedOverlay
          className="addedOverlayContainer"
          $show={addedTotal > 0}
          aria-live="polite"
        >
          {addedTotal}개 담김
        </AddedOverlay>

        <NameRow className="nameRowContainer">
          <ProductName>{product.name}</ProductName>

          {temperatureLabel && (
            <TemperatureBadge
              className="temperatureBadgeItem"
              $variant={temperatureVariant}
              aria-label={`온도: ${temperatureLabel}`}
              title={temperatureLabel}
            >
              {temperatureLabel}
            </TemperatureBadge>
          )}
        </NameRow>

        <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>

        <QuantityRow>
          <QuantityButton $type="minus" onClick={handleMinus} />
          <QuantityValue>{quantity}</QuantityValue>
          <QuantityButton $type="plus" onClick={handlePlus} />
        </QuantityRow>
      </InfoArea>

      <AddButton onClick={handleAdd}>담기</AddButton>
    </ProductCardBox>
  );
}

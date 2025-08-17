import React from "react";
import {
  Card,
  ImageArea,
  PopularTag,
  InfoArea,
  Name,
  Price,
  QtyRow,
  QtyButton,
  QtyValue,
} from "./CartProductCard.styles";

/**
 * CartProductCard
 * - Fixed 381 x 420 card for Cart page
 * - No "담기" button (cart-only controls)
 * props:
 *  - product: { id, name, price, popular, temp }
 *  - qty: number
 *  - onIncrease(id)
 *  - onDecrease(id)
 */
export default function CartProductCard({
  product,
  qty = 0,
  onIncrease,
  onDecrease,
}) {
  // ProductCard.jsx와 동일한 온도 라벨 생성
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
    if (typeof onDecrease === "function" && product?.id) {
      onDecrease(product.id);
    }
  }
  function handlePlus() {
    if (typeof onIncrease === "function" && product?.id) {
      onIncrease(product.id);
    }
  }

  return (
    <Card role="group" aria-label={`${product?.name} 카드`}>
      {product?.popular && <PopularTag>인기</PopularTag>}
      <ImageArea $variant={temperatureVariant} />
      <InfoArea>
        <Name>{product?.name}</Name>
        <Price>{Number(product?.price ?? 0).toLocaleString()}원</Price>
        <QtyRow>
          <QtyButton
            aria-label="수량 감소"
            $type="minus"
            onClick={handleMinus}
          />
          <QtyValue aria-live="polite">{Number(qty ?? 0)}</QtyValue>
          <QtyButton aria-label="수량 증가" $type="plus" onClick={handlePlus} />
        </QtyRow>
      </InfoArea>
    </Card>
  );
}

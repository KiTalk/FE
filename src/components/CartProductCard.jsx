import React, { useMemo } from "react";
import {
  Card,
  ImageArea,
  ProductImage,
  PopularTag,
  InfoArea,
  ProductName,
  Name,
  Price,
  QtyRow,
  QtyButton,
  QtyValue,
  NameRow,
  TemperatureBadge,
} from "./CartProductCard.styles";

/**
 * props:
 *  - product: { id, name, price, popular, ... }
 *  - qty: 현재 장바구니 수량
 *  - onIncrease(id), onDecrease(id)
 *  - tagLabel?: 좌측 상단 배지 텍스트(선택)
 */
export default function CartProductCard({
  product,
  qty = 0,
  onIncrease,
  onDecrease,
  tagLabel,
}) {
  // ✅ 현재 모드 읽기 (order_spec.mode)
  const currentMode = useMemo(() => {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem("order_spec");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.mode ?? null;
    } catch {
      return null;
    }
  }, []);

  const handleMinus = () => {
    if (typeof onDecrease === "function" && product?.id != null)
      onDecrease(product.id);
  };
  const handlePlus = () => {
    if (typeof onIncrease === "function" && product?.id != null)
      onIncrease(product.id);
  };

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

  const isPopular = Boolean(product?.popular);
  const priceText = Number(product?.price ?? 0).toLocaleString();

  return (
    <Card $currentMode={currentMode} $productId={product?.id}>
      {tagLabel ? (
        <PopularTag>{tagLabel}</PopularTag>
      ) : (
        isPopular && <PopularTag>인기</PopularTag>
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
        <NameRow>
          <ProductName>{product?.name}</ProductName>
          {temperatureLabel && (
            <TemperatureBadge $variant={temperatureVariant}>
              {temperatureLabel}
            </TemperatureBadge>
          )}
        </NameRow>
        <Price>{priceText}원</Price>
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

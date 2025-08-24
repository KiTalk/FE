import React from "react";
import {
  ItemCard,
  OrderTypeTag,
  ImageArea,
  ProductImage,
  InfoArea,
  NameRow,
  ProductName,
  TemperatureBadge,
  ProductPrice,
  QuantityRow,
  QuantityButton,
  QuantityValue,
} from "./VoiceProductCard.styles";
// CartProductCard와 동일한 이미지 렌더링 정책 적용: profileImage만 표시

export default function VoiceProductCard({
  productName,
  productPrice,
  quantity,
  onMinus,
  onPlus,
  orderType,
  product,
}) {
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
  return (
    <ItemCard>
      <OrderTypeTag>{orderType}</OrderTypeTag>
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
          <ProductName>{productName}</ProductName>
          {temperatureLabel && (
            <TemperatureBadge $variant={temperatureVariant}>
              {temperatureLabel}
            </TemperatureBadge>
          )}
        </NameRow>
        <ProductPrice>
          {typeof productPrice === "number"
            ? `${productPrice.toLocaleString()}원`
            : productPrice}
        </ProductPrice>
        <QuantityRow>
          <QuantityButton
            $type="minus"
            onClick={onMinus}
            type="button"
            aria-label="수량 감소"
            disabled={quantity <= 1}
          />
          <QuantityValue>{quantity}</QuantityValue>
          <QuantityButton
            $type="plus"
            onClick={onPlus}
            type="button"
            aria-label="수량 증가"
          />
        </QuantityRow>
      </InfoArea>
    </ItemCard>
  );
}

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
import americanoIceImg from "../assets/images/americano-ice.png";

export default function VoiceProductCard({
  imageSrc,
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
        {/* ✅ americano-ice 전용 이미지 */}
        {product?.id === "americano-ice" && (
          <ProductImage
            src={americanoIceImg}
            alt={product?.name || "아메리카노 아이스"}
          />
        )}
        {product?.id !== "americano-ice" && (
          <ProductImage src={imageSrc} alt={productName} />
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

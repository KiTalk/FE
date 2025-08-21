import React from "react";
import {
  ItemCard,
  OrderTypeTag,
  ImageArea,
  ProductImage,
  InfoArea,
  ProductName,
  ProductPrice,
  QuantityRow,
  QuantityButton,
  QuantityValue,
} from "./VoiceProductCard.styles";

export default function VoiceProductCard({
  imageSrc,
  productName,
  productPrice,
  quantity,
  onMinus,
  onPlus,
  orderType,
}) {
  return (
    <ItemCard>
      <OrderTypeTag>{orderType}</OrderTypeTag>
      <ImageArea>
        <ProductImage src={imageSrc} alt={productName} />
      </ImageArea>
      <InfoArea>
        <ProductName>{productName}</ProductName>
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

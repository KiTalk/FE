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

function VoiceProductCard({
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
        <ProductPrice>{productPrice}</ProductPrice>
        <QuantityRow>
          <QuantityButton $type="minus" onClick={onMinus} />
          <QuantityValue>{quantity}</QuantityValue>
          <QuantityButton $type="plus" onClick={onPlus} />
        </QuantityRow>
      </InfoArea>
    </ItemCard>
  );
}

export default VoiceProductCard;

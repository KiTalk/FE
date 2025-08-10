import React, { useState } from "react";
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
} from "./Product.styles";

export default function ProductCard({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);

  function handleMinus() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function handlePlus() {
    setQuantity((q) => q + 1);
  }

  function handleAdd() {
    if (onAdd) onAdd({ product, quantity });
  }

  return (
    <ProductCardBox>
      {product.popular && <PopularTag>인기</PopularTag>}
      <ImageArea>
        {/* <ProductImage src={image} alt={product.name} /> */}
      </ImageArea>
      <InfoArea>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
        <QuantityRow>
          <QuantityButton $type="minus" onClick={handleMinus} />
          <QuantityValue>{quantity}</QuantityValue>
          <QuantityButton $type="plus" onClick={handlePlus} />
        </QuantityRow>
        <AddButton onClick={handleAdd}>담기</AddButton>
      </InfoArea>
    </ProductCardBox>
  );
}

// /src/components/ProductCard.jsx
import { useState, useMemo } from "react";
import {
  ProductCard as ProductCardWrap,
  PopularTag,
  ImageArea,
  ProductImage,
  InfoArea,
  NameRow,
  ProductName,
  ProductPrice,
  QuantityRow,
  QuantityButtonMinus,
  QuantityButtonPlus,
  QuantityValue,
  AddButton,
  TempBadge,
} from "/src/components/Product.styles.js";

function formatKRW(value) {
  try {
    return value.toLocaleString("ko-KR");
  } catch {
    const n = Number(value) || 0;
    return n.toLocaleString("ko-KR");
  }
}

export default function ProductCard({
  name,
  price,               // number
  imageSrc,            // string (이미지 URL)
  isPopular = false,   // boolean
  temp = "cold",       // "cold" | "hot"
  onAdd,               // (qty) => void
}) {
  const [qty, setQty] = useState(0);

  const canDecrement = qty > 0;
  const canAdd = qty > 0;

  const priceText = useMemo(() => `${formatKRW(price)}원`, [price]);

  const handleMinus = () => {
    if (!canDecrement) return;
    setQty((q) => Math.max(0, q - 1));
  };

  const handlePlus = () => {
    setQty((q) => Math.min(99, q + 1));
  };

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd?.(qty);
    // 필요 시 장바구니 담은 후 수량 초기화
    // setQty(0);
  };

  return (
    <ProductCardWrap>
      {isPopular && <PopularTag>인기</PopularTag>}

      <ImageArea>
        {imageSrc ? (
          <ProductImage src={imageSrc} alt={name} />
        ) : (
          <ProductImage
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
            alt=""
          />
        )}
      </ImageArea>

      <InfoArea>
        <NameRow>
          <ProductName>{name}</ProductName>
          {/* 온도 뱃지: temp="cold" | "hot" */}
          <TempBadge $temp={temp}>{temp === "cold" ? "차가운" : "뜨거운"}</TempBadge>
        </NameRow>

        <ProductPrice>{priceText}</ProductPrice>

        <QuantityRow>
          <QuantityButtonMinus
            aria-label="수량 감소"
            onClick={handleMinus}
            disabled={!canDecrement}
            title={canDecrement ? "1 감소" : "감소 불가"}
          />
          <QuantityValue aria-live="polite">{qty}</QuantityValue>
          <QuantityButtonPlus
            aria-label="수량 증가"
            onClick={handlePlus}
            title="1 증가"
          />
        </QuantityRow>

        <AddButton
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          aria-disabled={!canAdd}
        >
          담기
        </AddButton>
      </InfoArea>
    </ProductCardWrap>
  );
}

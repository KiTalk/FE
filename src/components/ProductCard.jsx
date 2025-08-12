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
  AddedOverlay, // ✅ 오버레이를 같은 파일에서 가져옵니다
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
  const [showOverlay, setShowOverlay] = useState(false);
  const [totalAdded, setTotalAdded] = useState(0);

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
    onAdd?.(qty);          // ✅ 부모에 알리기
    setTotalAdded(prev => prev + qty);
    setShowOverlay(true);  // ✅ 오버레이 켜기
    setQty(0);             // ✅ 필요 시 초기화
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

      {/* InfoArea는 styles에서 position: relative; 이므로 별도 style 불필요 */}
      <InfoArea>
        <AddedOverlay $visible={showOverlay}>
          {totalAdded}개 담김
        </AddedOverlay>

        <NameRow>
          <ProductName>{name}</ProductName>
          <TempBadge $temp={temp}>
            {temp === "cold" ? "차가운" : "뜨거운"}
          </TempBadge>
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

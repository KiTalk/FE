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

/**
 * props
 * - mode: 'order' | 'cart' (default 'order')
 * - cartQty: cart 모드에서 표시할 수량
 * - onIncrease(id), onDecrease(id): cart 모드에서 ± 버튼 클릭 시 호출
 * - onAdd({ product, quantity, total }): order 모드에서 담기 버튼 클릭 시 호출
 */
export default function ProductCard({
  product,
  onAdd,
  mode = "order",
  cartQty = 0,
  onIncrease,
  onDecrease,
}) {
  // 주문 모드에서 현재 선택한 수량
  const [quantity, setQuantity] = useState(0);
  // 지금까지 담은 총 수량 (overlay 표시에 사용)
  const [addedTotal, setAddedTotal] = useState(0);

  /**
   * 상품 ID에 포함된 문자열을 기반으로
   * '시원한', '뜨거운' 라벨을 반환
   */
  function getTemperatureLabel(id) {
    if (!id) return null;
    const lowered = String(id).toLowerCase();
    if (lowered.includes("ice")) return "시원한";
    if (lowered.includes("hot")) return "뜨거운";
    return null;
  }

  // 라벨 텍스트 (시원한/뜨거운)
  const temperatureLabel = getTemperatureLabel(product?.id);

  // 스타일 적용을 위한 variant 값 결정
  const temperatureVariant =
    temperatureLabel === "시원한" ? "cold" :
    temperatureLabel === "뜨거운" ? "hot" : null;

  // 주문 모드에서 수량 감소
  function handleMinus() {
    setQuantity(function (q) { return Math.max(0, q - 1); });
  }

  // 주문 모드에서 수량 증가
  function handlePlus() {
    setQuantity(function (q) { return q + 1; });
  }

  // 주문 모드에서 '담기' 버튼 클릭 시 실행
  function handleAdd() {
    if (quantity <= 0) return; // 0개 이하이면 동작 안 함
    const nextTotal = addedTotal + quantity; // 누적 수량 계산
    setAddedTotal(nextTotal); // 누적 수량 상태 갱신
    if (typeof onAdd === "function") {
      // 부모로 선택 상품, 개별 수량, 총 누적 수량 전달
      onAdd({ product, quantity, total: nextTotal });
    }
    setQuantity(0); // 수량 초기화
  }

  // 장바구니 모드에서 수량 감소
  function handleCartMinus() {
    if (typeof onDecrease === "function") onDecrease(product.id);
  }

  // 장바구니 모드에서 수량 증가
  function handleCartPlus() {
    if (typeof onIncrease === "function") onIncrease(product.id);
  }

  // 현재 표시할 수량 (모드에 따라 다르게 표시)
  const displayedQty = mode === "cart" ? Number(cartQty ?? 0) : quantity;

  // overlay(담김 표시)에 쓸 수량
  const overlayCount  = mode === "cart" ? Number(cartQty ?? 0) : addedTotal;

  // overlay 표시 여부
  const showOverlay   = overlayCount > 0;

  // '담기' 버튼 비활성화 여부
  const addDisabled = mode !== "cart" && quantity <= 0;

  return (
    <ProductCardBox>
      {/* 인기 상품 태그 */}
      {product.popular && <PopularTag>인기</PopularTag>}

      {/* 상품 이미지 영역 (ice/hot에 따라 배경색 variant 적용) */}
      <ImageArea $variant={temperatureVariant} />

      <InfoArea>
        {/* 담김 overlay (접근성 위해 aria-live 사용) */}
        <AddedOverlay $show={showOverlay} aria-live="polite">
          {overlayCount}개 담김
        </AddedOverlay>

        {/* 상품명 + 온도 배지 */}
        <NameRow>
          <ProductName>{product.name}</ProductName>
          {temperatureLabel && (
            <TemperatureBadge $variant={temperatureVariant}>
              {temperatureLabel}
            </TemperatureBadge>
          )}
        </NameRow>

        {/* 상품 가격 */}
        <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>

        {/* 수량 조절 영역 */}
        <QuantityRow>
          {mode === "cart" ? (
            // 장바구니 모드 (부모에서 수량 관리)
            <>
              <QuantityButton $type="minus" onClick={handleCartMinus} />
              <QuantityValue>{displayedQty}</QuantityValue>
              <QuantityButton $type="plus" onClick={handleCartPlus} />
            </>
          ) : (
            // 주문 모드 (로컬 state로 수량 관리)
            <>
              <QuantityButton $type="minus" onClick={handleMinus} />
              <QuantityValue>{displayedQty}</QuantityValue>
              <QuantityButton $type="plus" onClick={handlePlus} />
            </>
          )}
        </QuantityRow>
      </InfoArea>

      {/* 주문 모드일 때만 '담기' 버튼 표시 */}
      {mode !== "cart" && (
        <AddButton
          onClick={handleAdd}
          disabled={addDisabled}      // 네이티브 disabled
          aria-disabled={addDisabled} // 접근성 지원
          $disabled={addDisabled}     // 스타일용 커스텀 prop
        >
          담기
        </AddButton>
      )}
    </ProductCardBox>
  );
}

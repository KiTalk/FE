import React, { useEffect, useMemo } from "react";
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
import { getStorageKey, normalizeId } from "../utils/storage";

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
  const LS = typeof window !== "undefined" ? window.localStorage : null;
  const normId = useMemo(() => normalizeId(product?.id), [product?.id]);

  // ✅ 현재 모드 읽기 (order_spec.mode)
  const currentMode = useMemo(() => {
    try {
      if (!LS) return null;
      const raw = LS.getItem("order_spec");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.mode ?? null;
    } catch {
      return null;
    }
  }, [LS]);

  // qty 변경 시 localStorage('added_total_{normId}') 동기화 (0이면 삭제)
  useEffect(() => {
    if (!LS || !normId) return;
    const key = getStorageKey(normId);
    const n = Number(qty ?? 0);
    if (n > 0) LS.setItem(key, String(n));
    else LS.removeItem(key);
  }, [LS, normId, qty]);

  const handleMinus = () => {
    if (typeof onDecrease === "function" && product?.id != null) onDecrease(product.id);
  };
  const handlePlus = () => {
    if (typeof onIncrease === "function" && product?.id != null) onIncrease(product.id);
  };

  const isPopular = Boolean(product?.popular);
  const priceText = Number(product?.price ?? 0).toLocaleString();

  return (
    <Card currentMode={currentMode} productId={product?.id}>
      {tagLabel ? <PopularTag>{tagLabel}</PopularTag> : (isPopular && <PopularTag>인기</PopularTag>)}
      <ImageArea />
      <InfoArea>
        <Name>{product?.name}</Name>
        <Price>{priceText}원</Price>
        <QtyRow>
          <QtyButton aria-label="수량 감소" $type="minus" onClick={handleMinus} />
          <QtyValue aria-live="polite">{Number(qty ?? 0)}</QtyValue>
          <QtyButton aria-label="수량 증가" $type="plus" onClick={handlePlus} />
        </QtyRow>
      </InfoArea>
    </Card>
  );
}

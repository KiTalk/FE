// ./src/components/Product.styles.js
import styled from "styled-components";

export const ProductCard = styled.div`
  position: relative;
  width: 23.8125rem;
  height: 38.75rem;
  border: 1px solid #adadad;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
`;

export const PopularTag = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 93px;
  height: 61px;
  border-radius: 0 0 20px 0;
  background: #223770;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 28px;
`;

export const ImageArea = styled.div`
  width: 100%;
  height: 310px;
  background: #f2f6fb;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProductImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: contain;
`;

export const InfoArea = styled.div`
  position: relative;
  height: calc(100% - 310px);
  background: #ffffff;
  box-sizing: border-box;
  padding: 28px 24px 110px 24px; /* 하단 담기 버튼(90px) 피해서 여백 */
`;

/* ✅ 이름과 뱃지를 한 줄로 배치 */
export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const AddedOverlay = styled.div`
  position: absolute;
  top: -35px;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 1.7rem;
  text-align: center;
  padding: 8px 10px;
  border-radius: 8px;
  margin: 0 auto;
  max-width: 90%;
  transform: translateY(${p => p.$visible ? '0' : '-8px'});
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity .25s ease, transform .25s ease;
  pointer-events: none; /* 클릭 방해 안 하게 */
  z-index: 2;
`

export const ProductName = styled.div`
  color: #272727;
  font-family: Pretendard;
  font-size: 1.9rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.875rem;
  letter-spacing: -0.03rem;
`;

export const ProductPrice = styled.div`
  color: #223770;
  font-family: Pretendard;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.875rem;
  letter-spacing: -0.0375rem;
  margin-top: 0.75rem;
`;

export const QuantityRow = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
  gap: 16px;
  width: 318px;
  height: 36px;
  margin-top: 3rem;
`;

/* 공통 수량 버튼(Base) */
const QuantityButtonBase = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;
  border-radius: 50%;
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  user-select: none;
  transition: background-color 120ms ease, transform 80ms ease;
  will-change: transform;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 25px;
    height: 3px;
    background: #272727;
    transform: translate(-50%, -50%);
  }

  &:hover {
    background: rgba(34, 55, 112, 0.08);
  }

  &:active {
    background: rgba(34, 55, 112, 0.16);
    transform: scale(0.95);
  }

  &:hover::before,
  &:hover::after,
  &:active::before,
  &:active::after {
    background: #223770;
  }

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
  &::-moz-focus-inner {
    border: 0;
  }
`;

/* ✅ 추가: 공통 버튼을 이름 있는 export로 노출 */
export const QuantityButton = QuantityButtonBase;

/* - 버튼 */
export const QuantityButtonMinus = styled(QuantityButtonBase)`
  &::after {
    display: none;
  }
  &::before {
    background: #adadad;
  }
  &:hover::before,
  &:active::before {
    background: #223770;
  }
`;

/* + 버튼 */
export const QuantityButtonPlus = styled(QuantityButtonBase)`
  &::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
`;

export const QuantityValue = styled.div`
  color: #272727;
  text-align: center;
  font-family: Pretendard;
  font-size: 3rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.875rem;
  letter-spacing: -0.045rem;
`;

export const AddButton = styled.button`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 90px;
  border: none;
  background: #223770;
  color: #ffffff;
  font-weight: 600;
  font-size: 32px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  transition: background-color 120ms ease;

  &:hover {
    background: #223770;
    color: #ffffff;
  }

  &:active {
    background: #1b2d66;
    color: #ffffff;
    box-shadow: none;
  }

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
  &::-moz-focus-inner {
    border: 0;
  }

  /* 수량 0일 때 비활성 및 회색(#C0C0C0) */
  &:disabled {
    background: #c0c0c0;
    cursor: default;
  }
  &:disabled:hover,
  &:disabled:active {
    background: #c0c0c0;
  }
`;

/* =========================
   ✅ 추가 파트 (함수 선언식 + 뱃지)
   ========================= */

function tempBg(p) {
  return p.$temp === "cold" ? "#EFF6FF" : "#FEF2F2";
}
function tempFg(p) {
  return p.$temp === "cold" ? "#3191FF" : "#DA2525";
}
function tempBd(p) {
  return p.$temp === "cold" ? "#3191FF" : "#DA2525";
}

export const TempBadge = styled.span`
  --bg: ${tempBg};
  --fg: ${tempFg};
  --bd: ${tempBd};

  display: inline-flex;
  align-items: center;
  gap: 0;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.7;
  background: transparent;
  color: var(--fg);
  border: 2.5px solid var(--bd);
  white-space: nowrap;
  letter-spacing: -0.2px;

  &::before{
    content: none;
  }
`;

/* =========================
   ✅ 추가 파트 (스크롤 영역)
   ========================= */

export const ScrollArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding-bottom: 24px;
`;

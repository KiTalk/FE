import styled, { css } from "styled-components";

export const ProductCard = styled.div`
  position: relative;
  width: 25.5rem;
  height: 31.6875rem;
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
  height: 12.5rem;
  background: ${(props) =>
    props.$variant === "cold" ? "#F2F6FB" :
    props.$variant === "hot" ? "#DBD1C9" : "#f2f6fb"};
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
  height: calc(100% - 230px - 17%);
  background: #ffffff;
  box-sizing: border-box;
  /* Add bottom padding to prevent content from being overlapped by the absolute AddButton (90px) */
  padding: 28px 24px 24px 24px;
`;

export const AddedOverlay = styled.div`
  position: absolute;
  left: 24px;
  right: 24px;
  top: -70px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-weight: 500;
  font-size: 2rem;
  letter-spacing: -0.02rem;
  pointer-events: none;
  z-index: 2;

  /* 1개 이상일 때만 표시 */
  opacity: ${(p) => (p.$show ? 1 : 0)};
  transform: translateY(${(p) => (p.$show ? "0" : "-6px")});
  transition: opacity 180ms ease, transform 180ms ease;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 한 칸 이상의 간격 */
  width: 100%;
  /* justify-content: space-between;  ← 제거 */
`;

export const ProductName = styled.div`
  color: #272727;
  font-family: Pretendard;
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.875rem;
  letter-spacing: -0.03rem;
`;

/* ✅ 온도 배지: 매우 둥근 알약 형태 */
export const TemperatureBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.25rem 0.6rem; /* 컴팩트 패딩 */
  min-width: 6rem; /* 텍스트 길이 상관 없이 최소 너비 */
  height: 3rem; /* 균일한 높이 */
  border-radius: 8rem; /* 매우 뭉뚝한 원에 가까운 네모 */
  font-size: 1.4rem; /* 살짝 작은 텍스트 */
  font-weight: 500;
  line-height: 3;
  white-space: nowrap;

  /* 기본 톤 */
  color: #0b1b2b;
  background: #e7eef7;
  border: 3px solid #c8d6ea;

  ${(props) =>
    props.$variant === "cold" &&
    css`
      /* 시원한: 시원한 블루 톤 */
      color: #3191ff;
      background: transparent;
      border-color: #3191ff;
    `}

  ${(props) =>
    props.$variant === "hot" &&
    css`
      /* 뜨거운: 따뜻한 레드/오렌지 톤 */
      color: #da2525;
      background: transparent;
      border-color: #da2525;
    `}
`;

export const ProductPrice = styled.div`
  color: #223770;
  font-family: Pretendard;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 750;
  line-height: 1.875rem;
  letter-spacing: -0.0375rem;
  margin-top: 1rem;
`;

export const QuantityRow = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center; /* 세로 가운데 */
  justify-content: center; /* 가로 가운데 */
  gap: 16px;
  width: 318px;
  height: 36px;
  margin: 2rem auto 0; /* 가로 중앙 정렬 */
`;

export const QuantityButton = styled.button`
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
  display: flex;
  align-items: center;
  justify-content: center;

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

  ${(p) =>
    p.$type === "minus" &&
    css`
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
    `}

  ${(p) =>
    p.$type === "plus" &&
    css`
      &::after {
        transform: translate(-50%, -50%) rotate(90deg);
      }
    `}
`;

export const QuantityValue = styled.div`
  color: #272727;
  text-align: center;
  font-family: Pretendard;
  font-size: 3rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.875rem; /* 62.5% */
  letter-spacing: -0.045rem;
`;


export const AddButton = styled.button`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 17%;
  border: none;
  background: #223770;
  color: #ffffff;
  font-weight: 700;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
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

    /* 🔒 비활성(네이티브/ARIA) — 셀렉터 그룹은 반드시 {}로 닫아주세요 */
  &&:disabled,
  &&[aria-disabled="true"] {
    background: #d9d9d9;
    color: #8b8b8b;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* (선택) 커스텀 prop으로 강제 비활성 지원 */
  ${(p) =>
    p.$disabled &&
    css`
      && {
        background: #d9d9d9;
        color: #8b8b8b;
        cursor: not-allowed;
        pointer-events: none;
      }
    `}
`;
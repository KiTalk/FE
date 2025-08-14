import styled, { css } from "styled-components";

/* 전체 상품 카드 컨테이너 */
export const ProductCard = styled.div`
  position: relative;
  width: 25.5rem;
  height: 31.6875rem;
  border: 1px solid #adadad;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
`;

/* 인기 상품 태그 (왼쪽 상단 리본 형태) */
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

/* 상품 이미지 영역 (ice/hot에 따라 배경색 변경) */
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

/* 상품 이미지 (이미지 비율 유지, contain) */
export const ProductImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: contain;
`;

/* 상품 정보 영역 (이름, 가격, 수량 버튼 등) */
export const InfoArea = styled.div`
  position: relative;
  height: calc(100% - 230px - 17%);
  background: #ffffff;
  box-sizing: border-box;
  /* 하단 AddButton과 겹치지 않도록 패딩 */
  padding: 28px 24px 24px 24px;
`;

/* '몇 개 담김' 오버레이 */
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

  /* 표시 여부 (애니메이션 포함) */
  opacity: ${(p) => (p.$show ? 1 : 0)};
  transform: translateY(${(p) => (p.$show ? "0" : "-6px")});
  transition: opacity 180ms ease, transform 180ms ease;
`;

/* 상품명과 온도 배지를 가로로 배치하는 행 */
export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 간격 확보 */
  width: 100%;
`;

/* 상품명 스타일 */
export const ProductName = styled.div`
  color: #272727;
  font-family: Pretendard;
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.875rem;
  letter-spacing: -0.03rem;
`;

/* 온도 배지 (시원한/뜨거운) */
export const TemperatureBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.6rem;
  min-width: 6rem;
  height: 3rem;
  border-radius: 8rem; /* 알약 모양 */
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 3;
  white-space: nowrap;

  /* 기본 스타일 */
  color: #0b1b2b;
  background: #e7eef7;
  border: 3px solid #c8d6ea;

  /* 시원한 */
  ${(props) =>
    props.$variant === "cold" &&
    css`
      color: #3191ff;
      background: transparent;
      border-color: #3191ff;
    `}

  /* 뜨거운 */
  ${(props) =>
    props.$variant === "hot" &&
    css`
      color: #da2525;
      background: transparent;
      border-color: #da2525;
    `}
`;

/* 상품 가격 */
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

/* 수량 조절 버튼과 값 배치 */
export const QuantityRow = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 318px;
  height: 36px;
  margin: 2rem auto 0;
`;

/* 수량 버튼 */
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

  /* 아이콘 모양 (가로줄 + 세로줄) */
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

  /* 호버 효과 */
  &:hover {
    background: rgba(34, 55, 112, 0.08);
  }

  /* 클릭 시 효과 */
  &:active {
    background: rgba(34, 55, 112, 0.16);
    transform: scale(0.95);
  }

  /* 호버/클릭 시 아이콘 색 변경 */
  &:hover::before,
  &:hover::after,
  &:active::before,
  &:active::after {
    background: #223770;
  }

  /* 포커스 시 outline 제거 */
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
  &::-moz-focus-inner {
    border: 0;
  }

  /* - 버튼 스타일 */
  ${(p) =>
    p.$type === "minus" &&
    css`
      &::after {
        display: none; /* 세로줄 제거 */
      }
      &::before {
        background: #adadad;
      }
      &:hover::before,
      &:active::before {
        background: #223770;
      }
    `}

  /* + 버튼 스타일 */
  ${(p) =>
    p.$type === "plus" &&
    css`
      &::after {
        transform: translate(-50%, -50%) rotate(90deg);
      }
    `}
`;

/* 수량 표시 숫자 */
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

/* 담기 버튼 (하단 고정) */
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

  /* 호버/클릭 시 색상 변화 */
  &:hover {
    background: #223770;
    color: #ffffff;
  }
  &:active {
    background: #1b2d66;
    color: #ffffff;
    box-shadow: none;
  }

  /* 포커스 시 outline 제거 */
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
  &::-moz-focus-inner {
    border: 0;
  }

  /* 비활성 상태 */
  &&:disabled,
  &&[aria-disabled="true"] {
    background: #d9d9d9;
    color: #8b8b8b;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* 커스텀 prop으로 비활성 처리 */
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

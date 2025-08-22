import styled, { css } from "styled-components";

export const Card = styled.div`
  position: relative;
  width: 23.8125rem;
  height: 26.25rem;
  background: #ffffff;

  /* ✅ Product.styles.js와 동일 규칙: mode === "color"일 때만 색 테두리 */
  border: ${({ $currentMode, $productId }) => {
    if ($currentMode === "color") {
      const id = String($productId || "").toLowerCase();
      if (id.includes("americano")) return "7px solid #4D9E17"; // green
      if (id.includes("latte")) return "7px solid #9F1FDA"; // purple
      return "7px solid #adadad"; // color 모드지만 두 키워드 아님
    }
    // 기본 테두리
    return "1px solid #adadad";
  }};

  border-radius: 20px;
  overflow: hidden;
  flex: 0 0 auto;
`;

export const ImageArea = styled.div`
  width: 100%;
  height: 12.375rem;
  background: ${(props) =>
    props.$variant === "cold"
      ? "#F2F6FB"
      : props.$variant === "hot"
      ? "#DBD1C9"
      : "#f2f6fb"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProductImage = styled.img`
  width: 14.3125rem;
  height: 12.4375rem;
  object-fit: contain;
`;

export const PopularTag = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 5.8125rem;
  height: 3.8125rem;
  border-radius: 0 0 1.25rem 0;
  background: #223770;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.75rem;
`;

export const InfoArea = styled.div`
  position: relative;
  height: calc(26.25rem - 12.375rem);
  background: #ffffff;
`;

export const Name = styled.h3`
  position: absolute;
  left: 1.8125rem;
  top: 2.1875rem;
  margin: 0;
  color: #272727;
  font-weight: 600;
  font-size: 2rem;
  line-height: 1.875rem;
  letter-spacing: -0.015em;
`;

export const Price = styled.div`
  position: absolute;
  left: 1.8125rem;
  top: 4.5rem;
  color: #223770;
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1.875rem;
  letter-spacing: -0.015em;
`;

export const QtyRow = styled.div`
  position: absolute;
  left: 2rem;
  top: 8.5rem;
  width: 19.875rem;
  height: 2.25rem;
  display: grid;
  grid-template-columns: 2.25rem 1fr 2.25rem;
  align-items: center;
`;

export const QtyButton = styled.button`
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  position: relative;
  -webkit-tap-highlight-color: transparent;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 1.5625rem;
    height: 0.1875rem;
    background: #272727;
    transform: translate(-50%, -50%);
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
    `}

  ${(p) =>
    p.$type === "plus" &&
    css`
      &::after {
        transform: translate(-50%, -50%) rotate(90deg);
      }
    `}
`;

export const QtyValue = styled.div`
  text-align: center;
  color: #272727;
  font-weight: 500;
  font-size: 3rem;
  line-height: 1.875rem;
  letter-spacing: -0.015em;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0 1.8125rem;
  margin-top: 1.5rem;
`;

export const ProductName = styled.div`
  color: #272727;
  font-family: Pretendard;
  font-size: 1.8rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.875rem;
  letter-spacing: -0.03rem;
  white-space: nowrap;
`;

export const TemperatureBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.6rem;
  min-width: 6rem;
  height: 3rem;
  border-radius: 8rem;
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 3;
  white-space: nowrap;
  color: #0b1b2b;
  background: #e7eef7;
  border: 0.1875rem solid #c8d6ea;

  ${(props) =>
    props.$variant === "cold" &&
    css`
      color: #3191ff;
      background: transparent;
      border-color: #3191ff;
    `}

  ${(props) =>
    props.$variant === "hot" &&
    css`
      color: #da2525;
      background: transparent;
      border-color: #da2525;
    `}
`;

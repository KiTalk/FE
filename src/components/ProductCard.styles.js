import styled, { css } from "styled-components";

export const ProductCard = styled.div`
  position: relative;
  width: 23.8125rem;
  height: 31.6875rem;

  border: ${({ currentMode, productId }) => {
    if (currentMode === "color") {
      const id = String(productId || "").toLowerCase();
      if (id.includes("americano")) return "0.4375rem solid #4D9E17";
      if (id.includes("latte")) return "0.4375rem solid #9F1FDA";
      return "0.4375rem solid #adadad";
    }
    return "0.0625rem solid #adadad";
  }};

  border-radius: 1.25rem;
  box-sizing: border-box;
  overflow: hidden;
  background: #ffffff;
`;

export const PopularTag = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 5.8125rem;
  height: 3.8125rem;
  border-radius: 0 0 1.25rem 0;
  background: #223770;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 1.75rem;
`;

export const ImageArea = styled.div`
  width: 100%;
  height: 12.5rem;
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

export const InfoArea = styled.div`
  position: relative;
  height: calc(100% - 14.375rem - 17%);
  background: #ffffff;
  box-sizing: border-box;
  padding: 1.75rem 1.5rem 1.5rem 1.5rem;
`;

export const AddedOverlay = styled.div`
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  top: -4.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-weight: 500;
  font-size: 2rem;
  letter-spacing: -0.02rem;
  pointer-events: none;
  z-index: 2;
  opacity: ${(p) => (p.$show ? 1 : 0)};
  transform: translateY(${(p) => (p.$show ? "0" : "-0.375rem")});
  transition: opacity 180ms ease, transform 180ms ease;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
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

export const ProductPrice = styled.div`
  color: #223770;
  font-family: Pretendard;
  font-size: 2rem;
  font-style: normal;
  font-weight: 800;
  line-height: 1.875rem;
  letter-spacing: -0.0375rem;
  margin-top: 1rem;
`;

export const QuantityRow = styled.div`
  display: grid;
  grid-template-columns: 2.25rem 1fr 2.25rem;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 19.875rem;
  height: 2.25rem;
  margin: 2rem auto 0;
`;

export const QuantityButton = styled.button`
  width: 2.25rem;
  height: 2.25rem;
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
    width: 1.5625rem;
    height: 0.1875rem;
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
  line-height: 1.875rem;
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
  font-size: 2rem;
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
    background: #223770;
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

  &&:disabled,
  &&[aria-disabled="true"] {
    background: #c0c0c0;
    color: #ffffff;
    cursor: not-allowed;
    pointer-events: none;
  }

  ${(p) =>
    p.$disabled &&
    css`
      && {
        background: #c0c0c0;
        color: #ffffff;
        cursor: not-allowed;
        pointer-events: none;
      }
    `}
`;

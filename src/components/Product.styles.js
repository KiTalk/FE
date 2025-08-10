import styled, { css } from "styled-components";

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
  /* Add bottom padding to prevent content from being overlapped by the absolute AddButton (90px) */
  padding: 28px 24px 110px 24px;
`;

export const ProductName = styled.div`
  color: #272727;
  font-family: Pretendard;
  font-size: 2rem;
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
  margin-top: 1.31rem;
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
    background: #1b2d66; /* pressed */
    color: #ffffff;
    box-shadow: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: none;
  }

  &::-moz-focus-inner {
    border: 0;
  }
`;

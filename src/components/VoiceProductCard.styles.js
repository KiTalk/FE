import styled, { css } from "styled-components";

export const ItemCard = styled.div`
  position: absolute;
  left: 33.125rem;
  top: 21.125rem;
  width: 23.8125rem;
  height: 26.25rem;
  border-radius: 1.25rem;
  border: 0.0625rem solid #adadad;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0.1875rem 0.4375rem 0.625rem rgba(0, 0, 0, 0.25);
`;

export const OrderTypeTag = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 5.8125rem;
  height: 3.8125rem;
  border-radius: 0 0 1.25rem 0;
  background: #223770;
  color: #ffffff;
  font-weight: 600;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
  white-space: pre-line;
  line-height: 1.15;

  ${(p) =>
    p.$multiline &&
    css`
      width: 6.875rem;
      height: 5.625rem;
      font-size: 1.5rem;
      padding-top: 0.25rem;
    `}
`;

export const ImageArea = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 12.5rem;
  background: #f2f6fb;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const ProductImage = styled.img`
  width: 11.25rem;
  height: 11.25rem;
  object-fit: contain;
`;

export const InfoArea = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 12.5rem;
  bottom: 0;
  background: #ffffff;
  border-radius: 0 0 1.25rem 1.25rem;
`;

export const ProductName = styled.div`
  position: absolute;
  left: 1.8125rem;
  top: 2.1875rem;
  color: #272727;
  font-weight: 600;
  font-size: 2rem;
  line-height: 1.875rem;
  letter-spacing: -0.015em;
  white-space: nowrap;
`;

export const ProductPrice = styled.div`
  position: absolute;
  left: 1.8125rem;
  top: 5.375rem;
  color: #223770;
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1.875rem;
  letter-spacing: -0.015em;
`;

export const QuantityRow = styled.div`
  position: absolute;
  left: 2rem;
  top: 9.8125rem;
  width: 19.875rem;
  height: 2.25rem;
  display: grid;
  grid-template-columns: 2.25rem 1fr 2.25rem;
  align-items: center;
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

export const QuantityValue = styled.div`
  color: #272727;
  text-align: center;
  font-size: 3rem;
  font-weight: 500;
  line-height: 1.875rem;
  letter-spacing: -0.015em;
`;

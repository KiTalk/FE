import styled, { css } from "styled-components";

export const Card = styled.div`
  position: relative;
  width: 381px;
  height: 420px;
  background: #ffffff;
  border: 1px solid #adadad;
  border-radius: 20px;
  overflow: hidden;
  flex: 0 0 auto;
`;

export const ImageArea = styled.div`
  width: 100%;
  height: 198px; /* 47.62% of 420 */
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

export const PopularTag = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 93px;
  height: 61px;
  border-radius: 0 0 20px 0;
  background: #223770;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 28px;
`;

export const InfoArea = styled.div`
  position: relative;
  height: calc(420px - 198px);
  background: #ffffff;
`;

export const Name = styled.h3`
  position: absolute;
  left: 29px;
  top: 35px;
  margin: 0;
  color: #272727;
  font-weight: 600;
  font-size: 32px;
  line-height: 30px;
  letter-spacing: -0.015em;
`;

export const Price = styled.div`
  position: absolute;
  left: 29px;
  top: 86px;
  color: #223770;
  font-weight: 700;
  font-size: 40px;
  line-height: 30px;
  letter-spacing: -0.015em;
`;

export const QtyRow = styled.div`
  position: absolute;
  left: 32px;
  top: 157px;
  width: 318px;
  height: 36px;
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
`;

export const QtyButton = styled.button`
  width: 36px;
  height: 36px;
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
    width: 25px;
    height: 3px;
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
  font-size: 48px;
  line-height: 30px;
  letter-spacing: -0.015em;
`;

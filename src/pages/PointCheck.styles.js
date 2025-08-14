import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  width: 1440px;
  height: 1024px;
  margin: 0 auto;
  background: #f2f6fb;
  overflow: hidden;
`;

export const BottomAccentBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 14.3125rem;
  background: #223770;
  border-top-left-radius: 1.875rem;
  border-top-right-radius: 1.875rem;
  z-index: 0;
`;

export const Title = styled.h1`
  position: absolute;
  left: 23.31rem;
  top: 6rem;
  text-align: center;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 4rem;
  line-height: normal;
  letter-spacing: -0.06rem;
  color: #000000;
`;

export const CardGrid = styled.div`
  position: absolute;
  left: 50%;
  top: 18.125rem;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 32.125rem 32.125rem;
  gap: 2.75rem;
  z-index: 1;
`;

export const Card = styled.button`
  width: 32.125rem;
  height: 37.5rem;
  background: #ffffff;
  box-shadow: 0.1875rem 0.4375rem 0.625rem rgba(0, 0, 0, 0.25);
  border-radius: 1.875rem;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 0;

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: 0.25rem solid #223770;
    outline-offset: 0.25rem;
    border-radius: 1.875rem;
  }
`;

export const CardLabel = styled.div`
  position: absolute;
  bottom: 6.88rem;
  width: 100%;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-weight: 700;
  font-size: 4.375rem;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.06563rem;
  color: #272727;
`;

export const IconCenter = styled.div`
  position: absolute;
  width: 17.5rem;
  height: 17.5rem;
  top: 8.6rem;
  left: 10.14rem;
`;

export const CrossIcon = styled.div`
  position: relative;
  width: 17.5rem;
  height: 17.5rem;

  top: -3rem;
  left: -2.85rem;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 13.88875rem;
    height: 1.66688rem;
    background: #223770;
    border-radius: 1.875rem;
    transform-origin: center;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(135deg);
  }
`;

export const CircleIcon = styled.div`
  box-sizing: border-box;
  width: 11.62rem;
  height: 11.55rem;
  border: 1.25rem solid #d22a2a;
  border-radius: 50%;
`;

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
  left: 30.56rem;
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

export const IconWrap = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const IconImage = styled.img`
  object-fit: contain;
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

  /* First card (takeout) icon position and size */
  &:nth-child(1) ${IconWrap} {
    left: 10.02rem;
    top: 7.37rem;
  }

  &:nth-child(1) ${IconImage} {
    width: 219.7598px;
    height: 197.6741px;
  }

  /* Second card (dine-in) icon position and size */
  &:nth-child(2) ${IconWrap} {
    left: 9.75rem;
    top: 7.37rem;
  }

  &:nth-child(2) ${IconImage} {
    width: 225px;
    height: 198.0001px;
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

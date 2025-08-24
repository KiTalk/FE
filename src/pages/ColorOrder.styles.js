import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  width: 1440px;
  height: 1024px;
  margin: 0 auto;
  background: #ffffff;
  padding-bottom: 1rem;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
`;

export const PageViewport = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  &::-webkit-scrollbar-track {
    background: transparent !important;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent !important;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const ContentWrapper = styled.div``;

export const Hero = styled.div`
  position: relative;
  width: 90rem;
  height: 13.5rem;
  margin: 0 auto;
  background: #f2f6fb;
`;

export const HeroInner = styled.div`
  position: relative;
  width: 76.375rem;
  height: 100%;
  margin: 0 auto;
`;

export const HeroTitle = styled.h1`
  position: absolute;
  top: 5.75rem;
  left: 0;
  margin: 0;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-weight: 700;
  font-size: 3.5rem;
  line-height: 100%;
  letter-spacing: -0.015em;
  display: flex;
  align-items: center;
  color: #272727;
`;

export const CartWidget = styled.button`
  position: absolute;
  top: 3.75rem;
  left: 55.4375rem;
  width: 20.625rem;
  height: 6.875rem;
  background: #ffffff;
  box-shadow: 0.1875rem 0.4375rem 0.625rem rgba(0, 0, 0, 0.25);
  border-radius: 0.625rem;
`;

export const CartIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 1.875rem;
  transform: translateY(-50%);
  width: 3.5rem;
  height: 3.5rem;
  object-fit: contain;
`;

export const CartText = styled.div`
  color: #272727;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-size: 2.39888rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.036rem;
  white-space: nowrap;
`;

export const CartBadgeWrap = styled.div`
  position: absolute;
  top: 52%;
  right: 3.2rem;
  transform: translateY(-50%);
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CartBadge = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

export const CartBadgeCount = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transform: translate(
    var(--badge-count-offset-x, 0rem),
    var(--badge-count-offset-y, -0.125rem)
  );
`;

export const CartArrow = styled.img`
  position: absolute;
  top: 52%;
  right: 0.8rem;
  transform: translateY(-50%);
  width: 2.25rem;
  height: 2.25rem;
  object-fit: contain;
`;

export const CartTextWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
`;

export const Section = styled.section`
  position: relative;
  width: 76.25rem;
  margin: 2.5rem auto 2.5rem auto;
`;

export const SectionTitle = styled.h3`
  position: relative;
  margin: 0 0 1.875rem 0;
  padding-left: 2.125rem;
  font-size: 3rem;
  line-height: 3.5625rem;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #272727;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 0.625rem;
    height: 2.625rem;
    border-radius: 0.125rem;
    background: #223770;
  }
`;

export const ProductRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.375rem;
`;

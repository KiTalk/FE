import styled from "styled-components";
import checkIcon from "/src/assets/images/check2.png";

export const Page = styled.div`
  position: relative;
  width: 1440px;
  height: 1024px;
  margin: 0 auto;
  background: #ffffff;
  padding-bottom: 1rem;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  --page-scrollbar-right-inset: 5rem;
`;

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
  top: 3.69rem;
  left: 0;
  margin: 0;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 3rem;
  line-height: normal;
  letter-spacing: -0.045rem;
  display: flex;
  align-items: center;
  color: #272727;
`;

export const HeroSubtitle = styled.h2`
  position: absolute;
  top: 8rem;
  left: 0;
  margin: 0;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 2rem;
  line-height: normal;
  letter-spacing: -0.03em;
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
  position: relative;
`;

export const CartIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 1.88rem;
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
    var(--badge-count-offset-x, 0px),
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

export const CartRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Section = styled.section`
  position: relative;
  width: 76.25rem;
  margin: 2.5rem auto;
`;

export const SectionTitle = styled.h3`
  position: relative;
  margin: 0 0 1.87rem 0;
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
  grid-template-columns: repeat(2, 23.8125rem);
  gap: 4.375rem;
`;

export const SubSectionTitle = styled.h4`
  position: relative;
  margin: 0 0 1.37rem 0;
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

export const SubSectionContext = styled.h5`
  position: relative;
  margin: 0 0 2.87rem 2.27rem;
  font-size: 2rem;
  line-height: 2.375rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: #272727;
`;

export const HistoryNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin: 2.5rem 0 1.5rem 0;
`;

export const PaginationDots = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const PaginationDot = styled.div`
  width: ${(p) => (p.$active ? "1.4375rem" : "1.25rem")};
  height: ${(p) => (p.$active ? "1.4375rem" : "1.25rem")};
  border-radius: 50%;
  background: ${(p) => (p.$active ? "#FFBA59" : "#D9D9D9")};
`;

export const NavButtons = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2.59rem;
  gap: 2.5rem;
`;

export const HistoryNavIcon = styled.img`
  width: 6.25rem;
  height: 6.25rem;
  object-fit: contain;
  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
  filter: ${(p) => (p.$disabled ? "grayscale(1) opacity(0.5)" : "none")};
`;

export const HistoryDivider = styled.hr`
  margin: 1rem 0 1.5rem 0;
  border: none;
  border-top: 0.0625rem solid #e5e7eb;
`;

export const FavWrap = styled.div`
  width: 76.25rem;
  margin: 0 auto 3.75rem auto;
  position: relative;
  height: auto;
`;

export const FavViewport = styled.div`
  width: 76.25rem;
  height: auto;
  overflow: visible;
  padding: 0;
  box-sizing: border-box;
  scroll-snap-type: y proximity;
  scroll-padding-top: 0;
  overscroll-behavior: auto;
  -webkit-overflow-scrolling: auto;
`;

export const FavScrollArea = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 23.8125rem);
  column-gap: 2.38rem;
  row-gap: 3.3rem;
  justify-content: center;
  align-items: start;
  min-height: max-content;
  & > * {
    scroll-snap-align: start;
  }
`;

export const FavScrollbar = styled.div`
  width: 0.875rem;
  height: 100%;
  position: absolute;
  top: 0;
  right: -3.125rem;
`;

export const FavTrack = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  background: #e9f0f9;
`;

export const FavThumb = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 2.5rem;
  height: 4rem;
  border-radius: 0.75rem;
  background: #ffba59;
  pointer-events: auto;
`;

export const PastListWrap = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`;

export const DateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2.62rem;
  margin: 1.5rem 0 2rem 0;
`;

export const DateCheck = styled.input.attrs({ type: "checkbox" })`
  width: 5rem;
  height: 5rem;
  appearance: none;
  border: 0.125rem solid #c0c0c0;
  border-radius: 0.625rem;
  cursor: pointer;
  background: #ffffff;
  position: relative;

  &:checked {
    background: #223770;
    border-color: #223770;
  }

  &:checked::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url(${checkIcon});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

export const DateLabel = styled.div`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-style: normal;
  font-size: 3rem;
  font-weight: 600;
  line-height: normal;
  color: #272727;
  letter-spacing: -0.045rem;
  margin-top: -0.75rem;
  margin-left: -0.5rem;
`;

export const MenuList = styled.div`
  display: grid;
  grid-auto-rows: auto;
  row-gap: 1.25rem;
  margin: 0 0 2rem 2.125rem;
`;

export const MenuRow = styled.div`
  display: grid;
  grid-template-columns: 5rem 8.8125rem 1fr 12.8125rem 11.0625rem;
  align-items: center;
  column-gap: 1.5rem;
  padding: 0;
  margin-left: -2.125rem;
`;

export const MenuCheck = styled.input.attrs({ type: "checkbox" })`
  width: 5rem;
  height: 5rem;
  appearance: none;
  border: 0.125rem solid #c0c0c0;
  border-radius: 0.625rem;
  cursor: pointer;
  background: #ffffff;
  position: relative;

  &:checked {
    background: #223770;
    border-color: #223770;
  }

  &:checked::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url("/src/assets/images/check2.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

export const MenuImage = styled.div`
  width: 8.8125rem;
  height: 8.8125rem;
  background: #f2f6fb;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1.5rem;
`;

export const MenuName = styled.div`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-style: normal;
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1.875rem;
  color: #272727;
  letter-spacing: -0.0375rem;
  white-space: nowrap;
  margin-left: 1.81rem;
`;

export const Stepper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3.1875rem;
  width: 15.6875rem;
  height: 5rem;
  border: 0.125rem solid #c0c0c0;
  border-radius: 2.5rem;
  margin-left: -6.81rem;
`;

export const StepBtn = styled.button`
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  position: relative;
  margin: -0.25rem;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 1.5625rem;
    height: 0.1875rem;
    background: ${(p) => (p.disabled ? "#ADADAD" : "#272727")};
    transform: translate(-50%, -50%);
  }
  ${(p) =>
    p.$type === "plus" &&
    `
    &::after { transform: translate(-50%, -50%) rotate(90deg); }
  `}
`;

export const StepValue = styled.div`
  margin-top: -0.25rem;
  text-align: center;
  font-size: 3rem;
  font-style: normal;
  font-weight: 500;
  color: #272727;
  line-height: 1.875rem;
  letter-spacing: -0.045rem;
  min-width: 1.875rem;
`;

export const Price = styled.div`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-size: 3rem;
  font-style: normal;
  font-weight: 700;
  color: #223770;
  line-height: 1.875rem;
  letter-spacing: -0.045rem;
`;

export const FooterBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.875rem;
  margin-top: 6.15rem;
  width: 100%;
`;

export const GhostButton = styled.button`
  width: 37.25rem;
  height: 9.375rem;
  border-radius: 1.25rem;
  border: 0.25rem solid #223770;
  background: #fff;
  color: #223770;
  text-align: center;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-style: normal;
  font-size: 3rem;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.045rem;
`;

export const PrimaryButton = styled.button`
  width: 37.25rem;
  height: 9.375rem;
  border-radius: 1.25rem;
  border: none;
  background: #223770;
  color: #fff;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-style: normal;
  font-size: 3rem;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.045rem;
`;

export const ContentWrapper = styled.div``;

export const TabsContainer = styled.div``;

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
    display: none !important;
  }
  &::-webkit-scrollbar-track {
    display: none !important;
  }
  &::-webkit-scrollbar-thumb {
    display: none !important;
  }
  &::-webkit-scrollbar-corner {
    display: none !important;
  }
  scrollbar-width: none !important;
  scrollbar-color: transparent transparent !important;
  -ms-overflow-style: none !important;
`;

export const PageScrollbar = styled.div`
  width: 0.875rem;
  height: 50vh;
  position: fixed;
  top: 12.5rem;
  right: calc(
    max((100vw - 90rem) / 2, 0px) + var(--page-scrollbar-right-inset)
  );
  z-index: 1000;
`;

export const PageTrack = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  background: #e9f0f9;
`;

export const PageThumb = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 2.5rem;
  height: 4rem;
  border-radius: 0.75rem;
  background: #ffba59;
  pointer-events: auto;
  box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.15);
`;

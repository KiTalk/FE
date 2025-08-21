import styled, { css } from "styled-components";

export const Page = styled.div`
  position: relative;
  width: 1440px;
  height: 1024px;
  height: 100vh;
  margin: 0 auto;
  background: #ffffff;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  position: relative;
`;

export const CartPageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10rem;
`;

export const HeaderContainer = styled.header`
  position: relative;
  width: 100%;
  height: 13.375rem;
  background: #f2f6fb;
  border-bottom: 0.0625rem solid #e9f0f9;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 6.875rem;
  box-sizing: border-box;
`;

export const HeaderTitle = styled.h1`
  position: absolute;
  top: 3.6875rem;
  left: 6.9375rem;
  font-size: 3rem;
  font-style: normal;
  font-weight: 700;
  color: #272727;
  letter-spacing: -0.045em;
`;

export const HeaderSubtitle = styled.p`
  position: absolute;
  top: 8rem;
  left: 6.9375rem;
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.03rem;
  color: #272727;
`;

export const CancelButton = styled.button`
  position: absolute;
  left: 67.125rem;
  top: 3.1875rem;
  width: 15.9375rem;
  height: 6.875rem;
  border-radius: 1.25rem;
  box-shadow: 0.1875rem 0.4375rem 0.625rem rgba(0, 0, 0, 0.25);
  background: #ffffff;
  color: #272727;
  font-size: 2.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.036rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  white-space: nowrap;
  cursor: pointer;
`;

export const CancelIcon = styled.img`
  width: 3.6875rem;
  height: 3.6875rem;
  object-fit: contain;
`;

export const CardsViewport = styled.div`
  width: 76.375rem;
  margin: 0 auto 0.75rem auto;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 6.875rem 0;
  box-sizing: content-box;
  scroll-snap-type: x proximity;
  scroll-padding-left: 6.875rem;

  &::-webkit-scrollbar {
    height: 0;
    display: none;
  }
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
`;

export const CardsScrollArea = styled.div`
  display: inline-flex;
  align-items: center;
  margin-bottom: 10rem;
  gap: 2.5rem;
  min-width: max-content;
  & > * {
    scroll-snap-align: start;
  }
`;

export const CustomScrollbar = styled.div`
  width: 76.375rem;
  position: absolute;
  left: 7.1875rem;
  top: 45.5625rem;
  height: 0.875rem;
  z-index: 6;
`;

export const CustomTrack = styled.div`
  width: 100%;
  height: 0.875rem;
  border-radius: 0.75rem;
  background: #e9f0f9;
`;

export const CustomThumb = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 0.875rem;
  min-width: 5rem;
  width: 12.5rem;
  border-radius: 0.75rem;
  background: #ffba59;
  pointer-events: auto;
`;

export const CartItemCard = styled.div`
  position: relative;
  width: 21rem;
  height: 18rem;
  background: #ffffff;
  border: 0.0625rem solid #d9dfe8;
  border-radius: 1rem;
  overflow: hidden;
  flex: 0 0 auto;
`;

export const PopularTag = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 3.375rem;
  height: 2.125rem;
  border-radius: 0 0 0.75rem 0;
  background: #223770;
  color: #fff;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

export const ImageArea = styled.div`
  width: 100%;
  height: 4.5rem;
  background: #f2f6fb;
`;

export const ItemInfoArea = styled.div`
  padding: 0.875rem 1rem 1rem;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const ProductName = styled.h3`
  margin: 0;
  color: #272727;
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.02rem;
`;

export const TemperatureBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.625rem;
  height: 1.5rem;
  min-width: 3.5rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  color: #0b1b2b;
  background: #e7eef7;
  border: 0.125rem solid #c8d6ea;

  ${(p) =>
    p.$variant === "cold" &&
    css`
      color: #3191ff;
      background: transparent;
      border-color: #3191ff;
    `}
  ${(p) =>
    p.$variant === "hot" &&
    css`
      color: #da2525;
      background: transparent;
      border-color: #da2525;
    `}
`;

export const ProductPrice = styled.div`
  margin-top: 0.5rem;
  color: #223770;
  font-size: 1.375rem;
  font-weight: 800;
`;

export const QuantityRow = styled.div`
  display: grid;
  grid-template-columns: 2.25rem 1fr 2.25rem;
  align-items: center;
  gap: 1rem;
  width: 13.75rem;
  height: 2.25rem;
  margin-top: 1.125rem;
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

  &:hover {
    background: rgba(34, 55, 112, 0.08);
  }
  &:active {
    background: rgba(34, 55, 112, 0.16);
    transform: scale(0.95);
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 1.375rem;
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
  text-align: center;
  color: #272727;
  font-size: 1.25rem;
  font-weight: 700;
`;

export const FooterBar = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  background: #223770;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 14.3125rem;
  padding: 1.25rem 6.875rem;
  gap: 0.875rem;
  box-sizing: border-box;
  border-top-left-radius: 1.875rem;
  border-top-right-radius: 1.875rem;
`;

export const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const FooterMetaRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
`;

export const FooterDivider = styled.div`
  position: absolute;
  left: 17.25rem;
  top: 3.3125rem;
  width: 0.125rem;
  height: 2.625rem;
  background: #ffffff;
  opacity: 1;
`;

export const FooterMetaLabel = styled.span`
  position: absolute;
  left: 6.4375rem;
  top: 2.6rem;
  font-style: normal;
  font-weight: 400;
  font-size: 2.5rem;
  line-height: normal;
  letter-spacing: -0.0375rem;
`;

export const FooterMetaValue = styled.span`
  position: absolute;
  left: 18.8125rem;
  top: 2.6rem;
  text-align: right;
  font-style: normal;
  font-weight: 500;
  font-size: 2.5rem;
  line-height: normal;
  letter-spacing: -0.0375rem;
`;

export const FooterMeta = styled.div`
  opacity: 0.9;
  font-weight: 400;
  font-size: 2.5rem;
  letter-spacing: -0.015em;
`;

export const FooterTotal = styled.div`
  position: absolute;
  left: 6.65rem;
  top: 5.75rem;
  font-size: 4.375rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.1875rem;
`;

export const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const SecondaryButton = styled.button`
  position: absolute;
  left: 50.5rem;
  height: 6.25rem;
  width: 15.3125rem;
  padding: 0 1.25rem;
  border-radius: 1.25rem;
  border: none;
  background: #7889bc;
  color: #ffffff;
  font-weight: 500;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.0375em;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

export const PrimaryButton = styled.button`
  position: absolute;
  left: 68rem;
  height: 6.25rem;
  width: 15.625rem;
  padding: 0 1.375rem;
  border-radius: 1.25rem;
  border: none;
  background: #ffffff;
  color: #272727;
  font-weight: 600;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.0375em;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

export const CartProductCardContainer = styled.div`
  position: relative;
  flex: 0 0 auto;
`;

export const QuantityBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.5rem;
  border-radius: 999px;
  background: #223770;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

export const OptionsBar = styled.div`
  width: 76.375rem;
  margin: 1rem auto 0;
  display: flex;
  align-items: center;
  gap: 1.125rem;
`;

export const OptionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  background: #f6f8fc;
  border: 0.0625rem solid #e2e7f0;
  border-radius: 0.875rem;
  padding: 0.75rem 0.875rem;
`;

export const OptionLabel = styled.span`
  font-weight: 700;
  color: #223770;
`;

export const OptionButton = styled.button`
  height: 2.75rem;
  min-width: 5.625rem;
  padding: 0 0.875rem;
  border-radius: 0.625rem;
  border: 0.0625rem solid #cdd6e6;
  background: ${(p) => (p.$active ? "#223770" : "#ffffff")};
  color: ${(p) => (p.$active ? "#ffffff" : "#223770")};
  font-weight: 700;
  cursor: pointer;
`;

export const PlusIcon = styled.span`
  position: relative;
  display: inline-block;
  width: 2.25rem;
  height: 2.5rem;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 1.4rem;
    left: 1.6rem;
    width: 1.625rem;
    height: 0.1875rem;
    background: #ffffff;
    transform: translate(-50%, -50%);
  }
  &::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
`;

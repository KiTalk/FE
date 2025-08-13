import styled, { css } from "styled-components";


export const Page = styled.div.withConfig({ displayName: "Page" })` /* [UPDATED] displayName 적용 */
  position: relative;
  width: 1440px;
  min-height: 1024px;
  margin: 0 auto;
  background: #ffffff;
  padding-bottom: 1rem;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  position: relative; /* FooterBar absolute 기준점 */
`;

/* -------- Tokens -------- */
const color = {
  ink: "#272727",
  blue: "#223770",
  blueLight: "#E9F1FB",
  badgeCold: "#3191FF",
  badgeHot: "#DA2525",
  cardBorder: "#D9DFE8",
  cardBg: "#FFFFFF",
  headerBg: "#EFF4FA",
  footerBg: "#223770",
  progress: "#F3A240",
};

/* 고정 레이아웃 폭/높이 (1440 x 1024 기준) */
const PAGE_WIDTH = "1440px";
const PAGE_MIN_HEIGHT = "1024px";
const CONTENT_WIDTH = "1222px"; // TouchOrder 내부 컨테이너와 동일

export const CartPageContainer = styled.div.withConfig({ displayName: "CartPageContainer" })` /* [UPDATED] displayName */
  width: ${PAGE_WIDTH};
  min-height: ${PAGE_MIN_HEIGHT};
  margin: 0 auto;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 88px; /* 푸터 높이만큼 여백 */
`;

/* 헤더 */
export const HeaderContainer = styled.header.withConfig({ displayName: "HeaderContainer" })` /* [UPDATED] displayName */
  position: relative;
  width: 100%;
  height: 230px;
  background: ${color.headerBg};
  border-bottom: 1px solid ${color.blueLight};
  display: flex;
  justify-content: center;

  & > .__headerInner {
    width: ${CONTENT_WIDTH};
    padding: 20px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

export const HeaderTitle = styled.h1.withConfig({ displayName: "HeaderTitle" })` /* [UPDATED] displayName */
  margin: 2rem;
  font-size: 3.5rem;
  font-weight: 800;
  color: ${color.ink};
  letter-spacing: -0.32px;
`;

export const HeaderSubtitle = styled.p.withConfig({ displayName: "HeaderSubtitle" })` /* [UPDATED] displayName */
  margin: -1.5rem 0 0 20px;
  font-size: 2rem;
  color: #667085;
`;

export const HelpButton = styled.button.withConfig({ displayName: "HelpButton" })` /* [UPDATED] displayName */
  height: 120px;
  padding: 0 16px;
  border: none;
  border-radius: 14px;
  background: #ffffff;
  color: ${color.ink};
  font-size: 2.5rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.04), 0 8px 20px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  margin-top: 30px;
`;

/* 카드 리스트 */
export const CardsScrollArea = styled.div.withConfig({ displayName: "CardsScrollArea" })` /* [UPDATED] displayName */
  width: ${CONTENT_WIDTH};
  margin: 0 auto;
  display: flex;
  gap: 24px;
  padding: 20px 0 12px;
  overflow-x: auto;
  scroll-snap-type: x proximity;

  & > * { scroll-snap-align: start; }

  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-thumb { background: #d0d7e2; border-radius: 8px; }
`;

/* 카드 */
export const CartItemCard = styled.div.withConfig({ displayName: "CartItemCard" })` /* [UPDATED] displayName */
  position: relative;
  width: 336px;
  height: 288px;
  background: ${color.cardBg};
  border: 1px solid ${color.cardBorder};
  border-radius: 16px;
  overflow: hidden;
  flex: 0 0 auto;
`;

export const PopularTag = styled.div.withConfig({ displayName: "PopularTag" })` /* [UPDATED] displayName */
  position: absolute;
  left: 0;
  top: 0;
  width: 54px;
  height: 34px;
  border-radius: 0 0 12px 0;
  background: ${color.blue};
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

export const ImageArea = styled.div.withConfig({ displayName: "ImageArea" })` /* [UPDATED] displayName */
  width: 100%;
  height: 72px;
  background: #f2f6fb;
`;

export const ItemInfoArea = styled.div.withConfig({ displayName: "ItemInfoArea" })` /* [UPDATED] displayName */
  padding: 14px 16px 16px;
`;

export const NameRow = styled.div.withConfig({ displayName: "NameRow" })` /* [UPDATED] displayName */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ProductName = styled.h3.withConfig({ displayName: "ProductName" })` /* [UPDATED] displayName */
  margin: 0;
  color: ${color.ink};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.32px;
`;

export const TemperatureBadge = styled.span.withConfig({ displayName: "TemperatureBadge" })` /* [UPDATED] displayName */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 24px;
  min-width: 56px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  color: #0b1b2b;
  background: #e7eef7;
  border: 2px solid #c8d6ea;

  ${(p) => p.$variant === "cold" && css`
    color: ${color.badgeCold};
    background: transparent;
    border-color: ${color.badgeCold};
  `}
  ${(p) => p.$variant === "hot" && css`
    color: ${color.badgeHot};
    background: transparent;
    border-color: ${color.badgeHot};
  `}
`;

export const ProductPrice = styled.div.withConfig({ displayName: "ProductPrice" })` /* [UPDATED] displayName */
  margin-top: 8px;
  color: ${color.blue};
  font-size: 22px;
  font-weight: 800;
`;

export const QuantityRow = styled.div.withConfig({ displayName: "QuantityRow" })` /* [UPDATED] displayName */
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
  gap: 16px;
  width: 220px;
  height: 36px;
  margin-top: 18px;
`;

export const QuantityButton = styled.button.withConfig({ displayName: "QuantityButton" })` /* [UPDATED] displayName */
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

  &:hover { background: rgba(34, 55, 112, 0.08); }
  &:active { background: rgba(34, 55, 112, 0.16); transform: scale(0.95); }

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 22px;
    height: 3px;
    background: ${color.ink};
    transform: translate(-50%, -50%);
  }

  ${(p) => p.$type === "minus" && css` &::after { display: none; } `}
  ${(p) => p.$type === "plus"  && css` &::after { transform: translate(-50%, -50%) rotate(90deg); } `}
`;

export const QuantityValue = styled.div.withConfig({ displayName: "QuantityValue" })` /* [UPDATED] displayName */
  text-align: center;
  color: ${color.ink};
  font-size: 20px;
  font-weight: 700;
`;

/* 진행바 */
export const ProgressBarWrap = styled.div.withConfig({ displayName: "ProgressBarWrap" })` /* [UPDATED] displayName */
  position: relative;
  width: ${CONTENT_WIDTH};
  margin: 0 auto;
  padding: 12px 0 24px;
`;

export const ProgressTrack = styled.div.withConfig({ displayName: "ProgressTrack" })` /* [UPDATED] displayName */
  height: 6px;
  border-radius: 8px;
  background: ${color.blueLight};
`;

export const ProgressFill = styled.div.withConfig({ displayName: "ProgressFill" })` /* [UPDATED] displayName */
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  border-radius: 8px;
  background: ${color.progress};
  width: ${(p) => `${p.$percent ?? 0}%`};
  pointer-events: none;
`;

/* 푸터: Page 내부 하단 고정 */
export const FooterBar = styled.footer.withConfig({ displayName: "FooterBar" })` /* [UPDATED] displayName */
  position: absolute; /* [UPDATED] fixed → absolute (Page 내부 하단) */
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  background: ${color.footerBg};
  color: #fff;
  display: flex;
  justify-content: center;

  & > .__footerInner {
    width: ${CONTENT_WIDTH};
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
`;

export const FooterLeft = styled.div.withConfig({ displayName: "FooterLeft" })` /* [UPDATED] displayName */
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FooterMeta = styled.div.withConfig({ displayName: "FooterMeta" })` /* [UPDATED] displayName */
  opacity: 0.9;
  font-weight: 350;
  font-size: 48px;
  letter-spacing: -0.32px;
`;

export const FooterTotal = styled.div.withConfig({ displayName: "FooterTotal" })` /* [UPDATED] displayName */
  font-size: 80px;
  font-weight: 500;
  letter-spacing: -0.32px;
`;

export const FooterRight = styled.div.withConfig({ displayName: "FooterRight" })`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SecondaryButton = styled.button.withConfig({ displayName: "SecondaryButton" })`
  height: 150px;
  width: 220px;  /* ✅ 가로 길이 확대 */
  padding: 0 20px;
  border-radius: 12px;
  border: none;
  background: #a3b1d9;
  color: #ffffff;
  font-weight: 800;
  font-size: 2rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

export const PrimaryButton = styled.button.withConfig({ displayName: "PrimaryButton" })`
  height: 150px;     /* 높이 맞춤 */
  width: 260px;      /* 버튼 가로 고정 */
  padding: 0 22px;
  border-radius: 12px;
  border: none;
  background: #ffffff;
  color: #272727;
  font-weight: 900;
  font-size: 2rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 2px 0 rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.06);
`;

export const CartProductCardContainer = styled.div.withConfig({ displayName: "CartProductCardContainer" })`
  position: relative;
  flex: 0 0 auto;
`;

export const QuantityBadge = styled.div.withConfig({ displayName: "QuantityBadge" })`
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 999px;
  background: #223770;
  color: #ffffff;
  font-weight: 800;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

// 옵션 바 (포장/매장, 적립 여부)
export const OptionsBar = styled.div.withConfig({ displayName: "OptionsBar" })`
  width: 1222px;
  margin: 16px auto 0;
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const OptionGroup = styled.div.withConfig({ displayName: "OptionGroup" })`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #f6f8fc;
  border: 1px solid #e2e7f0;
  border-radius: 14px;
  padding: 12px 14px;
`;

export const OptionLabel = styled.span.withConfig({ displayName: "OptionLabel" })`
  font-weight: 700;
  color: #223770;
`;

export const OptionButton = styled.button.withConfig({ displayName: "OptionButton" })`
  height: 44px;
  min-width: 90px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #cdd6e6;
  background: ${(p)=> (p.$active ? "#223770" : "#ffffff")};
  color: ${(p)=> (p.$active ? "#ffffff" : "#223770")};
  font-weight: 700;
  cursor: pointer;
`;

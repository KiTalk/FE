import styled from "styled-components";
import checkIcon from "/src/assets/images/check2.png";

export const Page = styled.div`
  position: relative;
  width: 1440px;
  min-height: 1024px;
  margin: 0 auto;
  background: #ffffff;
  padding-bottom: 1rem;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  /* 커스텀 세로 스크롤바 오른쪽 간격만 CSS로 설정 */
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
  box-shadow: 3px 7px 10px rgba(0, 0, 0, 0.25);
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
  width: 36px;
  height: 36px;
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
    var(--badge-count-offset-y, -2px)
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
  gap: 12px;
`;

// Sections
export const Section = styled.section`
  position: relative;
  width: 1220px;
  margin: 40px auto 40px auto;
`;

export const SectionTitle = styled.h3`
  position: relative;
  margin: 0 0 1.87rem 0;
  padding-left: 34px;
  font-size: 48px;
  line-height: 57px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #272727;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 10px;
    height: 42px;
    border-radius: 2px;
    background: #223770;
  }
`;

export const ProductRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 381px);
  gap: 70px;
`;

/* ====== ★ 추가: 주문 내역 UI 전용 스타일 ====== */
export const SubSectionTitle = styled.h4`
  position: relative;
  margin: 0 0 1.37rem 0;
  padding-left: 34px;
  font-size: 48px;
  line-height: 57px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #272727;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 10px;
    height: 42px;
    border-radius: 2px;
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
  gap: 24px;
  margin: 40px 0 24px 0;
`;

export const PaginationDots = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PaginationDot = styled.div`
  width: ${(p) => (p.$active ? "23px" : "20px")};
  height: ${(p) => (p.$active ? "23px" : "20px")};
  border-radius: 50%;
  background: ${(p) => (p.$active ? "#FFBA59" : "#D9D9D9")};
`;

export const NavButtons = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2.59rem;
  gap: 40px;
`;

export const HistoryNavIcon = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
  filter: ${(p) => (p.$disabled ? "grayscale(1) opacity(0.5)" : "none")};
`;

export const HistoryDivider = styled.hr`
  margin: 16px 0 24px 0;
  border: none;
  border-top: 1px solid #e5e7eb;
`;

export const FavWrap = styled.div`
  width: 1220px;
  margin: 0 auto 3.75rem auto;
  position: relative;
  /* 세로 스크롤 영역 공통 변수 */
  --fav-viewport-h: 560px; /* 보이는 높이(이제 페이지 스크롤 사용으로 고정 높이 비활성) */
  --fav-gap: 2.38rem; /* 카드 간격 */
  --fav-scrollbar-offset: -12px; /* 스크롤바를 더 오른쪽으로 밀고 싶다면 음수 확대 */
  /* 페이지 전체 스크롤 사용: 내부 고정 높이 제거 */
  height: auto;
`;

/* ===== '자주 시킨 메뉴' 스크롤 전용 ===== */
export const FavViewport = styled.div`
  width: 1220px;
  /* 페이지 전체 스크롤 사용: 내부 스크롤 제거 */
  height: auto;
  overflow: visible;
  padding: 0; /* 내부 스크롤 제거로 패딩 제거 */
  box-sizing: border-box;
  scroll-snap-type: y proximity;
  scroll-padding-top: 0;
  /* 페이지 스크롤 전파 허용 */
  overscroll-behavior: auto;
  -webkit-overflow-scrolling: auto;
`;

export const FavScrollArea = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 381px); /* 카드 폭 고정 */
  column-gap: var(--fav-gap); /* 가로 간격 */
  row-gap: 3.3rem; /* 세로 간격 */
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
  right: -50px;
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
  height: 4rem; /* 초기값 (JS에서 업데이트) */
  border-radius: 0.75rem;
  background: #ffba59;
  pointer-events: auto;
`;

/* ===== 체크리스트 UI ===== */
export const PastListWrap = styled.div`
  width: 100%;
  margin-top: 8px;
`;

export const DateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2.62rem;
  margin: 24px 0 32px 0;
`;

export const DateCheck = styled.input.attrs({ type: "checkbox" })`
  width: 80px;
  height: 80px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 2px solid #c0c0c0;
  border-radius: 10px;
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
  margin: 0 0 32px 34px;
`;

export const MenuRow = styled.div`
  display: grid;
  grid-template-columns: 80px 141px 1fr 205px 177px;
  align-items: center;
  column-gap: 24px;
  padding: 0;
  margin-left: -34px;
`;

export const MenuCheck = styled.input.attrs({ type: "checkbox" })`
  width: 80px;
  height: 80px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 2px solid #c0c0c0;
  border-radius: 10px;
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
  width: 141px;
  height: 141px;
  background: #f2f6fb;
  border-radius: 20px;
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
  gap: 51px;
  width: 15.6875rem;
  height: 5rem;
  border: 2px solid #c0c0c0;
  border-radius: 40px;
  margin-left: -6.81rem;
`;

export const StepBtn = styled.button`
  width: 36px;
  height: 36px;
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
    width: 25px;
    height: 3px;
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
  min-width: 30px;
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
  gap: 30px;
  margin-top: 6.15rem;
  width: 100%;
`;

export const GhostButton = styled.button`
  width: 37.25rem;
  height: 9.375rem;
  border-radius: 20px;
  border: 4px solid #223770;
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
  border-radius: 20px;
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

/* ===== 일반 태그 스타일 컴포넌트 ===== */
export const ContentWrapper = styled.div``;

export const TabsContainer = styled.div``;

/* ===== 페이지 전체 커스텀 스크롤바 ===== */
export const PageViewport = styled.div`
  position: relative;
  width: 100%;
  height: 100vh; /* 전체 화면 높이에 맞춘 내부 뷰포트 */
  overflow-y: auto; /* 네이티브는 숨기고, 스크롤은 내부에서 */
  overflow-x: hidden;
  box-sizing: border-box;

  /* 네이티브 스크롤바 완전 숨김 */
  &::-webkit-scrollbar {
    width: 0px !important;
    height: 0px !important;
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
  top: 200px;
  right: calc(
    max((100vw - 1440px) / 2, 0px) + var(--page-scrollbar-right-inset)
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
  height: 4rem; /* 초기값 (JS에서 업데이트) */
  border-radius: 0.75rem;
  background: #ffba59;
  pointer-events: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

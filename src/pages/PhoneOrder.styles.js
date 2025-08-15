import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  width: 1440px;
  min-height: 1024px;
  margin: 0 auto;
  background: #ffffff;
  padding-bottom: 1rem;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
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
  top: 4.6rem;
  left: 0;
  margin: 0;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-weight: 700;
  font-size: 3.75rem;
  line-height: 100%;
  letter-spacing: -0.015em;
  display: flex;
  align-items: center;
  color: #272727;
`;

export const HeroSubtitle = styled.h2`
  position: absolute;
  top: 9.5rem;
  left: 0;
  margin: 0;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-weight: 400;
  font-size: 2rem;
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

export const SubSectionContext = styled.h5`
  position: relative;
  margin: 0 0 0;
  padding-left: 34px;
  font-size: 1.75rem;
  line-height: 57px;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: #272727;
`;

export const HistoryNav = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 10px 0 24px 34px; /* 섹션 타이틀 인덴트와 맞춤 */
`;

export const HistoryNavButton = styled.button`
  width: 90px;
  height: 90px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.3 : 1)};
`;

export const HistoryNavIcon = styled.img`
  width: 90px;
  height: 90px;
  object-fit: contain;
`;

export const HistoryDivider = styled.hr`
  margin: 16px 0 24px 0;
  border: none;
  border-top: 1px solid #e5e7eb;
`;

export const FavWrap = styled.div`
  width: 1220px;
  margin: 0 auto 12px auto;
  position: relative;
  /* 세로 스크롤 영역 공통 변수 */
  --fav-viewport-h: 560px;         /* 보이는 높이(원하면 640px/720px로) */
  --fav-gap: 1rem;                 /* 카드 간격: 0.5rem ~ 2.25rem 권장 */
  --fav-scrollbar-offset: -12px;   /* 스크롤바를 더 오른쪽으로 밀고 싶다면 음수 확대 */
  height: var(--fav-viewport-h);   /* 트랙 높이 = 뷰포트 높이로 정합 */
 `;

/* ===== '자주 시킨 메뉴' 스크롤 전용 ===== */
export const FavViewport = styled.div`
  width: 1220px;
  height: var(--fav-viewport-h);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 1rem 0 0;           /* 스크롤바 쪽 여백(1rem) */
  box-sizing: border-box;
  scroll-snap-type: y proximity;
  scroll-padding-top: 0;
  overscroll-behavior: contain;   /* 상/하단에서 페이지 스크롤 전파 방지 */
  -webkit-overflow-scrolling: touch; /* iOS 관성 스크롤 */

  /* 네이티브 스크롤바 숨김 */
  &::-webkit-scrollbar { width: 0; display: none; }
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
`;

export const FavScrollArea = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 381px); /* 카드 폭 고정 */
  column-gap: var(--fav-gap);              /* 가로 간격 */
  row-gap: var(--fav-gap);                 /* 세로 간격 */
  justify-content: center;                 /* 1220px 폭에서 가운데 정렬 */
  align-items: start;
  min-height: max-content;
  & > * { scroll-snap-align: start; }      /* 세로 스냅 유지(원하면 제거 가능) */
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
  height: 4rem;                  /* 초기값 (JS에서 업데이트) */
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
  display: grid;
  grid-template-columns: 40px 1fr 120px;
  align-items: center;
  gap: 12px;
  padding: 12px 34px;
  border-radius: 12px;
  background: #f7f8fb;
  margin: 6px 0 12px;
`;

export const DateCheck = styled.input.attrs({ type: "checkbox" })`
  width: 24px;
  height: 24px;
  accent-color: #223770;
`;

export const DateLabel = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #272727;
`;

export const MenuList = styled.div`
  display: grid;
  grid-auto-rows: 68px;
  row-gap: 10px;
  margin: 8px 0 16px;
`;

export const MenuRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 220px 140px;
  align-items: center;
  column-gap: 12px;
  padding: 10px 34px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

export const MenuCheck = styled.input.attrs({ type: "checkbox" })`
  width: 22px;
  height: 22px;
  accent-color: #223770;
`;

export const MenuName = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #272727;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Stepper = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const StepBtn = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 22px;
    height: 3px;
    background: #272727;
    transform: translate(-50%, -50%);
  }
  ${(p) =>
    p.$type === "plus" &&
    `
    &::after { transform: translate(-50%, -50%) rotate(90deg); }
  `}
`;

export const StepValue = styled.div`
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: #272727;
`;

export const Price = styled.div`
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-size: 2rem;
  font-weight: 700;
  color: #223770;
`;

export const FooterBar = styled.div`
  display: flex;              /* ← center 대신 flex 사용 */
  justify-content: center;    /* ← 중앙 정렬 */
  align-items: center;        /* 세로 가운데 정렬(선택) */
  gap: 10px;
  margin-top: 14px;
  width: 100%;                /* 컨테이너 전체 너비에서 중앙 정렬 */
`;

export const GhostButton = styled.button`
  min-width: 600px;
  height: 100px;
  border-radius: 12px;
  border: 4px solid #d1d5db;
  background: #fff;
  color: #223770;
  font-size: 2rem;
  font-weight: 700;
`;

export const PrimaryButton = styled.button`
  min-width: 600px;
  height: 100px;
  border-radius: 12px;
  border: none;
  background: #223770;
  color: #fff;
  font-size: 2rem;
  font-weight: 800;
`;

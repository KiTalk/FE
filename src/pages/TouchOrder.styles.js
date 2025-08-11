// ./src/pages/TouchOrder.styles.js
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

  /* ✅ 전체 가로 스크롤 제거 */
  overflow-x: hidden;
`;

export const Hero = styled.div`
  position: relative;
  width: 90rem;
  height: 13.375rem;
  margin: 0 auto;
  background: #f2f6fb;
`;

export const HeroInner = styled.div`
  position: relative;
  width: 76.375rem;
  height: 100%;
  margin: 0 auto;
`;

export const HeroTitle = styled.h2`
  position: absolute;
  top: 4.4375rem;
  left: 0;
  margin: 0;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-weight: 700;
  font-size: 4.5rem;
  line-height: 100%;
  letter-spacing: -0.015em;
  display: flex;
  align-items: center;
  color: #272727;
`;

export const HeroSubtitle = styled.p`
  position: absolute;
  top: 8.75rem;
  left: 0;
  width: 839px;
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
  top: 4.375rem;
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
  width: 3rem;
  height: 3rem;
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
  transform: translate(var(--badge-count-offset-x, 0px), var(--badge-count-offset-y, -2px));
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

/* Sections */
export const Section = styled.section`
  position: relative;
  width: 1220px;
  margin: 60px auto 40px auto;
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
  /* ✅ 항상 3열: 각 칼럼은 가용 영역을 균등 분할 */
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 38px;

  /* ✅ 혹시 모를 가로 오버플로 방지 */
  overflow: visible;
`;

/* =========================
   ✅ 리스트 전용 세로 스크롤 영역
   ========================= */
export const ScrollArea = styled.div`
  width: 100%;
  /* 히어로 높이 + (대략적인) 탭 영역 높이만큼 뺀 높이 */
  max-height: calc(100dvh - 13.375rem - 6rem);

  /* ✅ 세로만 스크롤, 가로는 숨김 */
  overflow-y: auto;
  overflow-x: hidden;

  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding-bottom: 24px;

  /* ✅ 커스텀 스크롤바 (크롬/엣지/사파리) - 화살표 버튼 제거 */
  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-track {
    background: #e5e7eb;
    border-radius: 999px;
  }
  &::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 999px;
    border: 3px solid #e5e7eb;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }

  /* 파이어폭스 */
  scrollbar-width: thin;
  scrollbar-color: #9ca3af #e5e7eb;
`;

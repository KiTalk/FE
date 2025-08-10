import styled from "styled-components";

// 대기화면 1440x1024 해상도 전용 스타일드 컴포넌트

// 메인 컨테이너 (대기화면)
export const WaitingScreenContainer = styled.div`
  position: relative;
  width: 1440px;
  height: 1024px;
  background: #f2f6fb;
  margin: 0 auto;
  overflow: hidden;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;

  /* 전체화면 중앙 정렬 */
  @media (min-width: 1441px) {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }

  /* 작은 화면에서의 대응 */
  @media (max-width: 1439px) {
    width: 100vw;
    height: 100vh;
    min-height: 600px;
  }
`;

// 로고 영역
export const LogoContainer = styled.div`
  position: absolute;
  top: 3.5rem;
  left: 4rem;
  width: 11.875rem;
  height: 2.5007rem;

  /* 반응형 대응 */
  @media (max-width: 1439px) {
    top: 2rem;
    left: 2rem;
    width: 9rem;
    height: 1.9rem;
  }

  @media (max-width: 768px) {
    top: 1.5rem;
    left: 1.5rem;
    width: 7rem;
    height: 1.5rem;
  }
`;

export const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

// 부제목 텍스트
export const SubtitleText = styled.div`
  position: absolute;
  width: 43.6875rem;
  height: 5.8125rem;
  top: 20.75rem;
  left: calc(50% - 46.6875rem / 2);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 4rem;
  line-height: 145%;
  display: flex;
  align-items: center;
  letter-spacing: -1.5%;
  white-space: nowrap;

  color: #272727;

  /* 작은 화면 대응 */
  @media (max-width: 1439px) {
    font-size: 3rem;
    width: 80%;
    left: 10%;
    top: 15rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    width: 90%;
    left: 5%;
    top: 12rem;
  }
`;

// 제목 그룹
export const TitleGroup = styled.div`
  position: absolute;
  width: 52rem;
  top: 26.375rem;
  left: calc(50% - 52rem / 2);

  display: flex;
  align-items: center;
  gap: 1.25rem;
  white-space: nowrap;

  /* 작은 화면 대응 */
  @media (max-width: 1439px) {
    flex-direction: column;
    gap: 0.625rem;
    left: 10%;
    top: 20rem;
  }

  @media (max-width: 768px) {
    top: 16rem;
    left: 5%;
  }
`;

// 제목 파란색 부분
export const TitleBlue = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 6.25rem;
  line-height: 145%;
  display: flex;
  align-items: center;
  letter-spacing: -2%;
  white-space: nowrap;

  color: #224094;

  /* 작은 화면 대응 */
  @media (max-width: 1439px) {
    font-size: 4.5rem;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

// 제목 검은색 부분
export const TitleBlack = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 6.25rem;
  line-height: 145%;
  display: flex;
  align-items: center;
  letter-spacing: -1.5%;
  white-space: nowrap;

  color: #272727;

  /* 작은 화면 대응 */
  @media (max-width: 1439px) {
    font-size: 4.5rem;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

// 주문하기 버튼 컨테이너
export const OrderButton = styled.button`
  position: absolute;
  width: 55rem;
  height: 9.375rem;
  left: calc(50% - 53.5rem / 2);
  top: 41.625rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #223770;
  border-radius: 30px;

  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(34, 55, 112, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  /* 작은 화면 대응 */
  @media (max-width: 1439px) {
    width: 80%;
    left: 10%;
    height: 120px;
  }

  @media (max-width: 768px) {
    width: 90%;
    left: 5%;
    height: 100px;
  }
`;

// 주문하기 버튼 텍스트
export const OrderButtonText = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 3rem;
  line-height: 100%;
  letter-spacing: 0%;

  color: #ffffff;

  /* 작은 화면 대응 */
  @media (max-width: 1439px) {
    font-size: 2.25rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

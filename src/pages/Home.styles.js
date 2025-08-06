import styled from "styled-components";

// Home 페이지 1440x1024 해상도 최적화 스타일드 컴포넌트

export const HomeContainer = styled.div`
  /* App 전체 컨테이너 스타일 (기존 App.css에서 이동) */
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f9fa;

  /* 메인 컨텐츠 영역 스타일 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 3rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;

  /* 1440x1024 해상도 전용 스타일 */
  @media (width: 1440px) and (height: 1024px) {
    padding: 4rem 5rem;
    max-width: 1200px;
  }

  /* 1440x1024 이상의 해상도에서 */
  @media (min-width: 1440px) and (min-height: 1024px) {
    padding: 4rem 6rem;
    max-width: 1300px;
  }

  /* 작은 화면에서의 대응 */
  @media (max-width: 1439px) or (max-height: 1023px) {
    padding: 2rem 3rem;
    max-width: 1000px;
  }
`;

export const HomeTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  /* 1440x1024 해상도 전용 스타일 */
  @media (width: 1440px) and (height: 1024px) {
    font-size: 5rem;
    margin-bottom: 2.5rem;
  }

  /* 1440x1024보다 큰 해상도 */
  @media (min-width: 1440px) and (min-height: 1024px) {
    font-size: 6rem;
  }

  /* 작은 화면 대응 */
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const HomeDescription = styled.p`
  font-size: 1.5rem;
  color: #666;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 3rem auto;

  /* 1440x1024 해상도 전용 스타일 */
  @media (width: 1440px) and (height: 1024px) {
    font-size: 1.75rem;
    max-width: 900px;
  }

  /* 1440x1024보다 큰 해상도 */
  @media (min-width: 1440px) and (min-height: 1024px) {
    font-size: 2rem;
    max-width: 1000px;
  }

  /* 작은 화면 대응 */
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const HomeFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
  margin-top: 3rem;

  /* 1440x1024 해상도 전용 스타일 */
  @media (width: 1440px) and (height: 1024px) {
    max-width: 1200px;
    gap: 2.5rem;
  }

  /* 1440x1024보다 큰 해상도 */
  @media (min-width: 1440px) and (min-height: 1024px) {
    max-width: 1300px;
    gap: 3rem;
  }

  /* 작은 화면 대응 */
  @media (max-width: 1439px) or (max-height: 1023px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
`;

export const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  /* 1440x1024 해상도 전용 스타일 */
  @media (width: 1440px) and (height: 1024px) {
    padding: 2.5rem;
  }
`;

export const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

export const FeatureText = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
`;

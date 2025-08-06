import React from "react";
import {
  HomeContainer,
  HomeTitle,
  HomeDescription,
  HomeFeatures,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureText,
} from "./Home.styles";

const Home = () => {
  return (
    <HomeContainer>
      <HomeTitle>KiTalk</HomeTitle>
      <HomeDescription>
        차세대 커뮤니케이션 플랫폼으로 더 나은 소통의 경험을 제공합니다.
        <br />
        1440 x 1024 해상도에 최적화된 사용자 친화적인 인터페이스를 만나보세요.
      </HomeDescription>

      <HomeFeatures>
        <FeatureCard>
          <FeatureIcon>💬</FeatureIcon>
          <FeatureTitle>실시간 채팅</FeatureTitle>
          <FeatureText>
            빠르고 안정적인 실시간 메시징으로 언제 어디서나 소통하세요.
          </FeatureText>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🎨</FeatureIcon>
          <FeatureTitle>모던 UI/UX</FeatureTitle>
          <FeatureText>
            1440x1024 해상도에 최적화된 직관적이고 아름다운 사용자 인터페이스.
          </FeatureText>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>⚡</FeatureIcon>
          <FeatureTitle>고성능</FeatureTitle>
          <FeatureText>
            React와 최신 웹 기술을 활용한 빠르고 반응성 있는 애플리케이션.
          </FeatureText>
        </FeatureCard>
      </HomeFeatures>
    </HomeContainer>
  );
};

export default Home;

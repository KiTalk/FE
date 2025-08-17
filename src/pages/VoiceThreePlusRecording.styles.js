import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  width: 1440px;
  height: 1024px;
  margin: 0 auto;
  background: #f2f6fb;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
`;

export const GuideSection = styled.div`
  position: absolute;
  width: 905px;
  height: 202px;
  left: 130px;
  top: 263px;
`;

export const ProfileIcon = styled.img`
  position: absolute;
  width: 97px;
  height: 97px;
  left: 0;
  top: 0;
  background: #ffffff;
  border-radius: 50%;
  object-fit: cover;
`;

export const MessageBubble = styled.div`
  position: absolute;
  width: 768px;
  height: 202px;
  left: 7.7225rem;
  top: 0;
  background: #ffffff;
  border: 0.125rem solid #dcdcdc;
  border-radius: 0rem 1.875rem 1.875rem 1.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const MainTitle = styled.h1`
  position: absolute;
  width: 35.1875rem;
  height: 3.75rem;
  top: 2.5rem;
  left: 4rem;
  text-align: center;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 3rem;
  line-height: 3.75rem;
  letter-spacing: -0.045em;
  color: #272727;
  white-space: nowrap;
`;

export const ExampleText = styled.p`
  position: absolute;
  width: 39.625rem;
  height: 3rem;
  top: 7.12rem;
  left: 4rem;
  text-align: center;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 2.25rem;
  line-height: 3rem;
  letter-spacing: -0.03375rem;
  color: #878787;
  white-space: nowrap;
`;

export const SpeakButton = styled.button`
  position: absolute;
  width: 704px;
  height: 150px;
  left: 39.125rem;
  top: 31.5625rem;
  background: linear-gradient(360deg, #223770 0%, #375ab9 100%);
  border-radius: 1.875rem 1.875rem 0rem 1.875rem;
  border: none;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
  }
`;

export const SpeakButtonContent = styled.div`
  gap: 18px;
`;

export const MicIcon = styled.img`
  position: absolute;
  top: 2.5rem;
  left: 9.5rem;
  width: 70px;
  height: 70px;
`;

export const SpeakButtonText = styled.span`
  position: absolute;
  top: 3.125rem;
  left: 15rem;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 3rem;
  line-height: 3rem;
  color: #ffffff;
  letter-spacing: -0.015em;
  white-space: nowrap;
`;

export const FingerGuide = styled.div`
  position: absolute;
  left: 70.62rem;
  top: 32.56rem;
`;

export const FingerImage = styled.img`
  width: 12.5rem;
  height: 12.5rem;
  object-fit: contain;
`;

// 인식된 텍스트가 표시될 때의 음성 인식 영역 (음성 인식 완료 후)
export const RecognizedVoiceArea = styled.div`
  position: absolute;
  width: 747px;
  height: 150px;
  left: 583px;
  top: 505px;
  background: #ffffff;
  border: 2px solid #223770;
  border-radius: 30px 30px 0px 30px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RecognizedTextContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RecognizedText = styled.div`
  width: 646px;
  height: 48px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 48px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.015em;
  color: #223770;
  justify-content: center;
`;

// 음성 인식 영역 (녹음 중일 때 표시)
export const VoiceRecognitionArea = styled.div`
  position: absolute;
  width: 747px;
  height: 150px;
  left: 583px;
  top: 505px;
  background: #ffffff;
  border: 2px solid #223770;
  border-radius: 30px 30px 0px 30px;
  box-sizing: border-box;
`;

// 오디오 스펙트럼 컨테이너
export const AudioSpectrumContainer = styled.div`
  position: absolute;
  width: 283px;
  height: 98.31px;
  left: 240px;
  top: 26px;
`;

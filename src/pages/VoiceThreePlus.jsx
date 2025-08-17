import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  GuideSection,
  ProfileIcon,
  MessageBubble,
  MainTitle,
  ExampleText,
  SpeakButton,
  SpeakButtonContent,
  MicIcon,
  SpeakButtonText,
  FingerGuide,
  FingerImage,
} from "./VoiceThreePlus.styles";
import BackButton from "../components/BackButton";
import mikeIcon from "../assets/images/mike-solid.png";
import hand from "../assets/images/hand.png";
import profile from "../assets/images/profile.png";

function VoiceThreePlus() {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  function handleStartVoice() {
    // TODO: 음성 인식 시작 로직
  }

  return (
    <Page>
      {/* 뒤로가기 버튼 */}
      <BackButton onClick={handleBack} />

      {/* 안내 섹션 */}
      <GuideSection>
        <ProfileIcon src={profile} alt="프로필" />

        <MessageBubble>
          <MainTitle>주문하실 메뉴를 말씀해 주세요</MainTitle>
          <ExampleText>
            예시) 아이스 아메리카노 2잔, 핫 카페라떼 3잔
          </ExampleText>
        </MessageBubble>
      </GuideSection>

      {/* 눌러서 말하기 버튼 */}
      <SpeakButton onClick={handleStartVoice}>
        <SpeakButtonContent>
          <MicIcon src={mikeIcon} alt="마이크" />
          <SpeakButtonText>눌러서 말하기</SpeakButtonText>
        </SpeakButtonContent>
      </SpeakButton>

      {/* 손가락 가이드 */}
      <FingerGuide>
        <FingerImage src={hand} alt="손가락 가이드" />
      </FingerGuide>
    </Page>
  );
}

export default VoiceThreePlus;

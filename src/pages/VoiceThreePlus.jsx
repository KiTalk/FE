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

export default function VoiceThreePlus() {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  function handleStartVoice() {
    navigate("/order/voice/3up/recording");
  }

  return (
    <Page>
      <BackButton onClick={handleBack} />

      <GuideSection>
        <ProfileIcon src={profile} alt="프로필" />

        <MessageBubble>
          <MainTitle>주문하실 메뉴를 말씀해 주세요</MainTitle>
          <ExampleText>예시) 아이스 아메리카노 2잔, 유자차 3잔</ExampleText>
        </MessageBubble>
      </GuideSection>

      <SpeakButton onClick={handleStartVoice}>
        <SpeakButtonContent>
          <MicIcon src={mikeIcon} alt="마이크" />
          <SpeakButtonText>눌러서 말하기</SpeakButtonText>
        </SpeakButtonContent>
      </SpeakButton>

      <FingerGuide>
        <FingerImage src={hand} alt="손가락 가이드" />
      </FingerGuide>
    </Page>
  );
}

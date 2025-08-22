import React from "react";
import { useNavigate } from "react-router-dom";
import warningIcon from "../assets/images/warning.png";
import micIcon from "../assets/images/mike-solid.png";
import handIcon from "../assets/images/hand.png";
import {
  Page,
  MainContent,
  WarningImage,
  MainMessage,
  SubMessage,
  RetryButton,
  RetryButtonContent,
  MicIcon,
  RetryButtonText,
  FingerGuide,
} from "./VoiceError.styles";

export default function VoiceError() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/order-method");
  };

  return (
    <Page>
      <WarningImage src={warningIcon} alt="경고" />

      <MainContent>
        <MainMessage>음성을 인식하지 못했습니다</MainMessage>
        <SubMessage>아래 버튼을 누르고 다시 말씀해주세요</SubMessage>
      </MainContent>

      <RetryButton onClick={handleRetry}>
        <MicIcon src={micIcon} alt="" aria-hidden="true" />
        <RetryButtonText>다시 말하기</RetryButtonText>
      </RetryButton>

      <FingerGuide src={handIcon} />
    </Page>
  );
}

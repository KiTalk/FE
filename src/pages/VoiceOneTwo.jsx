import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import micImg from "../assets/images/mike.png";
import fingerImg from "../assets/images/hand.png";
import {
  Page,
  Title,
  Example,
  MicButton,
  MicIcon,
  FingerGuide,
} from "./VoiceOneTwo.styles";

function VoiceOneTwo() {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  function handleMic() {
    // 음성 인식 플로우 시작 예정 (후속 작업)
  }

  return (
    <Page>
      <MicButton onClick={handleMic} aria-label="음성 주문 버튼" />
      <MicIcon src={micImg} alt="마이크 아이콘" />
      <FingerGuide src={fingerImg} alt="손가락 가이드" />

      <Title>
        위 버튼을 누른 후 <br />
        주문할 메뉴를 말씀해주세요
      </Title>
      <Example>“아이스 아메리카노 1잔 포장”</Example>
      <Example wide top="54.625rem">
        “아이스 아메리카노 1잔, 따뜻한 카페라떼 1잔 포장”
      </Example>

      <BackButton onClick={handleBack} />
    </Page>
  );
}

export default VoiceOneTwo;

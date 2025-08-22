import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  BottomBar,
  Title,
  CardLeft,
  CardRight,
  CardTitle,
  CardExample,
  CardImage,
} from "./VoiceOrder.styles";
import BackButton from "../components/BackButton";
import { orderService, apiClient } from "../services/api";
import { goToVoiceError } from "../utils/voiceErrorUtils";
import drink1 from "../assets/images/drink1.png";
import drink3 from "../assets/images/drink3.png";

export default function VoiceOrder() {
  const navigate = useNavigate();
  const [isCreatingSession, setIsCreatingSession] = useState(false); // eslint-disable-line no-unused-vars

  // 세션 생성은 각 카드 클릭 시에 수행

  function handleBack() {
    navigate(-1);
  }

  async function handleOneTwo() {
    try {
      console.log("🚀 한번에 주문 세션 생성 시작");
      const response = await apiClient.post("/order-at-once/start");
      const sessionId = response.data?.session_id || "";

      if (sessionId) {
        sessionStorage.setItem("currentSessionId", sessionId);
        console.log("✅ 한번에 주문 세션 생성 완료:", sessionId);
        navigate("/order/voice/one-two");
      } else {
        console.error("❌ 세션 ID를 받지 못했습니다:", response.data);
        navigate("/voice-error");
      }
    } catch (error) {
      console.error("❌ 한번에 주문 세션 생성 실패:", error);
      goToVoiceError(navigate, { cause: error });
    }
  }

  async function handleThreePlus() {
    try {
      console.log("🚀 음성 주문 세션 생성 시작");
      setIsCreatingSession(true);
      const sessionData = await orderService.startSession();
      const sessionId = sessionData?.session_id || "";

      if (sessionId) {
        sessionStorage.setItem("currentSessionId", sessionId);
        console.log("✅ 음성 주문 세션 생성 완료:", sessionId);
        navigate("/order/voice/three-plus");
      } else {
        console.error("❌ 세션 ID를 받지 못했습니다:", sessionData);
        navigate("/voice-error");
      }
    } catch (error) {
      console.error("❌ 음성 주문 세션 생성 실패:", error);
      goToVoiceError(navigate, { cause: error });
    } finally {
      setIsCreatingSession(false);
    }
  }

  return (
    <Page>
      <BackButton onClick={handleBack} />

      <Title>주문할 음료 종류가 많으신가요?</Title>

      <CardLeft onClick={handleOneTwo}>
        <CardImage src={drink1} alt="1~2개 예시" />
        <CardTitle>1~2개</CardTitle>
        <CardExample>Ex) 아메리카노, 라떼</CardExample>
      </CardLeft>

      <CardRight onClick={handleThreePlus}>
        <CardImage src={drink3} alt="3개 이상 예시" />
        <CardTitle>3개 이상</CardTitle>
        <CardExample>Ex) 아메리카노, 라떼, 아이스티</CardExample>
      </CardRight>

      <BottomBar />
    </Page>
  );
}

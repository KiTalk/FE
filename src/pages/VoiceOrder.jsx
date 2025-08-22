import React, { useEffect, useState } from "react";
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
import { orderService } from "../services/api";
import drink1 from "../assets/images/drink1.png";
import drink3 from "../assets/images/drink3.png";

export default function VoiceOrder() {
  const navigate = useNavigate();
  const [isCreatingSession, setIsCreatingSession] = useState(false); // eslint-disable-line no-unused-vars

  // 컴포넌트 마운트 시 세션 생성
  useEffect(() => {
    async function createSession() {
      try {
        setIsCreatingSession(true);
        const sessionData = await orderService.startSession();
        const sessionId = sessionData?.session_id || "";

        if (sessionId) {
          sessionStorage.setItem("currentSessionId", sessionId);
          console.log("✅ 음성 주문 세션 생성 완료:", sessionId);
        } else {
          console.warn("⚠️ 세션 ID가 없습니다:", sessionData);
        }
      } catch (error) {
        console.error("❌ 세션 생성 실패:", error);
      } finally {
        setIsCreatingSession(false);
      }
    }

    createSession();
  }, []);

  function handleBack() {
    navigate(-1);
  }

  function handleOneTwo() {
    navigate("/order/voice/one-two");
  }

  function handleThreePlus() {
    navigate("/order/voice/three-plus");
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

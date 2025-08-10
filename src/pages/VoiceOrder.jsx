import React from "react";
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
import drink1 from "../assets/images/drink1.png";
import drink3 from "../assets/images/drink3.png";

function VoiceOrder() {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  function handleOneTwo() {
    navigate("/order/voice/one-two");
  }

  function handleThreePlus() {
    // TODO: route to 3+ items voice flow
  }

  return (
    <Page>
      <Title>주문할 음료 종류가 많으신가요?</Title>

      {/* 좌측 카드: 1~2개 */}
      <CardLeft onClick={handleOneTwo}>
        <CardImage src={drink1} alt="1~2개 예시" />
        <CardTitle>1~2개</CardTitle>
        <CardExample>Ex) 아메리카노, 라떼</CardExample>
      </CardLeft>

      {/* 우측 카드: 3개 이상 */}
      <CardRight onClick={handleThreePlus}>
        <CardImage src={drink3} alt="3개 이상 예시" />
        <CardTitle>3개 이상</CardTitle>
        <CardExample>Ex) 아메리카노, 라떼, 아이스티</CardExample>
      </CardRight>

      {/* 뒤로가기 */}
      <BackButton onClick={handleBack} />

      {/* 하단 바 */}
      <BottomBar />
    </Page>
  );
}

export default VoiceOrder;

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  BottomBar,
  Title,
  SubTitle,
  CardLeft,
  CardRight,
  CardTitle,
  CardExample,
  CardImage,
} from "./ColorIntro.styles";
import BackButton from "../components/BackButton";
import drinkG from "../assets/images/drinkgreen.png";
import drinkP from "../assets/images/drinkpurple.png";
import { setMode } from "../utils/orderSpec";

function ColorIntro() {
  const navigate = useNavigate();

  const handleClick = () => {
    setMode("color");       // ✅ color 모드 설정
    navigate("/order/color");
  };

  function handleBack() {
    navigate(-1);
  }

  return (
    <Page>
      <Title>주문하실 메뉴의 색상을 확인해주세요</Title>
      <SubTitle>클릭 시 '메뉴 선택'으로 넘어갑니다</SubTitle>

      {/* 좌측 카드: 아메리카노 */}
      <CardLeft onClick={handleClick}>
        <CardImage src={drinkG} alt="아메리카노" />
        <CardTitle>아메리카노</CardTitle>
        <CardExample>초록색 테두리를 따라가세요</CardExample>
      </CardLeft>

      {/* 우측 카드: 라떼 */}
      <CardRight onClick={handleClick}>
        <CardImage src={drinkP} alt="라떼" />
        <CardTitle>라떼</CardTitle>
        <CardExample>보라색 테두리를 따라가세요</CardExample>
      </CardRight>

      <BackButton onClick={handleBack} />
      <BottomBar />
    </Page>
  );
}

export default ColorIntro;

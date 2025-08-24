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
import BackButton from "../../components/button/BackButton";
import drinkG from "../../assets/images/drinkgreen.png";
import drinkP from "../../assets/images/drinkpurple.png";
import { setMode } from "../../utils/orderSpec";

export default function ColorIntro() {
  const navigate = useNavigate();

  const handleAmericanoClick = () => {
    setMode("color");
    // 아메리카노 선택 정보를 localStorage에 저장
    localStorage.setItem("selectedMenuType", "americano");
    navigate("/order/color");
  };

  const handleLatteClick = () => {
    setMode("color");
    // 라떼 선택 정보를 localStorage에 저장
    localStorage.setItem("selectedMenuType", "latte");
    navigate("/order/color");
  };

  function handleBack() {
    navigate(-1);
  }

  return (
    <Page>
      <Title>주문하실 메뉴의 색상을 확인해주세요</Title>
      <SubTitle>클릭 시 '메뉴 선택'으로 넘어갑니다</SubTitle>

      <CardLeft onClick={handleAmericanoClick}>
        <CardImage src={drinkG} alt="아메리카노" />
        <CardTitle>아메리카노</CardTitle>
        <CardExample>초록색 테두리를 따라가세요</CardExample>
      </CardLeft>

      <CardRight onClick={handleLatteClick}>
        <CardImage src={drinkP} alt="라떼" />
        <CardTitle>라떼</CardTitle>
        <CardExample>보라색 테두리를 따라가세요</CardExample>
      </CardRight>

      <BackButton onClick={handleBack} />
      <BottomBar />
    </Page>
  );
}

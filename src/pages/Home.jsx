import React from "react";
import { useNavigate } from "react-router-dom";
import {
  WaitingScreenContainer,
  LogoContainer,
  LogoImage,
  SubtitleText,
  TitleGroup,
  TitleBlue,
  TitleBlack,
  OrderButton,
  OrderButtonText,
} from "./Home.styles";
import logoImage from "../assets/images/logo.png";

function Home() {
  const navigate = useNavigate();
  //아래 주문하기 버튼 클릭 이벤트 처리랑 비교해서 필요한 거 수정해주세요.
  function handleOrderClick() {
    console.log("주문하기 버튼 클릭");

    const orderPath = process.env.REACT_APP_ORDER_PATH || "/order-method";
    navigate(orderPath);  
  }

  return (
    <WaitingScreenContainer>
      {/* 로고 영역 */}
      <LogoContainer>
        <LogoImage src={logoImage} alt="KiTalk 로고" />
      </LogoContainer>

      {/* 메인 콘텐츠 */}
      <SubtitleText>키오스크 이젠 어렵지 않아요</SubtitleText>
      <TitleGroup>
        <TitleBlue>간편하게</TitleBlue>
        <TitleBlack>주문하세요</TitleBlack>
      </TitleGroup>

      {/* 주문하기 버튼 */}
      <OrderButton onClick={handleOrderClick}>
        <OrderButtonText>주문하기</OrderButtonText>
      </OrderButton>
    </WaitingScreenContainer>
  );
}

export default Home;

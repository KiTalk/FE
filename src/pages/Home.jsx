import React from "react";
import { useNavigate } from 'react-router-dom';
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

export default function Home() {
  const navigate = useNavigate();
  function handleOrderClick() {
    navigate('/order-method');
  }

  return (
    <WaitingScreenContainer>
      <LogoContainer>
        <LogoImage src={logoImage} alt="KiTalk 로고" />
      </LogoContainer>

      <SubtitleText>키오스크 이젠 어렵지 않아요</SubtitleText>
      <TitleGroup>
        <TitleBlue>간편하게</TitleBlue>
        <TitleBlack>주문하세요</TitleBlack>
      </TitleGroup>

      <OrderButton onClick={handleOrderClick}>
        <OrderButtonText>주문하기</OrderButtonText>
      </OrderButton>
    </WaitingScreenContainer>
  );
}

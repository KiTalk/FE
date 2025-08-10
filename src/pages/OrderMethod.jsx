import React from "react";
import { useNavigate } from "react-router-dom";
import voiceImg from "../assets/images/voice.png";
import fingerImg from "../assets/images/finger.png";
import phoneImg from "../assets/images/phone.png";
import {
  Container,
  Title,
  Subtitle,
  LargeButton,
  ButtonGroup,
  SmallButton,
  TextGroup,
  ItemName,
  ItemDesc,
  Icon,
  BottomAccentBar,
} from "./OrderMethod.styles";

/** 컴포넌트 함수 선언식 */
function OrderMethod() {
  const navigate = useNavigate();

  /** 내부 동작 함수(선언식): 공통 선택 처리 */
  function handleSelect(path) {
    navigate(path);
  }

  /** 내부 동작 함수(선언식): 각 버튼 전용 핸들러 */
  function handleVoiceClick() {
    handleSelect("/order/voice");
  }
  function handleTouchClick() {
    handleSelect("/order/touch");
  }
  function handlePhoneClick() {
    handleSelect("/order/phone");
  }

  return (
    <Container>
      <Title>주문 방법 선택</Title>
      <Subtitle>아래 방법 중 선택해 주세요</Subtitle>

      {/* Large Button - 텍스트 왼쪽, 이미지 오른쪽 */}
      <LargeButton type="button" onClick={handleVoiceClick}>
        <TextGroup>
          <ItemName large>음성주문</ItemName>
          <ItemDesc large>간편하게 말로 주문</ItemDesc>
        </TextGroup>
        <Icon src={voiceImg} alt="음성주문 아이콘" large />
      </LargeButton>

      {/* Small Buttons - 텍스트 왼쪽, 이미지 오른쪽 / 높이 동일 */}
      <ButtonGroup>
        <SmallButton type="button" onClick={handleTouchClick}>
          <TextGroup>
            <ItemName>손가락 주문</ItemName>
            <ItemDesc>화면을 눌러 간편하게 주문</ItemDesc>
          </TextGroup>
          <Icon src={fingerImg} alt="손가락 주문 아이콘" />
        </SmallButton>

        <SmallButton type="button" onClick={handlePhoneClick}>
          <TextGroup>
            <ItemName>전화번호 간편주문</ItemName>
            <ItemDesc>간편하게 말로 주문</ItemDesc>
          </TextGroup>
          <Icon src={phoneImg} alt="전화번호 간편주문 아이콘" />
        </SmallButton>
      </ButtonGroup>

      {/* 하단 둥근 직사각형 액센트 */}
      <BottomAccentBar aria-hidden="true" />
    </Container>
  );
}

export default OrderMethod;

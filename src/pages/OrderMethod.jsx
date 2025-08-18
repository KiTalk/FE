import React from "react";
import { useNavigate } from "react-router-dom";
import voiceImg from "../assets/images/voice.png";
import fingerImg from "../assets/images/finger.png";
import phoneImg from "../assets/images/phone.png";
import colorImg from "../assets/images/drink1.png";
import {
  Container,
  Title,
  Subtitle,
  Button,
  ButtonGroup,
  TextGroup,
  ItemName,
  ItemDesc,
  Icon,
  BottomAccentBar,
} from "./OrderMethod.styles";

function OrderMethod() {
  const navigate = useNavigate();

  function handleSelect(path) {
    navigate(path);
  }

  return (
    <Container>
      <Title>주문 방법 선택</Title>
      <Subtitle>아래 방법 중 선택해 주세요</Subtitle>

      {/* 윗줄 : 음성 주문 + 색깔 주문 */}
      <ButtonGroup>
        <Button type="button" onClick={() => handleSelect("/order/voice")}>
          <Icon src={voiceImg} alt="" aria-hidden="true" />
          <TextGroup>
            <ItemName>음성 주문</ItemName>
            <ItemDesc>간편하게 말로 주문</ItemDesc>
          </TextGroup>
        </Button>

        <Button type="button" onClick={() => handleSelect("/order/color")}>
          <Icon src={colorImg} alt="" aria-hidden="true" />
          <TextGroup>
            <ItemName>색깔 주문</ItemName>
            <ItemDesc>색으로 골라 빠르게 주문</ItemDesc>
          </TextGroup>
        </Button>
      </ButtonGroup>

      {/* 아랫줄 : 손가락 주문 + 전화번호 간편주문 */}
      <ButtonGroup>
        <Button type="button" onClick={() => handleSelect("/order/touch")}>
          <Icon src={fingerImg} alt="" aria-hidden="true" />
          <TextGroup>
            <ItemName>손가락 주문</ItemName>
            <ItemDesc>화면을 눌러 간편하게 주문</ItemDesc>
          </TextGroup>
        </Button>

        <Button
          type="button"
          onClick={() => handleSelect("/order/phone/number")}
        >
          <Icon src={phoneImg} alt="" aria-hidden="true" />
          <TextGroup>
            <ItemName>전화번호 간편주문</ItemName>
            <ItemDesc>번호로 빠르게 주문</ItemDesc>
          </TextGroup>
        </Button>
      </ButtonGroup>

      <BottomAccentBar aria-hidden="true" />
    </Container>
  );
}

export default OrderMethod;

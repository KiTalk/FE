import React from "react";
import { useNavigate } from "react-router-dom";
import { orderService, touchOrderService } from "../../services/api";
import BackButton from "../../components/button/BackButton";
import packageIcon from "../../assets/images/package.png";
import dineinIcon from "../../assets/images/dinein.png";
import {
  Page,
  BottomAccentBar,
  Title,
  CardGrid,
  Card,
  IconWrap,
  IconImage,
  CardLabel,
} from "./Package.styles";

export default function PackagePage() {
  const navigate = useNavigate();

  // 이전 페이지가 Cart.jsx인지 확인하는 함수
  function isFromTouchCart() {
    // 현재 sessionStorage에 터치주문 세션이 있고, Cart에서 온 경우
    const sessionId = sessionStorage.getItem("currentSessionId");
    const orderSpec = localStorage.getItem("order_spec");

    if (sessionId && orderSpec) {
      try {
        const spec = JSON.parse(orderSpec);
        // 터치주문 모드인 경우 (PhoneOrder도 포함)
        return (
          spec.mode === "touch" ||
          spec.mode === "color" ||
          spec.mode === "phone" ||
          spec.point?.enabled
        );
      } catch {
        return false;
      }
    }
    return false;
  }

  function handleBack() {
    navigate(-1);
  }

  async function persistAndNext(type) {
    const sessionId = sessionStorage.getItem("currentSessionId");

    if (!sessionId) {
      console.error("세션 ID가 없습니다.");
      navigate("/order-method");
      return;
    }

    try {
      // 터치주문에서 온 경우 터치주문 포장 API 사용
      if (isFromTouchCart()) {
        const orderSpec = localStorage.getItem("order_spec");
        let spec = {};
        try {
          spec = JSON.parse(orderSpec || "{}");
        } catch {
          // JSON 파싱 실패 시 빈 객체 사용
        }

        // phone 모드인 경우 바로 주문 완료 처리
        if (spec.mode === "phone") {
          const packagingType = type === "takeout" ? "포장" : "매장";

          // 포장 방식 설정
          await touchOrderService.setTouchCartPackaging(
            sessionId,
            packagingType
          );
          console.log("✅ 전화번호 주문 포장 방식 설정 완료");

          // 바로 주문 완료 처리
          const response = await touchOrderService.completePhoneOrder(
            sessionId
          );
          console.log("✅ 전화번호 주문 완료:", response);
          navigate("/order/complete");
          return;
        }

        // 일반 터치주문인 경우
        const packagingType = type === "takeout" ? "포장" : "매장";
        const response = await touchOrderService.setTouchCartPackaging(
          sessionId,
          packagingType
        );
        console.log("✅ 터치주문 포장 방식 설정 완료:", response);
        navigate("/order/point");
        return;
      }

      // 음성주문에서 온 경우 기존 음성주문 API 사용
      const packagingType = type === "takeout" ? "포장" : "매장식사";
      const response = await orderService.selectPackaging(
        sessionId,
        packagingType
      );
      console.log("✅ 음성주문 포장 방식 선택 완료:", response);
      navigate("/order/point");
    } catch (err) {
      console.error("포장 방식 선택 API 실패:", err);
      navigate("/order-method");
    }
  }

  return (
    <Page>
      <BackButton onClick={handleBack} />
      <Title>어디에서 드시나요?</Title>
      <CardGrid>
        <Card
          type="button"
          onClick={function () {
            persistAndNext("takeout");
          }}
        >
          <IconWrap>
            <IconImage src={packageIcon} alt="포장하기" />
          </IconWrap>
          <CardLabel>포장하기</CardLabel>
        </Card>
        <Card
          type="button"
          onClick={function () {
            persistAndNext("dinein");
          }}
        >
          <IconWrap>
            <IconImage src={dineinIcon} alt="먹고가기" />
          </IconWrap>
          <CardLabel>먹고가기</CardLabel>
        </Card>
      </CardGrid>
      <BottomAccentBar aria-hidden="true" />
    </Page>
  );
}

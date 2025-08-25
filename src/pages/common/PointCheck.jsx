import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/button/BackButton";
import { voiceOrderService, touchOrderService } from "../../services/api";
import {
  Page,
  BottomAccentBar,
  Title,
  CardGrid,
  Card,
  CardLabel,
  IconCenter,
  CrossIcon,
  CircleIcon,
} from "./PointCheck.styles";

export default function PointCheckPage() {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  // 터치주문에서 온 경우인지 확인하는 함수
  function isFromTouchOrder() {
    const sessionId = sessionStorage.getItem("currentSessionId");
    const orderSpec = localStorage.getItem("order_spec");

    if (sessionId && orderSpec) {
      try {
        const spec = JSON.parse(orderSpec);
        // 터치주문 모드인 경우
        return spec.mode === "touch" || spec.mode === "color";
      } catch {
        return false;
      }
    }
    return false;
  }

  async function handleSelect(save) {
    const sessionId = sessionStorage.getItem("currentSessionId");

    if (!sessionId) {
      console.error("세션 ID가 없습니다.");
      navigate("/order-method");
      return;
    }

    try {
      // 터치주문에서 온 경우 터치주문 전화번호 선택 API 사용
      if (isFromTouchOrder()) {
        const response = await touchOrderService.submitTouchPhoneChoice(
          sessionId,
          save
        );
        console.log("✅ 터치주문 전화번호 선택 완료:", response);

        // API 응답에 따라 네비게이션
        if (save) {
          navigate("/order/point/phone");
        } else {
          navigate("/order/complete");
        }
        return;
      }

      // 음성주문에서 온 경우 기존 음성주문 API 사용
      const response = await voiceOrderService.submitPhoneChoice(
        sessionId,
        save
      );
      console.log("✅ 음성주문 전화번호 선택 완료:", response);

      // API 응답에 따라 네비게이션
      if (save) {
        navigate("/order/point/phone");
      } else {
        navigate("/order/complete");
      }
    } catch (err) {
      console.error("전화번호 선택 API 실패:", err);
      navigate("/order-method");
    }
  }

  return (
    <Page>
      <BackButton onClick={handleBack} />
      <Title>주문 내역을 기억해드릴까요?</Title>
      <CardGrid>
        <Card
          type="button"
          onClick={function () {
            handleSelect(false);
          }}
        >
          <IconCenter>
            <CrossIcon />
          </IconCenter>
          <CardLabel>아니요</CardLabel>
        </Card>
        <Card
          type="button"
          onClick={function () {
            handleSelect(true);
          }}
        >
          <IconCenter>
            <CircleIcon />
          </IconCenter>
          <CardLabel>좋아요</CardLabel>
        </Card>
      </CardGrid>
      <BottomAccentBar aria-hidden="true" />
    </Page>
  );
}

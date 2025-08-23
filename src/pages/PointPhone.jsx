import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import PhoneInput from "../components/PhoneInput";
import { voiceOrderService, touchOrderService } from "../services/api";

export default function PointPhone() {
  const navigate = useNavigate();

  // 터치주문에서 온 경우인지 확인하는 함수
  const isFromTouchOrder = () => {
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
  };

  async function handleSave(phoneDigits) {
    const sessionId = sessionStorage.getItem("currentSessionId");

    if (!sessionId) {
      console.error("세션 ID가 없습니다.");
      navigate("/order-method");
      return;
    }

    try {
      // 터치주문에서 온 경우 터치주문 전화번호 입력 API 사용
      if (isFromTouchOrder()) {
        const response = await touchOrderService.submitTouchPhoneNumber(
          sessionId,
          phoneDigits
        );
        console.log("✅ 터치주문 전화번호 입력 완료:", response);
        navigate("/order/complete", { replace: true });
        return;
      }

      // 음성주문에서 온 경우 기존 음성주문 API 사용
      const response = await voiceOrderService.submitPhoneNumber(
        sessionId,
        phoneDigits
      );
      console.log("✅ 음성주문 전화번호 입력 완료:", response);
      navigate("/order/complete", { replace: true });
    } catch (error) {
      console.error("전화번호 입력 API 실패:", error);
      navigate("/order-method");
    }
  }

  function handleGoBack() {
    navigate(-1);
  }

  return (
    <PhoneInput
      title="전화번호로 간편 주문"
      subtitle="전화번호 입력시 '자주 주문한 메뉴'를 확인할 수 있습니다"
      inputHeading="전화번호 입력"
      instruction="오른쪽 숫자 패드에서 전화번호 입력 후 저장을 눌러주세요"
      saveButtonText="저장"
      onSave={handleSave}
      onBack={handleGoBack}
    >
      <BackButton onClick={handleGoBack} />
    </PhoneInput>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import PhoneInput from "../components/PhoneInput";
import { voiceOrderService, touchOrderService } from "../services/api";

export default function PointPhone() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // 터치주문에서 온 경우인지 확인하는 함수
  const isFromTouchOrder = () => {
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
  };

  async function handleSave(phoneDigits) {
    if (isSaving) return;

    setIsSaving(true);
    setErrorMessage(null); // 에러 메시지 초기화

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

      // 구체적인 에러 처리
      if (error.response?.status === 400) {
        const errorData = error.response?.data;

        // 단계 오류인 경우 (packaging 단계가 필요한 경우)
        if (
          errorData?.message?.includes("packaging") ||
          errorData?.next_step?.includes("포장")
        ) {
          console.log(
            "포장 방식 선택이 필요합니다. Package 페이지로 이동합니다."
          );
          navigate("/order/package");
          return;
        }

        const msg =
          errorData?.detail ||
          errorData?.message ||
          "전화번호 입력 처리 중 오류가 발생했습니다.\n번호를 확인 후 다시 입력해 주세요!";
        setErrorMessage(msg);
      } else if (error.response?.status === 410) {
        setErrorMessage("세션이 만료되었습니다.\n처음부터 다시 시작해 주세요!");
      } else if (error.response?.status === 404) {
        setErrorMessage(
          "등록된 번호가 없습니다.\n번호를 확인 후 다시 입력해 주세요!"
        );
      } else {
        setErrorMessage(
          "네트워크 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요."
        );
      }
    } finally {
      setIsSaving(false);
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
      errorMessage={errorMessage}
      saveButtonText={isSaving ? "저장 중..." : "저장"}
      onSave={handleSave}
      onBack={handleGoBack}
    >
      <BackButton onClick={handleGoBack} />
    </PhoneInput>
  );
}

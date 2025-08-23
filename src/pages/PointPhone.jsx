import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import PhoneInput from "../components/PhoneInput";
import { saveOrderPoint } from "../utils/orderSpec";
import { touchOrderService } from "../services/api";

export default function PointPhone() {
  const navigate = useNavigate();

  async function handleSave(phoneDigits) {
    const sessionId = sessionStorage.getItem("currentSessionId");

    try {
      // 세션 ID가 있으면 전화번호 입력 API 호출
      if (sessionId) {
        const response = await touchOrderService.submitPhoneNumber(
          sessionId,
          phoneDigits
        );
        console.log("✅ 전화번호 입력 API 응답:", response);

        // 주문 완료 페이지로 이동
        navigate("/order/complete", { replace: true });
        return;
      }

      // 기존 로직 (세션 ID가 없는 경우)
      saveOrderPoint({ phone: phoneDigits });
      navigate("/order/complete", { replace: true });
    } catch (error) {
      console.error("전화번호 입력 API 실패:", error);
      // API 실패 시 기존 로직으로 폴백
      try {
        saveOrderPoint({ phone: phoneDigits });
        navigate("/order/complete", { replace: true });
      } catch (saveError) {
        console.error("orderSpec 저장 실패:", saveError);
      }
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/button/BackButton";
import PhoneInput from "../../components/phone/PhoneInput";
import { saveOrderPoint } from "../../utils/orderSpec";
import { touchOrderService } from "../../services/api";
import { formatPhoneWithHyphens } from "../../utils/phoneUtils";

export default function PhoneNumber() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSave(phoneDigits) {
    if (isSaving) return;

    setIsSaving(true);
    setErrorMessage(null); // 에러 메시지 초기화

    try {
      // 세션 ID 확인
      const sessionId = sessionStorage.getItem("currentSessionId");

      if (!sessionId) {
        navigate("/order-method");
        return;
      }

      // 전화번호를 서버에 저장
      await touchOrderService.saveTouchPhoneNumber(sessionId, phoneDigits);

      // 상단 메뉴 조회로 전화번호 유효성 확인
      try {
        const formattedPhone = formatPhoneWithHyphens(phoneDigits);
        await touchOrderService.getPhoneTopMenus(formattedPhone);

        // 기존 로컬 저장소 저장도 유지
        saveOrderPoint({ enabled: true, phone: phoneDigits });

        navigate("/order/phone");
      } catch (topMenuError) {
        // 404 또는 500 에러인 경우 에러 메시지 표시
        if (
          topMenuError.response?.status === 404 ||
          topMenuError.response?.status === 500
        ) {
          const msg =
            topMenuError.response?.status === 404
              ? "등록된 번호가 없습니다\n번호를 확인 후 다시 입력해 주세요!"
              : "서버 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.";
          setErrorMessage(msg);
        } else {
          // 다른 에러의 경우 일반적인 에러 처리
          throw topMenuError;
        }
      }
    } catch (error) {
      console.error("❌ 전화번호 저장 실패:", error);
      if (error.response?.data?.message) {
        alert(`저장 실패: ${error.response.data.message}`);
      } else {
        alert(
          "전화번호 저장에 실패했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요."
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
      saveButtonText={isSaving ? "조회 중..." : "조회"}
      onSave={handleSave}
      onBack={handleGoBack}
    >
      <BackButton onClick={handleGoBack} />
    </PhoneInput>
  );
}

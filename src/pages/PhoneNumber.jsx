import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import PhoneInput from "../components/PhoneInput";
import { saveOrderPoint } from "../utils/orderSpec";

export default function PhoneNumber() {
  const navigate = useNavigate();

  function handleSave(phoneDigits) {
    try {
      saveOrderPoint({ enabled: true, phone: phoneDigits });
      navigate("/order/phone");
    } catch (error) {
      console.error(error);
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

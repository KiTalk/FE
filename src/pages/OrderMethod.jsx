import React from "react";
import "./OrderMethod.styled.css";
import { useNavigate } from "react-router-dom";
import voiceImg from "../assets/images/voice.png";
import fingerImg from "../assets/images/finger.png";
import phoneImg from "../assets/images/phone.png";

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
    <div className="Container">
      <h1 className="Title">주문 방법 선택</h1>
      <p className="Subtitle">아래 방법 중 선택해 주세요</p>

      {/* Large Button - 텍스트 왼쪽, 이미지 오른쪽 */}
      <button type="button" className="LargeButton" onClick={handleVoiceClick}>
        <div className="TextGroup">
          <div className="ItemName">음성주문</div>
          <div className="ItemDesc">간편하게 말로 주문</div>
        </div>
        <img src={voiceImg} alt="음성주문 아이콘" className="Icon" />
      </button>

      {/* Small Buttons - 텍스트 왼쪽, 이미지 오른쪽 / 높이 동일 */}
      <div className="ButtonGroup">
        <button type="button" className="ButtonTouch" onClick={handleTouchClick}>
          <div className="TextGroup">
            <div className="ItemName">손가락 주문</div>
            <div className="ItemDesc">화면을 눌러 간편하게 주문</div>
          </div>
          <img src={fingerImg} alt="손가락 주문 아이콘" className="Icon" />
        </button>

        <button type="button" className="ButtonPhone" onClick={handlePhoneClick}>
          <div className="TextGroup">
            <div className="ItemName">전화번호 간편주문</div>
            <div className="ItemDesc">간편하게 말로 주문</div>
          </div>
          <img src={phoneImg} alt="전화번호 간편주문 아이콘" className="Icon" />
        </button>
      </div>

      {/* 하단 둥근 직사각형 액센트 */}
      <div className="BottomAccentBar" aria-hidden="true" />
    </div>
  );
}

export default OrderMethod;

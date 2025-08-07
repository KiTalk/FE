// src/pages/OrderMethod.jsx
import React from "react";
import "./OrderMethod.styled.css";
import { FaMicrophone, FaHandPointer, FaPhone } from "react-icons/fa";

function OrderMethod() {
  return (
    <div className="container">
      <h2 className="title">주문 방법 선택</h2>
      <p className="subtitle">아래 방법 중 선택해 주세요</p>

      <div className="buttons">
        <button className="large-button">
          <FaMicrophone className="icon" />
          <strong>음성주문</strong>
          <div className="desc">간편하게 말로 주문</div>
        </button>

        <div className="small-buttons">
          <button className="small-button">
            <FaHandPointer className="icon" />
            <strong>손가락 주문</strong>
            <div className="desc">화면을 눌러 간편하게 주문</div>
          </button>

          <button className="small-button">
            <FaPhone className="icon" />
            <strong>전화번호 간편주문</strong>
            <div className="desc">간편하게 말로 주문</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderMethod;

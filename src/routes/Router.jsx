import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import OrderMethod from "../pages/OrderMethod";
import TouchOrder from "../pages/TouchOrder";
import VoiceOrder from "../pages/VoiceOrder";
import VoiceOneTwo from "../pages/VoiceOneTwo";
import VoiceRecognize from "../pages/VoiceRecognize";
import PhoneOrder from "../pages/PhoneOrder";
import VoiceCart from "../pages/VoiceCart";
// 추후 추가될 페이지들을 위한 임포트 (현재는 주석 처리)
// import NotFound from "./pages/NotFound";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 메인 홈페이지 */}
        <Route path="/" element={<Home />} />
        <Route path="/order-method" element={<OrderMethod />} />
        <Route path="/order/touch" element={<TouchOrder />} />
        <Route path="/order/voice" element={<VoiceOrder />} />
        <Route path="/order/voice/one-two" element={<VoiceOneTwo />} />
        <Route path="/order/voice/recognize" element={<VoiceRecognize />} />
        <Route path="/order/phone" element={<PhoneOrder />} />
        <Route path="/order/voice/cart" element={<VoiceCart />} />

        {/* 404 페이지 (모든 라우트의 마지막에 위치) */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

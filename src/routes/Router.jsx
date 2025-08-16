import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import OrderMethod from "../pages/OrderMethod";
import TouchOrder from "../pages/TouchOrder";
import Cart from "../pages/Cart";
import VoiceOrder from "../pages/VoiceOrder";
import VoiceOneTwo from "../pages/VoiceOneTwo";
import VoiceRecognize from "../pages/VoiceRecognize";
import PhoneNumber from "../pages/PhoneNumber";
import PhoneOrder from "../pages/PhoneOrder";
import VoiceCart from "../pages/VoiceCart";
import PackagePage from "../pages/Package";
import PointCheckPage from "../pages/PointCheck";
import OrderCompletePage from "../pages/OrderComplete";
import PointPhone from "../pages/PointPhone";
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
        <Route path="/order/cart" element={<Cart />} />
        <Route path="/order/package" element={<PackagePage />} />
        <Route path="/order/point" element={<PointCheckPage />} />
        <Route path="/order/point/phone" element={<PointPhone />} />
        <Route path="/order/voice" element={<VoiceOrder />} />
        <Route path="/order/voice/one-two" element={<VoiceOneTwo />} />
        <Route path="/order/voice/recognize" element={<VoiceRecognize />} />
        <Route path="/order/phone/number" element={<PhoneNumber />} />
        <Route path="order/phone" element={<PhoneOrder />} />
        <Route path="/order/voice/cart" element={<VoiceCart />} />
        <Route path="/order/complete" element={<OrderCompletePage />} />

        {/* 404 페이지 (모든 라우트의 마지막에 위치) */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import Home from "../pages/Home";
import OrderMethod from "../pages/OrderMethod";
import TouchOrder from "../pages/TouchOrder";
import Cart from "../pages/Cart";
import VoiceOrder from "../pages/VoiceOrder";
import VoiceOneTwo from "../pages/VoiceOneTwo";
import VoiceThreePlus from "../pages/VoiceThreePlus";
import VoiceThreePlusRecording from "../pages/VoiceThreePlusRecording";
import VoiceThreePlusDetails from "../pages/VoiceThreePlusDetails";
import VoiceRecognize from "../pages/VoiceRecognize";
import PhoneNumber from "../pages/PhoneNumber";
import PhoneOrder from "../pages/PhoneOrder";
import VoiceCart from "../pages/VoiceCart";
import PackagePage from "../pages/Package";
import PointCheckPage from "../pages/PointCheck";
import OrderCompletePage from "../pages/OrderComplete";
import PointPhone from "../pages/PointPhone";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 메인 홈페이지 */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />

        {/* 주문 방식 선택 */}
        <Route
          path="/order-method"
          element={
            <PageTransition>
              <OrderMethod />
            </PageTransition>
          }
        />

        {/* 터치 주문 */}
        <Route
          path="/order/touch"
          element={
            <PageTransition>
              <TouchOrder />
            </PageTransition>
          }
        />

        {/* 장바구니 */}
        <Route
          path="/order/cart"
          element={
            <PageTransition>
              <Cart />
            </PageTransition>
          }
        />

        {/* 포장/매장 선택 */}
        <Route
          path="/order/package"
          element={
            <PageTransition>
              <PackagePage />
            </PageTransition>
          }
        />

        {/* 포인트 확인 */}
        <Route
          path="/order/point"
          element={
            <PageTransition>
              <PointCheckPage />
            </PageTransition>
          }
        />
        <Route
          path="/order/point/phone"
          element={
            <PageTransition>
              <PointPhone />
            </PageTransition>
          }
        />

        {/* 음성 주문 */}
        <Route
          path="/order/voice"
          element={
            <PageTransition>
              <VoiceOrder />
            </PageTransition>
          }
        />
        <Route
          path="/order/voice/one-two"
          element={
            <PageTransition>
              <VoiceOneTwo />
            </PageTransition>
          }
        />
        <Route
          path="/order/voice/three-plus"
          element={
            <PageTransition>
              <VoiceThreePlus />
            </PageTransition>
          }
        />
        <Route
          path="/order/voice/3up/recording"
          element={
            <PageTransition>
              <VoiceThreePlusRecording />
            </PageTransition>
          }
        />
        <Route
          path="/order/voice/details"
          element={
            <PageTransition>
              <VoiceThreePlusDetails />
            </PageTransition>
          }
        />
        <Route
          path="/order/voice/recognize"
          element={
            <PageTransition>
              <VoiceRecognize />
            </PageTransition>
          }
        />
        <Route
          path="/order/voice/cart"
          element={
            <PageTransition>
              <VoiceCart />
            </PageTransition>
          }
        />

        {/* 전화 주문 */}
        <Route
          path="/order/phone/number"
          element={
            <PageTransition>
              <PhoneNumber />
            </PageTransition>
          }
        />
        <Route
          path="/order/phone"
          element={
            <PageTransition>
              <PhoneOrder />
            </PageTransition>
          }
        />

        {/* 주문 완료 */}
        <Route
          path="/order/complete"
          element={
            <PageTransition>
              <OrderCompletePage />
            </PageTransition>
          }
        />
      </Routes>
    </Router>
  );
}

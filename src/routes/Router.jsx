import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import ColorIntro from "../pages/ColorIntro";
import ColorOrder from "../pages/ColorOrder";
import PhoneNumber from "../pages/PhoneNumber";
import PhoneOrder from "../pages/PhoneOrder";
import VoiceCart from "../pages/VoiceCart";
import PackagePage from "../pages/Package";
import PointCheckPage from "../pages/PointCheck";
import OrderCompletePage from "../pages/OrderComplete";
import PointPhone from "../pages/PointPhone";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <PageTransition stableKey={false}>
      <Routes location={location}>
        {/* 메인 홈페이지 */}
        <Route path="/" element={<Home />} />

        {/* 주문 방식 선택 */}
        <Route path="/order-method" element={<OrderMethod />} />

        {/* 터치 주문 */}
        <Route path="/order/touch" element={<TouchOrder />} />

        {/* 장바구니 */}
        <Route path="/order/cart" element={<Cart />} />

        {/* 포장/매장 선택 */}
        <Route path="/order/package" element={<PackagePage />} />

        {/* 포인트 확인 */}
        <Route path="/order/point" element={<PointCheckPage />} />
        <Route path="/order/point/phone" element={<PointPhone />} />

        {/* 음성 주문 */}
        <Route path="/order/voice" element={<VoiceOrder />} />
        <Route path="/order/voice/one-two" element={<VoiceOneTwo />} />
        <Route path="/order/voice/three-plus" element={<VoiceThreePlus />} />
        <Route
          path="/order/voice/3up/recording"
          element={<VoiceThreePlusRecording />}
        />
        <Route
          path="/order/voice/details"
          element={<VoiceThreePlusDetails />}
        />
        <Route path="/order/voice/recognize" element={<VoiceRecognize />} />
        <Route path="/order/voice/cart" element={<VoiceCart />} />

        {/* 색깔 주문 */}
        <Route
        path="/order/color/intro"
        element={
          <PageTransition>
            <ColorIntro />
          </PageTransition>
        }
        />
        <Route
        path="/order/color"
        element={
          <PageTransition>
            <ColorOrder />
          </PageTransition>
        }
        />

        {/* 전화번호 주문 */}
        <Route path="/order/phone/number" element={<PhoneNumber />} />
        <Route path="/order/phone" element={<PhoneOrder />} />

        {/* 주문 완료 */}
        <Route path="/order/complete" element={<OrderCompletePage />} />
      </Routes>
    </PageTransition>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

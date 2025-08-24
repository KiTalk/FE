import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import PageTransition from "../components/motion/PageTransition";
import Home from "../pages/common/Home";
import OrderMethod from "../pages/common/OrderMethod";
import TouchOrder from "../pages/touch/TouchOrder";
import Cart from "../pages/common/Cart";
import VoiceOrder from "../pages/single_voice/VoiceOrder";
import VoiceOneTwo from "../pages/single_voice/VoiceOneTwo";
import VoiceThreePlus from "../pages/complex_voice/VoiceThreePlus";
import VoiceThreePlusRecording from "../pages/complex_voice/VoiceThreePlusRecording";
import VoiceThreePlusDetails from "../pages/complex_voice/VoiceThreePlusDetails";
import VoiceThreePlusDetailsPlus from "../pages/complex_voice/VoiceThreePlusDetailsPlus";
import VoiceThreePlusConfirmOrder from "../pages/complex_voice/VoiceThreePlusConfirmOrder";
import VoiceRecognize from "../pages/single_voice/VoiceRecognize";
import ColorIntro from "../pages/color/ColorIntro";
import ColorOrder from "../pages/color/ColorOrder";
import PhoneNumber from "../pages/phone/PhoneNumber";
import PhoneOrder from "../pages/phone/PhoneOrder";
import VoiceCart from "../pages/single_voice/VoiceCart";
import PackagePage from "../pages/common/Package";
import PointCheckPage from "../pages/common/PointCheck";
import OrderCompletePage from "../pages/common/OrderComplete";
import PointPhone from "../pages/common/PointPhone";
import VoiceError from "../pages/common/VoiceError";

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
        <Route
          path="/order/voice/details/plus"
          element={<VoiceThreePlusDetailsPlus />}
        />
        <Route
          path="/order/voice/details/plus/confirm"
          element={<VoiceThreePlusConfirmOrder />}
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

        {/* 에러 화면 */}
        <Route path="/voice-error" element={<VoiceError />} />
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

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveOrderPackage } from "../utils/orderSpec";
import { orderService } from "../services/api";
import BackButton from "../components/BackButton";
import packageIcon from "../assets/images/package.png";
import dineinIcon from "../assets/images/dinein.png";
import {
  Page,
  BottomAccentBar,
  Title,
  CardGrid,
  Card,
  IconWrap,
  IconImage,
  CardLabel,
} from "./Package.styles";

export default function PackagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice = 0, totalQty = 0 } = location.state || {};

  function handleBack() {
    navigate(-1);
  }

  async function persistAndNext(type) {
    const sessionId = sessionStorage.getItem("currentSessionId");

    try {
      // 세션 ID가 있으면 포장 API 호출
      if (sessionId) {
        const packagingType = type === "takeout" ? "takeout" : "dinein";
        const response = await orderService.selectPackaging(
          sessionId,
          packagingType
        );
        console.log("✅ 포장 방식 선택 완료:", response);

        // 세션 완료 후 주문 완료 페이지로 이동
        navigate("/order/point");
        return;
      }

      // 기존 로직 (세션 ID가 없는 경우)
      const pkg = { type, totalPrice, totalQty };
      saveOrderPackage(pkg);
    } catch (err) {
      console.error("포장 방식 선택 API 실패:", err);
      // API 실패 시 기존 로직으로 폴백
      try {
        const pkg = { type, totalPrice, totalQty };
        saveOrderPackage(pkg);
      } catch (saveErr) {
        console.error("orderSpec 저장 실패:", saveErr);
      }
    }

    // 기존 네비게이션 로직
    try {
      const orderSpecStr = localStorage.getItem("order_spec");
      if (orderSpecStr) {
        const orderSpec = JSON.parse(orderSpecStr);
        const point = orderSpec.point;

        if (point && point.enabled && point.phone) {
          navigate("/order/complete");
        } else {
          navigate("/order/point");
        }
      } else {
        navigate("/order/point");
      }
    } catch (err) {
      console.error("Error checking order_spec:", err);
      navigate("/order/point");
    }
  }

  return (
    <Page>
      <BackButton onClick={handleBack} />
      <Title>어디에서 드시나요?</Title>
      <CardGrid>
        <Card type="button" onClick={() => persistAndNext("takeout")}>
          <IconWrap>
            <IconImage src={packageIcon} alt="포장하기" />
          </IconWrap>
          <CardLabel>포장하기</CardLabel>
        </Card>
        <Card type="button" onClick={() => persistAndNext("dinein")}>
          <IconWrap>
            <IconImage src={dineinIcon} alt="먹고가기" />
          </IconWrap>
          <CardLabel>먹고가기</CardLabel>
        </Card>
      </CardGrid>
      <BottomAccentBar aria-hidden="true" />
    </Page>
  );
}

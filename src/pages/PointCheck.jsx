import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { saveOrderPoint } from "../utils/orderSpec";
import { touchOrderService } from "../services/api";
import {
  Page,
  BottomAccentBar,
  Title,
  CardGrid,
  Card,
  CardLabel,
  IconCenter,
  CrossIcon,
  CircleIcon,
} from "./PointCheck.styles";

export default function PointCheckPage() {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  async function handleSelect(save) {
    const sessionId = sessionStorage.getItem("currentSessionId");

    try {
      // 세션 ID가 있으면 전화번호 선택 API 호출
      if (sessionId) {
        const response = await touchOrderService.submitPhoneChoice(
          sessionId,
          save
        );
        console.log("✅ 전화번호 선택 API 응답:", response);

        // API 응답에 따라 네비게이션
        if (save) {
          navigate("/order/point/phone");
        } else {
          navigate("/order/complete");
        }
        return;
      }

      // 기존 로직 (세션 ID가 없는 경우)
      saveOrderPoint({ enabled: !!save });
      if (!save) {
        navigate("/order/complete");
      } else {
        navigate("/order/point/phone");
      }
    } catch (err) {
      console.error("전화번호 선택 API 실패:", err);
      // API 실패 시 기존 로직으로 폴백
      try {
        saveOrderPoint({ enabled: !!save });
        if (!save) {
          navigate("/order/complete");
        } else {
          navigate("/order/point/phone");
        }
      } catch (saveErr) {
        console.error("orderSpec 저장 실패:", saveErr);
      }
    }
  }

  return (
    <Page>
      <BackButton onClick={handleBack} />
      <Title>주문 내역을 기억해드릴까요?</Title>
      <CardGrid>
        <Card type="button" onClick={() => handleSelect(false)}>
          <IconCenter>
            <CrossIcon />
          </IconCenter>
          <CardLabel>아니요</CardLabel>
        </Card>
        <Card type="button" onClick={() => handleSelect(true)}>
          <IconCenter>
            <CircleIcon />
          </IconCenter>
          <CardLabel>좋아요</CardLabel>
        </Card>
      </CardGrid>
      <BottomAccentBar aria-hidden="true" />
    </Page>
  );
}

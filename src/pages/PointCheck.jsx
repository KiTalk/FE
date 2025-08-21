import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { saveOrderPoint } from "../utils/orderSpec";
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

  function handleSelect(save) {
    try {
      saveOrderPoint({ enabled: !!save });
      if (!save) {
        navigate("/order/complete");
      } else {
        navigate("/order/point/phone");
      }
    } catch (err) {
      console.error(err);
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

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveOrderPackage } from "../utils/orderSpec";
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

function PackagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice = 0, totalQty = 0 } = location.state || {};

  function handleBack() {
    navigate(-1);
  }

  function persistAndNext(type) {
    try {
      const pkg = { type, totalPrice, totalQty };
      saveOrderPackage(pkg);
    } catch (err) {
      console.error(err);
    }

    navigate("/order/point");
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

export default PackagePage;

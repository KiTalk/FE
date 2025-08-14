import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const ORDER_META_KEY = "package_meta";

function PackagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice = 0, totalQty = 0 } = location.state || {};

  function handleBack() {
    navigate(-1);
  }

  function persistAndNext(type) {
    try {
      const meta = { type, totalPrice, totalQty };
      window.localStorage.setItem(ORDER_META_KEY, JSON.stringify(meta));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Page>
      <BackButton onClick={handleBack} />
      <Title>어디에서 드시나요?</Title>
      <CardGrid>
        <Card type="button" onClick={() => persistAndNext("takeout")}>
          <IconWrap style={{ left: "10.02rem", top: "7.37rem" }}>
            <IconImage
              style={{ width: "219.7598px", height: "197.6741px" }}
              src={packageIcon}
              alt="포장하기"
            />
          </IconWrap>
          <CardLabel>포장하기</CardLabel>
        </Card>
        <Card type="button" onClick={() => persistAndNext("dinein")}>
          <IconWrap style={{ left: "9.75rem", top: "7.37rem" }}>
            <IconImage
              style={{ width: "225px", height: "198.0001px" }}
              src={dineinIcon}
              alt="먹고가기"
            />
          </IconWrap>
          <CardLabel>먹고가기</CardLabel>
        </Card>
      </CardGrid>
      <BottomAccentBar aria-hidden="true" />
    </Page>
  );
}

export default PackagePage;

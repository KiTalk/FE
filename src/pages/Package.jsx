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

    // Check localStorage for order_spec.point
    try {
      const orderSpecStr = localStorage.getItem("order_spec");
      if (orderSpecStr) {
        const orderSpec = JSON.parse(orderSpecStr);
        const point = orderSpec.point;

        // If point is empty or doesn't exist, go to /order/point
        // If point has enabled and phone properties, go to /order/complete
        if (point && point.enabled && point.phone) {
          navigate("/order/complete");
        } else {
          navigate("/order/point");
        }
      } else {
        // No order_spec in localStorage, go to point page
        navigate("/order/point");
      }
    } catch (err) {
      console.error("Error checking order_spec:", err);
      // Fallback to point page if there's an error
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

export default PackagePage;

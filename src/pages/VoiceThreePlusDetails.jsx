import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Page,
  GuideSection,
  ProfileIcon,
  MessageBubble,
  MainTitle,
  ExampleText,
  SpeakButton,
  SpeakButtonContent,
  MicIcon,
  SpeakButtonText,
  FingerGuide,
  FingerImage,
  OrderSection,
  OrderHeader,
  OrderTitle,
  CancelButton,
  ProductsArea,
  ProductCardContainer,
  ScrollSpacer,
  OrderSummary,
  OrderDetails,
  OrderQuantityRow,
  OrderQuantityLabel,
  OrderQuantityValue,
  OrderDivider,
  OrderTotal,
  OrderButton,
} from "./VoiceThreePlusDetails.styles";
import BackButton from "../components/BackButton";
import CartProductCard from "../components/CartProductCard";
import mikeIcon from "../assets/images/mike-solid.png";
import hand from "../assets/images/hand.png";
import profile from "../assets/images/profile.png";
import { orderService } from "../services/api";

function VoiceThreePlusDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const recognizedText = state?.recognized || "";
  const [orderItems, setOrderItems] = useState([]);
  const [additionalProducts] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    totalQuantity: 0,
    totalPrice: 0,
  });
  const [showOrderSection, setShowOrderSection] = useState(false);
  const [animateProducts, setAnimateProducts] = useState(false);
  const [showTopSection, setShowTopSection] = useState(false);

  // handleBack 함수는 현재 사용되지 않음 (뒤로가기 버튼 제거됨)
  // function handleBack() {
  //   navigate(-1);
  // }

  function handleStartVoice() {
    // 추가 음성 주문을 위해 녹음 페이지로 이동
    navigate("/order/voice/3up/recording");
  }

  function handleCancelAll() {
    // 전체 취소
    setOrderItems([]);
    setOrderSummary({ totalQuantity: 0, totalPrice: 0 });
  }

  // Cart.jsx와 동일한 방식으로 총합 계산
  function calculateTotals(items) {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { totalQuantity, totalPrice };
  }

  function handleRemoveItem(itemId) {
    setOrderItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId);
      const totals = calculateTotals(newItems);
      setOrderSummary(totals);
      return newItems;
    });
  }

  function handleQuantityChange(itemId, newQuantity) {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setOrderItems((prev) => {
      const exists = prev.some((item) => item.id === itemId);
      let newItems;
      if (exists) {
        newItems = prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
      } else {
        // 안전 장치: 정보가 없으면 최소 속성으로 추가
        const base = additionalProducts.find((p) => p.id === itemId);
        newItems = [
          ...prev,
          base
            ? { ...base, quantity: newQuantity }
            : { id: itemId, name: "상품", price: 0, quantity: newQuantity },
        ];
      }
      const totals = calculateTotals(newItems);
      setOrderSummary(totals);
      return newItems;
    });
  }

  function handleCheckout() {
    // 주문하기 - 다음 단계로 이동
    navigate("/order/package");
  }

  // Cart.jsx와 동일한 통화 포맷팅
  function formatCurrency(value) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : "0";
  }

  // 동적 스크롤 공간 계산
  function calculateScrollSpace() {
    const totalCards = orderItems.length + additionalProducts.length;
    const padding = 84 * 2; // 좌우 패딩
    const availableWidth = 1440 - padding; // ProductsArea 실제 너비

    // 카드 개수에 따라 적당한 스크롤 공간 제공
    const baseSpace = availableWidth * 0.4; // 기본적으로 화면 너비의 40%
    const cardBasedSpace = totalCards * 40; // 카드당 40px 추가
    const dynamicSpace = baseSpace + cardBasedSpace;

    return Math.max(400, dynamicSpace); // 최소 400px 보장
  }

  // 백엔드 주문 불러오기: 세션 시작 → 주문 전송 → 주문 목록/합계 반영
  useEffect(() => {
    let aborted = false;
    async function fetchOrders() {
      if (!recognizedText) return;
      try {
        const start = await orderService.startSession();
        if (aborted) return;
        const sid = start?.session_id || "";
        const ordered = await orderService.submitOrder(sid, recognizedText);
        console.log("🧾 주문 응답 orders:", ordered?.orders);
        if (aborted) return;
        const mapped = Array.isArray(ordered?.orders)
          ? ordered.orders.map((o) => ({
              id: o.menu_item,
              name: o.menu_item,
              price: Number(o.price || 0),
              quantity: Number(o.quantity || 0),
            }))
          : [];
        setOrderItems(mapped);
        const totalQuantity =
          Number(ordered?.total_items ?? 0) ||
          mapped.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
        const totalPrice =
          Number(ordered?.total_price ?? 0) ||
          mapped.reduce(
            (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0),
            0
          );
        setOrderSummary({ totalQuantity, totalPrice });
      } catch (e) {
        if (!aborted) {
          console.error("주문 불러오기 실패:", e?.message || e);
        }
      }
    }
    fetchOrders();
    return () => {
      aborted = true;
    };
  }, [recognizedText]);

  // 페이지 로드 시 애니메이션 트리거
  useEffect(() => {
    const t1 = setTimeout(() => setShowTopSection(true), 100);
    const t2 = setTimeout(() => setShowOrderSection(true), 400);
    const t3 = setTimeout(() => setAnimateProducts(true), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <Page>
      {/* 안내 섹션 */}
      <GuideSection
        style={{
          transform: showTopSection ? "translateY(0)" : "translateY(100px)",
          opacity: showTopSection ? 1 : 0,
          transition:
            "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease",
        }}
      >
        <ProfileIcon src={profile} alt="프로필" />
        <MessageBubble>
          <MainTitle>다른 음료도 주문하시겠어요?</MainTitle>
          <ExampleText>예시) "응", "아니"</ExampleText>
        </MessageBubble>
      </GuideSection>

      {/* 눌러서 말하기 버튼 */}
      <SpeakButton
        onClick={handleStartVoice}
        style={{
          transform: showTopSection ? "translateY(0)" : "translateY(80px)",
          opacity: showTopSection ? 1 : 0,
          transition:
            "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s, opacity 0.6s ease 0.1s",
        }}
      >
        <SpeakButtonContent>
          <MicIcon src={mikeIcon} alt="마이크" />
          <SpeakButtonText>눌러서 말하기</SpeakButtonText>
        </SpeakButtonContent>
      </SpeakButton>

      {/* 손가락 가이드 */}
      <FingerGuide
        style={{
          transform: showTopSection ? "translateY(0)" : "translateY(60px)",
          opacity: showTopSection ? 1 : 0,
          transition:
            "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s, opacity 0.6s ease 0.2s",
        }}
      >
        <FingerImage src={hand} alt="손가락 가이드" />
      </FingerGuide>

      {/* 하단 주문 내역 영역 */}
      <OrderSection
        style={{
          transform: showOrderSection ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <OrderHeader>
          <OrderTitle>주문 내역</OrderTitle>
          <CancelButton onClick={handleCancelAll}>전체 취소</CancelButton>
        </OrderHeader>

        <ProductsArea>
          {/* 주문된 상품들 */}
          {orderItems.map((item, index) => (
            <ProductCardContainer
              key={item.id}
              $animate={animateProducts}
              $delay={index * 0.2}
            >
              <CartProductCard
                product={item}
                qty={item.quantity}
                onIncrease={(productId) =>
                  handleQuantityChange(productId, item.quantity + 1)
                }
                onDecrease={(productId) =>
                  handleQuantityChange(productId, item.quantity - 1)
                }
              />
            </ProductCardContainer>
          ))}

          {/* 추가 상품들 */}
          {additionalProducts.map((product, index) => {
            const existingItem = orderItems.find(
              (item) => item.id === product.id
            );
            const displayQuantity = existingItem ? existingItem.quantity : 0;

            return (
              <ProductCardContainer
                key={product.id}
                $animate={animateProducts}
                $delay={(orderItems.length + index) * 0.2}
              >
                <CartProductCard
                  product={product}
                  qty={displayQuantity}
                  onIncrease={(productId) =>
                    handleQuantityChange(productId, displayQuantity + 1)
                  }
                  onDecrease={(productId) =>
                    displayQuantity > 0 &&
                    handleQuantityChange(productId, displayQuantity - 1)
                  }
                />
              </ProductCardContainer>
            );
          })}

          {/* 동적 스크롤 공간 */}
          <ScrollSpacer width={calculateScrollSpace()} />
        </ProductsArea>

        {/* 우측 주문 요약 */}
        <OrderSummary
          style={{
            opacity: animateProducts ? 1 : 0,
            transform: animateProducts ? "translateX(0)" : "translateX(50px)",
            transition: "opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s",
          }}
        >
          <OrderDetails>
            <OrderQuantityRow>
              <OrderQuantityLabel>주문 수량</OrderQuantityLabel>
              <OrderDivider />
              <OrderQuantityValue>
                총 {orderSummary.totalQuantity}개
              </OrderQuantityValue>
            </OrderQuantityRow>

            <OrderTotal>
              {formatCurrency(orderSummary.totalPrice)} 원
            </OrderTotal>
          </OrderDetails>

          <OrderButton onClick={handleCheckout}>주문하기</OrderButton>
        </OrderSummary>
      </OrderSection>
    </Page>
  );
}

export default VoiceThreePlusDetails;

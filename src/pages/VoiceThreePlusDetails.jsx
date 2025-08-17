import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  DUMMY_VOICE_ORDER_ITEMS,
  DUMMY_ORDER_SUMMARY,
  DUMMY_ADDITIONAL_PRODUCTS,
} from "../data/VoiceOrderDummy.data";

function VoiceThreePlusDetails() {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState(DUMMY_VOICE_ORDER_ITEMS);
  const [additionalProducts] = useState(DUMMY_ADDITIONAL_PRODUCTS);
  const [orderSummary, setOrderSummary] = useState(DUMMY_ORDER_SUMMARY);
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
      const newItems = prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
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

  // 페이지 로드 시 애니메이션 트리거
  useEffect(() => {
    // 상단 섹션(GuideSection, SpeakButton) 먼저 나타나기
    setTimeout(() => {
      setShowTopSection(true);
    }, 100);

    // 주문 섹션 나타나기
    setTimeout(() => {
      setShowOrderSection(true);
    }, 400);

    // 상품들 순차적으로 나타나기
    setTimeout(() => {
      setAnimateProducts(true);
    }, 900);
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
              animate={animateProducts}
              delay={index * 0.2}
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
                animate={animateProducts}
                delay={(orderItems.length + index) * 0.2}
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

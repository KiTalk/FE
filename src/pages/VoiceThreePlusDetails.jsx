import React, { useState, useEffect, useRef, useMemo } from "react";
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
  OrderTotal,
  OrderButton,
  RecognizedVoiceArea,
  RecognizedTextContainer,
  RecognizedText,
  VoiceRecognitionArea,
  AudioSpectrumContainer,
} from "./VoiceThreePlusDetails.styles";
import CartProductCard from "../components/CartProductCard";
import VoiceRecorder from "../components/VoiceRecorder";
import AudioSpectrum from "../components/AudioSpectrum";
import mikeIcon from "../assets/images/mike-solid.png";
import hand from "../assets/images/hand.png";
import profile from "../assets/images/profile.png";
import { orderService } from "../services/api";
import { getSettings } from "../utils/settingsUtils";
import { orderStorage } from "../utils/storage";
import { useOrderSync } from "../utils/orderSync";
import { goToVoiceError } from "../utils/voiceErrorUtils";

export default function VoiceThreePlusDetails() {
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
  const [sessionId, setSessionId] = useState("");

  const [voiceDetected, setVoiceDetected] = useState(false); // eslint-disable-line no-unused-vars
  const [timeLeft, setTimeLeft] = useState(3);
  const [autoStopTriggered, setAutoStopTriggered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [voiceRecognizedText, setVoiceRecognizedText] = useState("");
  const timerRef = useRef(null);
  const toggleRecordingRef = useRef(null);
  const isRecordingRef = useRef(false);
  const transitionTimerRef = useRef(null);

  const language = useMemo(() => getSettings().defaultLanguage || "ko", []);

  const { syncNow } = useOrderSync(sessionId);

  function handleStartVoice() {
    setTimeLeft(3);
    setAutoStopTriggered(false);
    setVoiceRecognizedText("");
    if (toggleRecordingRef.current) {
      toggleRecordingRef.current();
    }
  }

  async function handleCancelAll() {
    if (sessionId) {
      try {
        await orderService.clearAllOrders(sessionId);
        orderStorage.clearOrders(sessionId);
      } catch (error) {
        console.error("❌ 전체 주문 삭제 실패:", error);
      }
    }

    setOrderItems([]);
    setOrderSummary({ totalQuantity: 0, totalPrice: 0 });

    navigate("/order/voice");
  }

  function calculateTotals(items) {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { totalQuantity, totalPrice };
  }

  async function handleRemoveItem(itemId) {
    const itemToRemove = orderItems.find((item) => item.id === itemId);

    if (itemToRemove && sessionId && itemToRemove.menu_id) {
      try {
        await orderService.removeOrder(sessionId, itemToRemove.menu_id);
      } catch (error) {
        console.error("❌ 주문 삭제 실패:", error);
        return;
      }
    }

    setOrderItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId);
      const totals = calculateTotals(newItems);
      setOrderSummary(totals);

      if (sessionId) {
        orderStorage.saveOrders(sessionId, newItems);
      }

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

      if (sessionId) {
        orderStorage.saveOrders(sessionId, newItems);
      }

      return newItems;
    });
  }

  function handleCheckout() {
    navigate("/order/package");
  }

  function formatCurrency(value) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : "0";
  }

  function calculateScrollSpace() {
    const totalCards = orderItems.length + additionalProducts.length;

    if (totalCards === 0) {
      return 0;
    }

    if (totalCards >= 3) {
      const cardWidth = 381;
      const cardOverlap = 65;

      const totalCardsWidth =
        cardWidth + (cardWidth - cardOverlap) * (totalCards - 1);

      return Math.max(200, totalCardsWidth * 0.3);
    }

    return 0;
  }

  useEffect(() => {
    let aborted = false;
    async function fetchOrders() {
      try {
        // 기존 세션 ID 사용 (VoiceOrder.jsx에서 생성된 세션)
        const sid = sessionStorage.getItem("currentSessionId") || "";
        if (!sid) {
          alert("다시 시작해주세요.");
          navigate("/order/voice");
          return;
        }
        setSessionId(sid);

        // recognizedText가 있으면 새 주문 처리 후 세션 조회, 없으면 바로 세션 조회
        if (recognizedText) {
          const ordered = await orderService.submitOrder(sid, recognizedText);
          console.log("📤 submitOrder API 응답:", ordered);
          if (aborted) return;
        }

        // 항상 getSession API로 최신 주문 내역 조회
        console.log("📋 세션 주문 내역 조회:", sid);
        const sessionData = await orderService.getSession(sid);
        console.log("🧾 세션 주문 내역:", sessionData);
        if (aborted) return;

        const mapped = Array.isArray(sessionData?.orders)
          ? sessionData.orders.map((o) => ({
              id: o.menu_id,
              name: o.menu_item,
              original: o.original,
              price: Number(o.price || 0),
              quantity: Number(o.quantity || 0),
              popular: Boolean(o.popular),
              temp: o.temp,
              menu_id: o.menu_id,
            }))
          : [];
        console.log("🗂️ 매핑된 주문 항목들:", mapped);
        setOrderItems(mapped);
        orderStorage.saveOrders(sid, mapped);

        const totalQuantity = Number(sessionData?.total_items ?? 0);
        const totalPrice = Number(sessionData?.total_price ?? 0);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (
            newTime === 0 &&
            toggleRecordingRef.current &&
            !autoStopTriggered
          ) {
            // 실제 '녹음 중'일 때만 자동 중지 수행
            if (!isRecordingRef.current) {
              return 0;
            }
            setAutoStopTriggered(true);
            setTimeout(() => {
              if (toggleRecordingRef.current && isRecordingRef.current) {
                toggleRecordingRef.current();
              }
            }, 100);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, autoStopTriggered]);

  useEffect(() => {
    setTimeLeft(3);
    setAutoStopTriggered(false);
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (voiceRecognizedText && !isTransitioning) {
      setIsTransitioning(true);
      transitionTimerRef.current = setTimeout(async () => {
        try {
          await syncNow(); // 동기화

          const confirmResult = await orderService.confirmResponse(
            voiceRecognizedText
          );

          if (confirmResult.confirmed) {
            navigate("/order/voice/details/plus", {
              state: { sessionId: sessionId },
            });
          } else {
            navigate("/order/package");
          }
        } catch (error) {
          console.error("❌ 확인 응답 처리 실패:", error);
          goToVoiceError(navigate, { cause: error });
        }
      }, 1000);
    }
  }, [voiceRecognizedText, isTransitioning, navigate, sessionId, syncNow]);

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
      <VoiceRecorder
        language={language}
        disableInterim={true}
        autoStart={false}
        onRecognized={(text) => {
          if (text && text !== voiceRecognizedText) {
            setVoiceRecognizedText(text);
          }
        }}
      >
        {({ isRecording, loading, stream, toggleRecording }) => {
          toggleRecordingRef.current = toggleRecording;
          isRecordingRef.current = isRecording;

          return (
            <>
              <GuideSection
                style={{
                  transform: showTopSection
                    ? "translateY(0)"
                    : "translateY(100px)",
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

              {(isRecording || loading) && !voiceRecognizedText && (
                <VoiceRecognitionArea
                  style={{
                    transform: showTopSection
                      ? "translateY(0)"
                      : "translateY(80px)",
                    opacity: showTopSection ? 1 : 0,
                    transition:
                      "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s, opacity 0.6s ease 0.1s",
                  }}
                >
                  <AudioSpectrumContainer>
                    <AudioSpectrum
                      stream={stream}
                      active={isRecording}
                      width={283}
                      height={98}
                      style={{ width: "100%", height: "100%" }}
                      onVoiceDetected={(v) =>
                        setVoiceDetected((prev) => (prev !== v ? v : prev))
                      }
                      barColor="#223770"
                      numBars={24}
                      barWidth={6}
                      gap={6}
                    />
                  </AudioSpectrumContainer>
                </VoiceRecognitionArea>
              )}

              {voiceRecognizedText && (
                <RecognizedVoiceArea
                  style={{
                    transform: showTopSection
                      ? "translateY(0)"
                      : "translateY(80px)",
                    opacity: isTransitioning ? 0.7 : showTopSection ? 1 : 0,
                    transition:
                      "opacity 0.3s ease, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s",
                  }}
                >
                  <RecognizedTextContainer>
                    <RecognizedText>"{voiceRecognizedText}"</RecognizedText>
                  </RecognizedTextContainer>
                </RecognizedVoiceArea>
              )}

              {!isRecording && !voiceRecognizedText && !loading && (
                <SpeakButton
                  onClick={handleStartVoice}
                  style={{
                    transform: showTopSection
                      ? "translateY(0)"
                      : "translateY(80px)",
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
              )}

              {!isRecording && !loading && !voiceRecognizedText && (
                <FingerGuide
                  style={{
                    transform: showTopSection
                      ? "translateY(0)"
                      : "translateY(60px)",
                    opacity: showTopSection ? 1 : 0,
                    transition:
                      "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s, opacity 0.6s ease 0.2s",
                  }}
                >
                  <FingerImage src={hand} alt="손가락 가이드" />
                </FingerGuide>
              )}
            </>
          );
        }}
      </VoiceRecorder>

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

          <ScrollSpacer width={calculateScrollSpace()} />
        </ProductsArea>

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

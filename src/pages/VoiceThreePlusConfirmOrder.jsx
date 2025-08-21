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
  OrderDivider,
  OrderTotal,
  OrderButton,
  RecognizedVoiceArea,
  RecognizedTextContainer,
  RecognizedText,
  VoiceRecognitionArea,
  AudioSpectrumContainer,
} from "./VoiceThreePlusConfirmOrder.styles";
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

export default function VoiceThreePlusConfirmOrder() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const sessionId =
    state?.sessionId || sessionStorage.getItem("currentSessionId") || "";
  const [orderItems, setOrderItems] = useState([]);
  const [additionalProducts] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    totalQuantity: 0,
    totalPrice: 0,
  });
  const [showOrderSection, setShowOrderSection] = useState(false);
  const [animateProducts, setAnimateProducts] = useState(false);
  const [showTopSection, setShowTopSection] = useState(false);

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
    // 음성 인식 시작 시 타이머 리셋 및 자동중지 플래그 초기화
    setTimeLeft(3);
    setAutoStopTriggered(false);
    setVoiceRecognizedText("");
    if (toggleRecordingRef.current) {
      toggleRecordingRef.current();
    }
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

      // localStorage에 수량 변경 반영
      if (sessionId) {
        orderStorage.updateQuantity(sessionId, itemId, newQuantity);
      }

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

  // 페이지 로드 시 업데이트된 주문 내역 불러오기 (백엔드 응답 대기)
  useEffect(() => {
    let aborted = false;
    async function fetchUpdatedOrders() {
      if (!sessionId) return;
      try {
        console.log("📋 업데이트된 주문 내역 조회 대기 중:", sessionId);

        // 백엔드 응답을 기다리기 위해 잠시 대기
        let retryCount = 0;
        const maxRetries = 10; // 최대 10번 재시도 (10초)

        while (retryCount < maxRetries && !aborted) {
          try {
            const sessionData = await orderService.getSession(sessionId);
            console.log("🧾 세션 주문 내역:", sessionData);

            if (sessionData?.orders && sessionData.orders.length > 0) {
              // 주문 데이터가 있으면 처리
              const mapped = Array.isArray(sessionData.orders)
                ? sessionData.orders.map((o) => ({
                    id: o.menu_item,
                    name: o.menu_item,
                    original: o.original,
                    price: Number(o.price || 0),
                    quantity: Number(o.quantity || 0),
                    popular: Boolean(o.popular),
                    temp: o.temp,
                  }))
                : [];
              setOrderItems(mapped);

              // localStorage에 주문 내역 저장
              orderStorage.saveOrders(sessionId, mapped);

              const totalQuantity = Number(sessionData.total_items ?? 0);
              const totalPrice = Number(sessionData.total_price ?? 0);
              setOrderSummary({ totalQuantity, totalPrice });
              break; // 성공하면 루프 종료
            }
          } catch (error) {
            console.log("재시도 중...", retryCount + 1, error.message);
          }

          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
        }

        if (retryCount >= maxRetries) {
          console.warn("⚠️ 최대 재시도 횟수 초과");
        }
      } catch (e) {
        if (!aborted) {
          console.error("주문 내역 불러오기 실패:", e?.message || e);
        }
      }
    }
    fetchUpdatedOrders();
    return () => {
      aborted = true;
    };
  }, [sessionId]);

  // 3초 타이머 관리
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
              console.warn(
                "⏱️ 카운트다운 종료 시 녹음 상태가 아님 - 자동 중지 스킵"
              );
              return 0;
            }
            setAutoStopTriggered(true);
            setTimeout(() => {
              if (toggleRecordingRef.current && isRecordingRef.current) {
                console.log("⏰ 3초 타이머 완료 - 자동 녹음 중지");
                toggleRecordingRef.current();
              }
            }, 100); // 약간의 지연을 두어 상태 동기화 시간 확보
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

  // 컴포넌트 마운트 시 타이머 시작
  useEffect(() => {
    setTimeLeft(3);
    setAutoStopTriggered(false);
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  // 음성 인식이 완료되면 1초 후 confirm API를 호출하고 결과에 따라 페이지 이동
  useEffect(() => {
    if (voiceRecognizedText && !isTransitioning) {
      setIsTransitioning(true);
      transitionTimerRef.current = setTimeout(async () => {
        try {
          // 최종 주문 완료 전 동기화
          console.log("🔄 최종 주문 완료 전 동기화 중...");
          await syncNow(); // 동기화

          console.log("🔍 확인 응답 분석 중:", voiceRecognizedText);
          const confirmResult = await orderService.confirmResponse(
            voiceRecognizedText
          );
          console.log("📋 확인 응답 결과:", confirmResult);

          if (confirmResult.confirmed) {
            console.log("✅ 긍정 응답 - /order/package로 이동");

            // 긍정 응답 시 주문 완료 페이지로 이동
            navigate("/order/package");
          } else {
            console.log("❌ 부정 응답 - /order/voice/details/plus로 이동");
            // 부정 응답 시 추가 주문 페이지로 이동
            navigate("/order/voice/details/plus", {
              state: { sessionId: sessionId },
            });
          }
        } catch (error) {
          console.error("❌ 확인 응답 처리 실패:", error);
          // 에러 발생 시 기본적으로 /order/package로 이동
          navigate("/order/package");
        }
      }, 1000); // 1초 후 자동 전환
    }
  }, [voiceRecognizedText, isTransitioning, navigate, sessionId, syncNow]);
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
      <VoiceRecorder
        language={language}
        disableInterim={true}
        autoStart={false}
        onRecognized={(text) => {
          // setState during parent render를 피하기 위해 콜백에서만 상태 변경
          if (text && text !== voiceRecognizedText) {
            setVoiceRecognizedText(text);
          }
        }}
      >
        {({ isRecording, loading, stream, toggleRecording }) => {
          // toggleRecording / isRecording을 ref에 저장
          toggleRecordingRef.current = toggleRecording;
          isRecordingRef.current = isRecording;

          return (
            <>
              {/* 안내 섹션 */}
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
                  <MainTitle>추가 되었습니다 이대로 주문할까요?</MainTitle>
                  <ExampleText>예시) "응", "아니"</ExampleText>
                </MessageBubble>
              </GuideSection>

              {/* 녹음 중이거나 변환 중일 때: 음성 인식 영역 */}
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

              {/* 인식된 텍스트가 있을 때: 인식된 텍스트 표시 영역 */}
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

              {/* 녹음 중이 아니고 인식된 텍스트가 없을 때: 눌러서 말하기 버튼 */}
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

              {/* 손가락 가이드 - 음성인식 중이 아닐 때만 표시 */}
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

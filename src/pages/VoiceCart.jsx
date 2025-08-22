import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VoiceRecorder from "../components/VoiceRecorder";
import AudioSpectrum from "../components/AudioSpectrum";
import { getSettings } from "../utils/settingsUtils";
import VoiceProductCard from "../components/VoiceProductCard";
import { apiClient } from "../services/api";

import drink1 from "../assets/images/drink1.png";
import {
  Page,
  HeadingRow,
  HeadingPrimary,
  HeadingSecondary,
  Subtitle,
  PrimaryButton,
  OutlineButton,
  OutlineButtonTop,
  PlusIcon,
  RecognizingText,
} from "./VoiceCart.styles";

export default function VoiceCart() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const recognizedText = useMemo(() => state?.recognized, [state]);
  const [quantity, setQuantity] = useState(1);

  const [orderData, setOrderData] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("4,000원");
  const language = useMemo(() => getSettings().defaultLanguage || "ko", []);
  const [recognizedLive, setRecognizedLive] = useState("");

  // /order/point 이동 시 수량 업데이트 (localStorage 기반)
  const updateQuantityForPoint = useCallback(async () => {
    const sessionId = sessionStorage.getItem("currentSessionId");

    if (!sessionId || !orderData?.order) {
      return;
    }

    // localStorage에서 현재 저장된 수량 가져오기
    const savedQuantity = localStorage.getItem(`quantity_${sessionId}`);
    const currentQuantity = savedQuantity ? parseInt(savedQuantity) : quantity;

    try {
      console.log(
        "📞 포인트 페이지 이동 - 수량 업데이트 API 호출:",
        sessionId,
        currentQuantity
      );
      console.log("📞 orderData.order:", orderData.order);

      const updateData = {
        orders: [
          {
            menu_item: orderData.order.menu_item,
            quantity: currentQuantity,
            temp: orderData.order.temp,
          },
        ],
      };

      console.log("📞 업데이트 요청 데이터:", updateData);

      const response = await apiClient.put(
        `/orders/${sessionId}/patch-update`,
        updateData
      );
      console.log("✅ 포인트 이동 수량 업데이트 완료:", response.data);

      // localStorage 정리
      localStorage.removeItem(`quantity_${sessionId}`);
    } catch (error) {
      console.error("❌ 포인트 이동 수량 업데이트 실패:", error);
      console.error("❌ 에러 응답 상세:", error.response?.data);
      console.error("❌ 요청 데이터:", {
        menu_id: orderData.order.menu_id,
        quantity: currentQuantity,
      });
      // 실패해도 페이지 이동은 진행 (사용자 경험 향상)
    }
  }, [orderData, quantity]);

  // 세션 조회 API 호출
  useEffect(() => {
    async function fetchOrderData() {
      const sessionId = sessionStorage.getItem("currentSessionId");

      if (sessionId) {
        try {
          console.log("🔍 한번에 주문 세션 조회:", sessionId);
          const response = await apiClient.get(
            `/order-at-once/session/${sessionId}`
          );
          console.log("✅ 세션 조회 완료:", response.data);

          const data = response.data;
          setOrderData(data);

          // 주문 데이터가 있으면 상품 정보 설정
          if (data.order) {
            setProductName(data.order.menu_item || recognizedText || "");
            setProductPrice(
              `${data.order.price?.toLocaleString() || "4,000"}원`
            );

            // localStorage에서 저장된 수량 확인 및 초기 저장
            const savedQuantity = localStorage.getItem(`quantity_${sessionId}`);
            const initialQuantity = data.order.quantity || 1;

            if (savedQuantity) {
              // 이미 저장된 수량이 있으면 사용
              setQuantity(parseInt(savedQuantity));
            } else {
              // 처음이면 API에서 받은 수량을 localStorage에 저장
              localStorage.setItem(
                `quantity_${sessionId}`,
                initialQuantity.toString()
              );
              setQuantity(initialQuantity);
              console.log("💾 초기 수량 localStorage 저장:", initialQuantity);
            }
          } else {
            // 주문 데이터가 없으면 기본값 사용
            setProductName(recognizedText || "");
          }
        } catch (error) {
          console.error("❌ 세션 조회 실패:", error);
          // API 실패 시 기본값 사용
          setProductName(recognizedText || "");
        }
      } else {
        // 세션 ID가 없으면 기본값 사용
        setProductName(recognizedText || "");
      }
    }

    fetchOrderData();
  }, [recognizedText]);

  // 음성 인식 완료 시 자동으로 확인 API 호출
  useEffect(() => {
    async function autoConfirm() {
      if (recognizedLive && recognizedLive.trim()) {
        const sessionId = sessionStorage.getItem("currentSessionId");

        // 세션이 없으면 음성 주문 불가능
        if (!sessionId) {
          alert("음성 주문 세션이 없습니다. 다시 시작해주세요.");
          navigate("/order/voice");
          return;
        }

        try {
          console.log("🤖 확인 응답 처리 API 자동 호출:", recognizedLive);
          const response = await apiClient.post("/logic/confirm", {
            menu_item: recognizedLive.trim(),
          });
          console.log("✅ 확인 응답 처리 완료:", response.data);

          if (response.data.confirmed) {
            // confirmed가 true면 수량 업데이트 후 포인트 페이지로 이동
            await updateQuantityForPoint();
            navigate("/order/point");
          } else {
            // confirmed가 false면 뒤로 이동
            navigate(-1);
          }
        } catch (error) {
          console.error("❌ 확인 응답 처리 실패:", error);
          alert("응답 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      }
    }

    autoConfirm();
  }, [recognizedLive, navigate, updateQuantityForPoint]);

  function handleMinus() {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);

    // localStorage에 저장
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (sessionId) {
      localStorage.setItem(`quantity_${sessionId}`, newQuantity.toString());
      console.log("💾 수량 감소 localStorage 저장:", newQuantity);
    }
  }

  function handlePlus() {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);

    // localStorage에 저장
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (sessionId) {
      localStorage.setItem(`quantity_${sessionId}`, newQuantity.toString());
      console.log("💾 수량 증가 localStorage 저장:", newQuantity);
    }
  }

  function handleAddMore() {
    navigate(-1);
  }

  async function handleCheckout() {
    const sessionId = sessionStorage.getItem("currentSessionId");

    // 세션이 없으면 음성 주문 불가능
    if (!sessionId) {
      alert("음성 주문 세션이 없습니다. 다시 시작해주세요.");
      navigate("/order/voice");
      return;
    }

    // 수동 주문하기 - 수량 업데이트 후 Package 페이지로 이동
    if (orderData) {
      await updateQuantityForPoint();

      const totalPrice =
        orderData.order?.price * quantity || orderData.total_price || 0;
      const totalQty = quantity;

      navigate("/order/point", {
        state: {
          totalPrice,
          totalQty,
        },
      });
    }
  }

  return (
    <Page>
      <VoiceRecorder
        language={language}
        onRecognized={(text) => {
          if (text && text !== recognizedLive) setRecognizedLive(text);
        }}
      >
        {({ isRecording, loading, stream, toggleRecording }) => (
          <>
            <HeadingRow>
              <HeadingPrimary>
                {orderData?.order
                  ? `${orderData.order.menu_item || "아메리카노"} ${
                      quantity || 1
                    }개 ${orderData.packaging || "포장"}`
                  : productName || recognizedText}
              </HeadingPrimary>
              <HeadingSecondary>합니다</HeadingSecondary>
            </HeadingRow>

            <Subtitle>이대로 주문할까요?</Subtitle>

            <VoiceProductCard
              imageSrc={drink1}
              productName={
                orderData?.order?.menu_item || productName || recognizedText
              }
              productPrice={
                orderData?.order?.price
                  ? `${orderData.order.price.toLocaleString()}원`
                  : productPrice
              }
              quantity={quantity}
              onMinus={handleMinus}
              onPlus={handlePlus}
              orderType={orderData?.packaging || "포장"}
            />

            <OutlineButtonTop onClick={() => navigate(-1)}>
              다시 말하기
            </OutlineButtonTop>

            <OutlineButton onClick={handleAddMore}>
              더 담기 <PlusIcon />
            </OutlineButton>

            <PrimaryButton
              onClick={() => {
                if (isRecording) {
                  toggleRecording();
                }
                handleCheckout();
              }}
            >
              주문하기
            </PrimaryButton>

            {(isRecording || loading) && (
              <>
                <RecognizingText>
                  {recognizedLive ? `“${recognizedLive}”` : "인식중.."}
                </RecognizingText>
                <AudioSpectrum
                  stream={stream}
                  active={isRecording}
                  width={167}
                  height={60}
                  numBars={10}
                  barWidth={6}
                  gap={8}
                  style={{
                    position: "absolute",
                    left: 636,
                    bottom: 60,
                  }}
                />
              </>
            )}
          </>
        )}
      </VoiceRecorder>
    </Page>
  );
}

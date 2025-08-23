import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VoiceRecorder from "../components/VoiceRecorder";
import AudioSpectrum from "../components/AudioSpectrum";
import { getSettings } from "../utils/settingsUtils";
import VoiceProductCard from "../components/VoiceProductCard";
import { apiClient, orderRetryService } from "../services/api";
import { goToVoiceError } from "../utils/voiceErrorUtils";

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
  PackagingButton,
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

  // 현재 온도 가져오기 (localStorage 우선, 그 다음 orderData)
  const getCurrentTemp = useCallback(() => {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (sessionId) {
      const savedTemp = localStorage.getItem(`temp_${sessionId}`);
      if (savedTemp) {
        return savedTemp;
      }
    }
    return orderData?.order?.temp || "hot";
  }, [orderData]);

  // 현재 포장 가져오기 (localStorage 우선, 그 다음 orderData)
  const getCurrentPackaging = useCallback(() => {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (sessionId) {
      const savedPackaging = localStorage.getItem(`packaging_${sessionId}`);
      if (savedPackaging) {
        return savedPackaging;
      }
    }
    return orderData?.packaging || "포장";
  }, [orderData]);

  // HeadingPrimary용 포장 정보 (매장 → 매장식사로 변환)
  const getPackagingForHeading = useCallback(() => {
    const currentPackaging = getCurrentPackaging();
    return currentPackaging === "매장" ? "매장 이용" : currentPackaging;
  }, [getCurrentPackaging]);

  // /order/point 이동 시 수량, 온도, 포장 업데이트 (localStorage 기반)
  const updateQuantityForPoint = useCallback(async () => {
    const sessionId = sessionStorage.getItem("currentSessionId");

    if (!sessionId || !orderData?.order) {
      return;
    }

    // localStorage에서 현재 저장된 수량, 온도, 포장 가져오기
    const savedQuantity = localStorage.getItem(`quantity_${sessionId}`);
    const savedTemp = localStorage.getItem(`temp_${sessionId}`);
    const savedPackaging = localStorage.getItem(`packaging_${sessionId}`);
    const currentQuantity = savedQuantity ? parseInt(savedQuantity) : quantity;
    const currentTemp = savedTemp || orderData.order.temp;
    const currentPackaging = savedPackaging || orderData.packaging;

    try {
      console.log(
        "📞 포인트 페이지 이동 - 수량/온도/포장 업데이트 API 호출:",
        sessionId,
        currentQuantity,
        currentTemp,
        currentPackaging
      );
      console.log("📞 orderData:", orderData);

      // 온도 업데이트 필요 시 API 호출 (localStorage에 값이 있으면 무조건 업데이트)
      if (savedTemp) {
        console.log("🌡️ 온도 변경 감지 - 온도 업데이트 API 호출:", savedTemp);

        try {
          const tempResponse = await orderRetryService.updateTemp(
            sessionId,
            savedTemp
          );
          console.log("✅ 온도 업데이트 완료:", tempResponse);
          // 서버 응답을 반영하여 UI 상태를 최신으로 유지
          setOrderData((prev) => ({
            ...prev,
            order: {
              ...prev.order,
              temp: tempResponse?.temp || savedTemp,
            },
          }));
        } catch (tempError) {
          console.error("❌ 온도 업데이트 실패:", tempError);
          // 온도 업데이트 실패해도 다음 단계 진행
        }
      }

      // 포장 업데이트 필요 시 API 호출 (localStorage에 값이 있으면 무조건 업데이트)
      if (savedPackaging) {
        console.log(
          "📦 포장 변경 감지 - 포장 업데이트 API 호출:",
          savedPackaging
        );

        try {
          const packagingResponse = await orderRetryService.updatePackaging(
            sessionId,
            savedPackaging === "매장" ? "매장식사" : savedPackaging
          );
          console.log("✅ 포장 업데이트 완료:", packagingResponse);
        } catch (packagingError) {
          console.error("❌ 포장 업데이트 실패:", packagingError);
          // 포장 업데이트 실패해도 다음 단계 진행
        }
      }

      // 변경사항 반영 후 임시 저장값 정리 (수량은 서버에 별도 단계에서 처리될 수 있어 유지)
      localStorage.removeItem(`temp_${sessionId}`);
      localStorage.removeItem(`packaging_${sessionId}`);
    } catch (error) {
      console.error("❌ 포인트 이동 업데이트 실패:", error);
      console.error("❌ 에러 응답 상세:", error.response?.data);
      console.error("❌ 요청 데이터:", {
        menu_id: orderData.order.menu_id,
        quantity: currentQuantity,
        temp: currentTemp,
        packaging: currentPackaging,
      });
      // 실패해도 페이지 이동은 진행 (사용자 경험 향상)
    }
  }, [orderData, quantity]);

  // 세션 조회 API 호출
  const fetchOrderData = useCallback(async () => {
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
          setProductPrice(`${data.order.price?.toLocaleString() || "4,000"}원`);

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
  }, [recognizedText]);

  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

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
          goToVoiceError(navigate, { cause: error });
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

  // 온도 변경 (localStorage에만 저장)
  function handleTempChange() {
    const sessionId = sessionStorage.getItem("currentSessionId");

    if (!sessionId || !orderData?.order) {
      alert("주문 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    const currentTemp = getCurrentTemp();
    const newTemp = currentTemp === "hot" ? "ice" : "hot";

    // localStorage에 변경된 온도 저장
    localStorage.setItem(`temp_${sessionId}`, newTemp);
    console.log("🌡️ 온도 변경 localStorage 저장:", newTemp);

    // UI 강제 업데이트를 위해 상태 변경
    setOrderData((prev) => ({
      ...prev,
      order: {
        ...prev.order,
        temp: newTemp,
      },
    }));
  }

  // 포장 변경 (localStorage에만 저장)
  function handlePackagingChange() {
    const sessionId = sessionStorage.getItem("currentSessionId");

    if (!sessionId || !orderData) {
      alert("주문 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    const currentPackaging = getCurrentPackaging();
    const newPackaging = currentPackaging === "포장" ? "매장" : "포장";

    // localStorage에 변경된 포장 저장
    localStorage.setItem(`packaging_${sessionId}`, newPackaging);
    console.log("📦 포장 변경 localStorage 저장:", newPackaging);

    // UI 강제 업데이트를 위해 상태 변경
    setOrderData((prev) => ({
      ...prev,
      packaging: newPackaging,
    }));
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
                    }개 ${getPackagingForHeading()}`
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
              orderType={getCurrentPackaging()}
              product={{
                ...orderData?.order,
                temp: getCurrentTemp(),
                profileImage: orderData?.order?.profile,
              }}
            />

            <OutlineButtonTop
              onClick={handleTempChange}
              $tempType={getCurrentTemp() === "hot" ? "ice" : "hot"}
            >
              {getCurrentTemp() === "hot" ? "ICE 변경" : "HOT 변경"}
            </OutlineButtonTop>

            <PackagingButton
              onClick={handlePackagingChange}
              $packagingType={
                getCurrentPackaging() === "포장" ? "매장" : "포장"
              }
            >
              {getCurrentPackaging() === "포장"
                ? "매장주문 변경"
                : "포장주문 변경"}
            </PackagingButton>

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

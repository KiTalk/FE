import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VoiceRecorder from "../components/VoiceRecorder";
import AudioSpectrum from "../components/AudioSpectrum";
import { getSettings } from "../utils/settingsUtils";
import VoiceProductCard from "../components/VoiceProductCard";
import { saveCartItems, saveOrderPackage } from "../utils/orderSpec";
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

function VoiceCart() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const recognizedText = useMemo(() => state.recognized, [state]);
  const [quantity, setQuantity] = useState(1);
  const language = useMemo(() => getSettings().defaultLanguage || "ko", []);

  function handleMinus() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function handlePlus() {
    setQuantity((q) => q + 1);
  }

  function handleAddMore() {
    navigate(-1);
  }

  function parseCurrencyToNumber(text) {
    try {
      if (typeof text === "number") return text;
      const digits = String(text ?? "").replace(/[^0-9]/g, "");
      const n = Number(digits || 0);
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  }

  function handleCheckout(recognizedArg) {
    const name = ((recognizedArg ?? recognizedText) || "").trim();
    const unitPrice = parseCurrencyToNumber("4,000원");
    const qty = Number(quantity || 0);
    if (!name || qty <= 0) {
      alert("상품 정보가 올바르지 않습니다.");
      return;
    }

    const totalPrice = unitPrice * qty;
    const totalQty = qty;

    try {
      saveCartItems([
        {
          name,
          price: unitPrice,
          qty,
        },
      ]);
      // 음성 주문 플로우에서는 기본 포장("takeout")으로 저장 후 완료로 이동
      saveOrderPackage({ type: "takeout", totalPrice, totalQty });
      navigate("/order/point");
    } catch (err) {
      console.error(err);
      alert("주문 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <Page>
      <VoiceRecorder language={language}>
        {({ isRecording, loading, stream, recognized, toggleRecording }) => (
          <>
            <HeadingRow>
              <HeadingPrimary>{recognizedText}</HeadingPrimary>
              <HeadingSecondary>합니다</HeadingSecondary>
            </HeadingRow>

            <Subtitle>이대로 주문할까요?</Subtitle>

            <VoiceProductCard
              imageSrc={drink1}
              productName={recognizedText}
              productPrice="4,000원"
              quantity={quantity}
              onMinus={handleMinus}
              onPlus={handlePlus}
              orderType="포장"
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
                  {recognized ? `“${recognized}”` : "인식중.."}
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

export default VoiceCart;

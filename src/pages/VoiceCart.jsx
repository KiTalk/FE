import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VoiceRecorder from "../components/VoiceRecorder";
import AudioSpectrum from "../components/AudioSpectrum";
import { getSettings } from "../utils/settingsUtils";
import VoiceProductCard from "../components/VoiceProductCard";
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

  function handleOrder() {}

  function handleAddMore() {
    navigate(-1);
  }

  return (
    <Page>
      <VoiceRecorder language={language}>
        {({ isRecording, loading, stream, recognized }) => (
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

            <PrimaryButton onClick={handleOrder}>주문하기</PrimaryButton>

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

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import AudioSpectrum from "../components/AudioSpectrum";
import VoiceRecorder from "../components/VoiceRecorder";
import { apiClient } from "../services/api";
import {
  goToVoiceError,
  ensureRecognizedOrError,
} from "../utils/voiceErrorUtils";
import {
  Page,
  Title,
  RecognizedText,
  ExampleBox,
  ExampleHeading,
  ExampleGray,
  DoneButton,
} from "./VoiceRecognize.styles";
import { getSettings } from "../utils/settingsUtils";

export default function VoiceRecognize() {
  const navigate = useNavigate();
  const [voiceDetected, setVoiceDetected] = useState(false); // eslint-disable-line no-unused-vars
  const [recognizedText, setRecognizedText] = useState("");

  const language = useMemo(() => getSettings().defaultLanguage || "ko", []);

  return (
    <Page>
      <VoiceRecorder
        language={language}
        onRecognized={(text) => {
          if (text && text !== recognizedText) setRecognizedText(text);
        }}
      >
        {({ isRecording, loading, error, stream, toggleRecording }) => (
          <>
            <Title>
              {loading
                ? "잠시만 기다려주세요..."
                : isRecording
                ? "인식 중..."
                : "음성 주문"}
            </Title>

            <AudioSpectrum
              stream={stream}
              active={isRecording}
              width={475}
              height={165}
              style={{ position: "absolute", left: 483, top: 253 }}
              onVoiceDetected={(v) =>
                setVoiceDetected((prev) => (prev !== v ? v : prev))
              }
            />

            <ExampleBox>
              <ExampleHeading>예시 문장</ExampleHeading>
              <ExampleGray>“아이스 아메리카노 1잔 포장”</ExampleGray>
            </ExampleBox>

            <RecognizedText>
              {recognizedText ? `“${recognizedText}”` : ""}
            </RecognizedText>

            <BackButton onClick={() => navigate(-1)} />
            <DoneButton
              disabled={loading}
              onClick={async () => {
                if (isRecording) {
                  toggleRecording();
                }

                const sessionId = sessionStorage.getItem("currentSessionId");

                // 세션 ID가 있고 인식된 텍스트가 있으면 한번에 주문 처리 API 호출
                if (sessionId && recognizedText) {
                  try {
                    console.log(
                      "🚀 한번에 주문 처리 API 호출:",
                      sessionId,
                      recognizedText
                    );
                    const response = await apiClient.post(
                      `/order-at-once/process/${sessionId}`,
                      null,
                      { params: { text: recognizedText } }
                    );
                    console.log("✅ 한번에 주문 처리 완료:", response.data);

                    // 주문 완료 후 VoiceCart 페이지로 이동
                    navigate("/order/voice/cart", {
                      state: { recognized: recognizedText },
                    });
                    return;
                  } catch (error) {
                    console.error("❌ 한번에 주문 처리 실패:", error);
                    goToVoiceError(navigate, { cause: error });
                    return;
                  }
                }

                // 기존 로직 (세션 ID가 없거나 인식된 텍스트가 없는 경우)
                if (ensureRecognizedOrError(navigate, recognizedText)) return;

                navigate("/order/voice/cart", {
                  state: { recognized: recognizedText },
                });
              }}
            >
              완료
            </DoneButton>

            {error && (
              <div
                style={{
                  position: "absolute",
                  left: 334,
                  top: 820,
                  color: "#c0392b",
                  fontSize: 20,
                }}
              >
                {error}
              </div>
            )}
          </>
        )}
      </VoiceRecorder>
    </Page>
  );
}

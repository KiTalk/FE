import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import AudioSpectrum from "../components/AudioSpectrum";
import VoiceRecorder from "../components/VoiceRecorder";
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
                ? "변환 중..."
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
              onClick={() => {
                if (isRecording) {
                  toggleRecording();
                }
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

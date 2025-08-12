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

/**
 * Page component that records speech, shows a live audio spectrum, and displays automatic speech-to-text results.
 *
 * Uses the VoiceRecorder render-prop to manage recording/STT; it renders a status Title, an AudioSpectrum visualizer,
 * an example sentence, the recognized text when available, and Back/Done controls. Language is taken from application
 * settings (`getSettings().defaultLanguage` with fallback "ko"). The Done button stops recording if currently recording
 * (by calling the recorder's toggleRecording) or navigates back when not recording. Errors reported by VoiceRecorder
 * are displayed inline.
 *
 * @returns {JSX.Element} The VoiceRecognize page UI.
 */
function VoiceRecognize() {
  const navigate = useNavigate();
  const [voiceDetected, setVoiceDetected] = useState(false); // eslint-disable-line no-unused-vars

  const language = useMemo(() => getSettings().defaultLanguage || "ko", []);
  // 녹음/인식 로직은 VoiceRecorder로 분리됨

  return (
    <Page>
      <VoiceRecorder language={language}>
        {({
          isRecording,
          loading,
          error,
          stream,
          recognized,
          toggleRecording,
        }) => (
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
              {recognized ? `“${recognized}”` : ""}
            </RecognizedText>

            <BackButton onClick={() => navigate(-1)} />
            <DoneButton
              disabled={loading}
              onClick={() => {
                if (isRecording) {
                  toggleRecording();
                } else {
                  navigate(-1);
                }
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

export default VoiceRecognize;

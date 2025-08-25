import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/button/BackButton";
import AudioSpectrum from "../../components/motion/AudioSpectrum";
import VoiceRecorder from "../../components/recode/VoiceRecorder";
import { apiClient } from "../../services/api";
import {
  goToVoiceError,
  ensureRecognizedOrError,
} from "../../utils/voiceErrorUtils";
import {
  Page,
  Title,
  ExampleBox,
  ExampleHeading,
  ExampleGray,
} from "./VoiceRecognize.styles";
import { getSettings } from "../../utils/settingsUtils";

export default function VoiceRecognize() {
  const navigate = useNavigate();
  const [voiceDetected, setVoiceDetected] = useState(false); // eslint-disable-line no-unused-vars
  const [recognizedText, setRecognizedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [autoStopTriggered, setAutoStopTriggered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const processedTextRef = useRef("");
  const toggleRecordingRef = useRef(null);
  const isRecordingRef = useRef(false);
  const transitionTimerRef = useRef(null);
  const loadingRef = useRef(false);

  const language = useMemo(function () {
    return getSettings().defaultLanguage || "ko";
  }, []);

  // 5초 타이머 관리
  useEffect(
    function () {
      if (timeLeft > 0) {
        timerRef.current = setTimeout(function () {
          setTimeLeft(function (prev) {
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
              setTimeout(function () {
                if (toggleRecordingRef.current && isRecordingRef.current) {
                  console.log("⏰ 5초 타이머 완료 - 자동 녹음 중지");
                  toggleRecordingRef.current();
                }
              }, 100); // 약간의 지연을 두어 상태 동기화 시간 확보
            }
            return newTime;
          });
        }, 1000);
      }

      return function () {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    },
    [timeLeft, autoStopTriggered]
  );

  // 컴포넌트 마운트 시 타이머 시작
  useEffect(function () {
    setTimeLeft(5);
    setAutoStopTriggered(false);
  }, []);

  // 음성 인식이 완료되면 1초 후 자동으로 다음 페이지로 이동
  useEffect(
    function () {
      if (recognizedText && !isTransitioning) {
        setIsTransitioning(true);
        transitionTimerRef.current = setTimeout(async function () {
          if (recognizedText && !isProcessing) {
            setIsProcessing(true);
            processedTextRef.current = recognizedText;

            const sessionId = sessionStorage.getItem("currentSessionId");

            // 세션 ID가 있고 인식된 텍스트가 있으면 한번에 주문 처리 API 호출
            if (sessionId && recognizedText) {
              try {
                console.log(
                  "🚀 자동 주문 처리 API 호출:",
                  sessionId,
                  recognizedText
                );
                const response = await apiClient.post(
                  `/order-at-once/process/${sessionId}`,
                  null,
                  { params: { text: recognizedText } }
                );
                console.log("✅ 자동 주문 처리 완료:", response.data);

                // 서버 응답에서 retry가 true이면 VoiceError로 이동
                if (response.data?.retry === true) {
                  console.log("🔄 메뉴 인식 실패, VoiceError로 이동");
                  navigate("/voice-error", {
                    state: {
                      message:
                        response.data?.message ||
                        "메뉴를 인식할 수 없습니다. 다시 말씀해주세요.",
                      recognized: recognizedText,
                    },
                  });
                  return;
                }

                // 주문 완료 후 VoiceCart 페이지로 이동
                navigate("/order/voice/cart", {
                  state: { recognized: recognizedText },
                });
                return;
              } catch (error) {
                console.error("❌ 자동 주문 처리 실패:", error);
                goToVoiceError(navigate, { cause: error });
                return;
              }
            }

            // 기존 로직 (세션 ID가 없거나 인식된 텍스트가 없는 경우)
            if (ensureRecognizedOrError(navigate, recognizedText)) {
              setIsProcessing(false);
              return;
            }

            navigate("/order/voice/cart", {
              state: { recognized: recognizedText },
            });
          }
        }, 1000); // 1초 후 자동 전환
      }
    },
    [recognizedText, isTransitioning, navigate, isProcessing]
  );

  // 자동 종료 이후에도 인식된 텍스트가 없으면 에러 페이지로 이동
  useEffect(
    function () {
      if (autoStopTriggered) {
        const t = setTimeout(function () {
          if (
            !isRecordingRef.current &&
            !loadingRef.current &&
            !recognizedText
          ) {
            goToVoiceError(navigate);
          }
        }, 1200);
        return function () {
          clearTimeout(t);
        };
      }
    },
    [autoStopTriggered, recognizedText, navigate]
  );

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(function () {
    return function () {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  return (
    <Page>
      <VoiceRecorder
        language={language}
        disableInterim={true}
        autoStart={true}
        onRecognized={(text) => {
          if (text && text !== recognizedText) setRecognizedText(text);
        }}
      >
        {({ isRecording, loading, error, stream, toggleRecording }) => {
          // toggleRecording / isRecording을 ref에 저장
          toggleRecordingRef.current = toggleRecording;
          isRecordingRef.current = isRecording;
          loadingRef.current = loading;

          return (
            <>
              <Title>
                {loading
                  ? "잠시만 기다려주세요..."
                  : isProcessing
                  ? "주문 처리 중..."
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
                <ExampleGray>""아이스 아메리카노 1잔 포장""</ExampleGray>
              </ExampleBox>

              <BackButton
                onClick={function () {
                  navigate(-1);
                }}
              />

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
          );
        }}
      </VoiceRecorder>
    </Page>
  );
}

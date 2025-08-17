import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  RecognizedTextContainer,
  RecognizedText,
  RecognizedVoiceArea,
  VoiceRecognitionArea,
  AudioSpectrumContainer,
} from "./VoiceThreePlusRecording.styles";
import BackButton from "../components/BackButton";
import VoiceRecorder from "../components/VoiceRecorder";
import AudioSpectrum from "../components/AudioSpectrum";
import { getSettings } from "../utils/settingsUtils";
import mikeIcon from "../assets/images/mike-solid.png";
import profile from "../assets/images/profile.png";

function VoiceThreePlusRecording() {
  const navigate = useNavigate();
  const [voiceDetected, setVoiceDetected] = useState(false); // eslint-disable-line no-unused-vars
  const [timeLeft, setTimeLeft] = useState(5);
  const [autoStopTriggered, setAutoStopTriggered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const timerRef = useRef(null);
  const toggleRecordingRef = useRef(null);
  const isRecordingRef = useRef(false);
  const transitionTimerRef = useRef(null);

  const language = useMemo(() => getSettings().defaultLanguage || "ko", []);

  function handleBack() {
    navigate(-1);
  }

  // 5초 타이머 관리
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
                console.log("⏰ 5초 타이머 완료 - 자동 녹음 중지");
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
    setTimeLeft(5);
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

  // 음성 인식이 완료되면 1초 후 자동으로 다음 페이지로 이동
  useEffect(() => {
    if (recognizedText && !isTransitioning) {
      setIsTransitioning(true);
      transitionTimerRef.current = setTimeout(() => {
        navigate("/order/voice/details", {
          state: { recognized: recognizedText },
        });
      }, 1000); // 1초 후 자동 전환
    }
  }, [recognizedText, isTransitioning, navigate]);

  return (
    <Page>
      <VoiceRecorder language={language} disableInterim={true}>
        {({
          isRecording,
          loading,
          error,
          stream,
          recognized,
          toggleRecording,
        }) => {
          // toggleRecording / isRecording을 ref에 저장
          toggleRecordingRef.current = toggleRecording;
          isRecordingRef.current = isRecording;

          // recognized 값이 변경되면 state에 저장
          if (recognized && recognized !== recognizedText) {
            setRecognizedText(recognized);
          }

          return (
            <>
              {/* 뒤로가기 버튼 */}
              <BackButton onClick={handleBack} />

              {/* 안내 섹션 */}
              <GuideSection>
                <ProfileIcon src={profile} alt="프로필" />

                <MessageBubble>
                  <MainTitle>주문하실 메뉴를 말씀해 주세요</MainTitle>
                  <ExampleText>
                    예시) 아이스 아메리카노 2잔, 핫 카페라떼 3잔
                  </ExampleText>
                </MessageBubble>
              </GuideSection>

              {/* 녹음 중이거나 변환 중일 때: 음성 인식 영역 */}
              {(isRecording || loading) && !recognizedText && (
                <VoiceRecognitionArea>
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
              {recognizedText && (
                <RecognizedVoiceArea
                  style={{
                    opacity: isTransitioning ? 0.7 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <RecognizedTextContainer>
                    <RecognizedText>"{recognizedText}"</RecognizedText>
                  </RecognizedTextContainer>
                </RecognizedVoiceArea>
              )}

              {/* 녹음 중이 아니고 인식된 텍스트가 없을 때: 눌러서 말하기 버튼 */}
              {!isRecording && !recognizedText && !loading && (
                <SpeakButton
                  onClick={() => {
                    // 수동 시작 시 타이머 리셋 및 자동중지 플래그 초기화
                    setTimeLeft(5);
                    setAutoStopTriggered(false);
                    toggleRecording();
                  }}
                >
                  <SpeakButtonContent>
                    <MicIcon src={mikeIcon} alt="마이크" />
                    <SpeakButtonText>눌러서 말하기</SpeakButtonText>
                  </SpeakButtonContent>
                </SpeakButton>
              )}

              {/* 에러 메시지 */}
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

export default VoiceThreePlusRecording;

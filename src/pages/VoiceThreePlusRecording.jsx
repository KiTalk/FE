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
  const timerRef = useRef(null);
  const toggleRecordingRef = useRef(null);

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
            // 5초가 되면 자동으로 녹음 중지 (중복 방지)
            setAutoStopTriggered(true);
            setTimeout(() => {
              if (toggleRecordingRef.current) {
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

  // 녹음을 자동으로 시작하기 위한 상태
  const [shouldStartRecording, setShouldStartRecording] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트되면 녹음 시작 신호를 보냄
    setShouldStartRecording(true);
  }, []);

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
          // toggleRecording 함수를 ref에 저장
          toggleRecordingRef.current = toggleRecording;

          // 자동 녹음 시작
          if (shouldStartRecording && !isRecording && !loading && !recognized) {
            setShouldStartRecording(false);
            setTimeout(() => toggleRecording(), 100);
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
              {(isRecording || loading) && !recognized && (
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
              {recognized && (
                <RecognizedVoiceArea
                  onClick={() => {
                    // 인식 완료 후 다음 단계로 이동
                    navigate("/order/voice/cart", { state: { recognized } });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <RecognizedTextContainer>
                    <RecognizedText>"{recognized}"</RecognizedText>
                  </RecognizedTextContainer>
                </RecognizedVoiceArea>
              )}

              {/* 녹음 중이 아니고 인식된 텍스트가 없을 때: 눌러서 말하기 버튼 */}
              {!isRecording && !recognized && !loading && (
                <SpeakButton
                  onClick={() => {
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

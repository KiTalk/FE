import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import AudioSpectrum from "../components/AudioSpectrum";
import {
  Page,
  Title,
  RecognizedText,
  ExampleBox,
  ExampleHeading,
  ExampleGray,
  DoneButton,
} from "./VoiceRecognize.styles";
import { AudioRecorder, getAudioDuration } from "../utils/audioUtils";
import { getSettings } from "../utils/settingsUtils";
import { addToHistory } from "../utils/historyUtils";
import { sttService } from "../services/api";

function VoiceRecognize() {
  const navigate = useNavigate();
  const recorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognized, setRecognized] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceDetected, setVoiceDetected] = useState(false); // eslint-disable-line no-unused-vars
  const interimTimerRef = useRef(null);
  const snapshotInFlightRef = useRef(false);

  const language = useMemo(() => getSettings().defaultLanguage || "ko", []);
  const MIN_DURATION_SEC = 1.0; // STT 전송을 위한 최소 녹음 시간

  function extractTextFromSttResponse(raw) {
    if (!raw) return "";

    // 로그 출력으로 디버깅
    console.log("🔍 STT 응답 분석:", raw);

    // 백엔드 응답 구조: { success: true/false, text: "...", error: "..." }
    if (typeof raw === "object") {
      // success가 false인 경우 에러 처리
      if (raw.success === false) {
        throw new Error(raw.error || "STT 변환 실패");
      }

      // success가 true인 경우 text 추출
      if (raw.success === true && typeof raw.text === "string") {
        return raw.text.trim();
      }
    }

    // 기존 다른 응답 구조 지원 (하위 호환성)
    if (typeof raw.text === "string" && raw.text.trim()) return raw.text;
    if (typeof raw.transcript === "string" && raw.transcript.trim())
      return raw.transcript;
    if (typeof raw.recognized_text === "string" && raw.recognized_text.trim())
      return raw.recognized_text;
    if (typeof raw.recognizedText === "string" && raw.recognizedText.trim())
      return raw.recognizedText;

    // 중첩 구조들
    const nested = raw.result || raw.data || raw.payload || {};
    if (typeof nested.text === "string" && nested.text.trim())
      return nested.text;
    if (typeof nested.transcript === "string" && nested.transcript.trim())
      return nested.transcript;

    // 배열 형태 (문장 리스트)
    if (Array.isArray(raw.segments)) {
      const joined = raw.segments
        .map((s) => s.text || s.transcript || "")
        .filter(Boolean)
        .join(" ")
        .trim();
      if (joined) return joined;
    }

    // 응답이 문자열인 경우
    if (typeof raw === "string" && raw.trim()) return raw;

    return "";
  }

  async function toggleRecording() {
    setError("");
    // 안전 장치: 완료 시 임시 전송 타이머 중지
    if (interimTimerRef.current) {
      clearInterval(interimTimerRef.current);
      interimTimerRef.current = null;
    }
    if (!recorderRef.current) {
      recorderRef.current = new AudioRecorder();
      const init = await recorderRef.current.initializeRecording();
      if (!init.success) {
        setError(init.error || "마이크 초기화 실패");
        return;
      }
    }

    if (!isRecording) {
      try {
        recorderRef.current.startRecording();
        setIsRecording(true);
      } catch (e) {
        setError(e.message);
      }
    } else {
      try {
        setLoading(true);
        const audioFile = await recorderRef.current.stopRecording();
        setIsRecording(false);
        if (!audioFile) {
          setError("오디오 파일 생성 실패");
          setLoading(false);
          return;
        }
        console.log("📁 오디오 파일 정보:");
        console.log(`  - 파일명: ${audioFile.name}`);
        console.log(`  - 크기: ${audioFile.size} bytes`);
        console.log(`  - 타입: ${audioFile.type}`);
        console.log(`  - 언어: ${language}`);

        // Duration 체크 (Infinity면 건너뛰기)
        const duration = await getAudioDuration(audioFile);
        console.log(`  - 계산된 재생시간: ${duration}초`);

        if (Number.isFinite(duration) && duration <= 0) {
          setError("유효한 음성 데이터가 아닙니다.");
          setLoading(false);
          return;
        }

        if (Number.isFinite(duration) && duration < MIN_DURATION_SEC) {
          console.warn(
            `⚠️ 녹음 시간이 너무 짧습니다. 최소 ${MIN_DURATION_SEC}초 이상 녹음해주세요.`
          );
          setError(
            `녹음이 너무 짧습니다. 최소 ${MIN_DURATION_SEC}초 이상 말씀해주세요.`
          );
          setLoading(false);
          return;
        }

        // STT API 호출
        console.log("🌐 STT API 호출 시작...");
        const data = await sttService.convertSpeechToText(audioFile, language);
        console.log("📥 STT API 응답:", data);

        const text = extractTextFromSttResponse(data);
        console.log("✅ 추출된 텍스트:", text);

        setRecognized(text);
        if (text) {
          addToHistory(
            {
              text,
              confidence: data?.confidence ?? null,
              language: language, // 백엔드에서 언어를 반환하지 않으므로 요청한 언어 사용
              processingTime: null, // 백엔드에서 처리 시간을 반환하지 않음
            },
            audioFile.name,
            audioFile.size
          );
          console.log("✅ 히스토리에 저장 완료");
        } else {
          console.warn(
            "⚠️ 텍스트가 추출되지 않았습니다. 응답 구조를 확인하세요."
          );
          setError(
            "음성을 인식하지 못했습니다. 더 명확하게 말씀하거나 더 길게 녹음해보세요."
          );
        }
      } catch (e) {
        console.error("❌ 음성 인식 처리 중 오류:", e);
        setError(e.message || "음성 인식 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
  }

  // 2초마다 스냅샷을 생성해서 STT 전송 (녹음 유지)
  const sendInterimSnapshot = useCallback(async () => {
    if (!recorderRef.current || snapshotInFlightRef.current) return;
    snapshotInFlightRef.current = true;
    try {
      const snapshotFile = await recorderRef.current.getSnapshotFile(
        "recording-interim"
      );
      if (!snapshotFile || snapshotFile.size < 2000) return; // 너무 작은 경우 생략

      const data = await sttService.convertSpeechToText(snapshotFile, language);
      const text = extractTextFromSttResponse(data);
      if (text) setRecognized(text);
    } catch (err) {
      // 임시 전송 실패는 UI 에러로 노출하지 않음
      console.warn("Interim STT failed:", err?.message || err);
    } finally {
      snapshotInFlightRef.current = false;
    }
  }, [language]);

  // 페이지 진입 시 자동 녹음 시작
  useEffect(() => {
    let isCancelled = false;

    async function startOnMount() {
      try {
        if (!recorderRef.current) {
          const recorder = new AudioRecorder();
          const init = await recorder.initializeRecording();
          if (!init.success) {
            if (!isCancelled) setError(init.error || "마이크 초기화 실패");
            return;
          }
          recorderRef.current = recorder;
        }

        // 이미 녹음 중이 아니면 시작
        if (!isCancelled) {
          recorderRef.current.startRecording();
          setIsRecording(true);
        }
      } catch (e) {
        if (!isCancelled)
          setError(e.message || "녹음 시작 중 오류가 발생했습니다.");
      }
    }

    startOnMount();

    return () => {
      isCancelled = true;
    };
  }, []);

  // 녹음 상태에 따라 2초 간격 스냅샷 타이머 관리
  useEffect(() => {
    if (isRecording) {
      if (interimTimerRef.current) clearInterval(interimTimerRef.current);
      interimTimerRef.current = setInterval(() => {
        // 음성이 감지될 때만 전송하고 싶다면 voiceDetected를 체크 가능
        sendInterimSnapshot();
      }, 3000);
    } else if (interimTimerRef.current) {
      clearInterval(interimTimerRef.current);
      interimTimerRef.current = null;
    }
    return () => {
      if (interimTimerRef.current) {
        clearInterval(interimTimerRef.current);
        interimTimerRef.current = null;
      }
    };
  }, [isRecording, sendInterimSnapshot]);

  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.cancelRecording();
        recorderRef.current.cleanup();
      }
    };
  }, []);

  // 스펙트럼 로직은 컴포넌트로 분리됨

  return (
    <Page>
      <Title>
        {loading ? "변환 중..." : isRecording ? "인식 중..." : "음성 주문"}
      </Title>

      {/* 오디오 스펙트럼 */}
      <AudioSpectrum
        stream={recorderRef.current?.getStream?.()}
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

      <RecognizedText>{recognized ? `“${recognized}”` : ""}</RecognizedText>

      {/* 자동 시작으로 중앙 토글 버튼은 제거 */}

      <BackButton onClick={() => navigate(-1)} />
      <DoneButton
        disabled={loading}
        onClick={() => {
          if (isRecording) {
            // 녹음 중지 및 STT 처리
            toggleRecording();
          } else {
            // 이미 녹음이 중지된 경우 이전 화면으로
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
    </Page>
  );
}

export default VoiceRecognize;

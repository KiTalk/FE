import React, { useCallback, useEffect, useRef, useState } from "react";
import { AudioRecorder, getAudioDuration } from "../utils/audioUtils";
import { addToHistory } from "../utils/historyUtils";
import { sttService } from "../services/api";

function VoiceRecorder({
  language,
  children,
  disableInterim = false,
  autoStart = true,
  onRecognized,
}) {
  const recorderRef = useRef(null);
  const interimTimerRef = useRef(null);
  const snapshotInFlightRef = useRef(false);

  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recognized, setRecognized] = useState("");

  const MIN_DURATION_SEC = 0.5;

  function extractTextFromSttResponse(raw) {
    if (!raw) return "";
    if (typeof raw === "object") {
      if (raw.success === false) {
        throw new Error(raw.error || "STT 변환 실패");
      }
      if (raw.success === true && typeof raw.text === "string") {
        return raw.text.trim();
      }
    }
    if (typeof raw?.text === "string" && raw.text.trim()) return raw.text;
    if (typeof raw?.transcript === "string" && raw.transcript.trim())
      return raw.transcript;
    if (typeof raw?.recognized_text === "string" && raw.recognized_text.trim())
      return raw.recognized_text;
    if (typeof raw?.recognizedText === "string" && raw.recognizedText.trim())
      return raw.recognizedText;
    const nested = raw?.result || raw?.data || raw?.payload || {};
    if (typeof nested.text === "string" && nested.text.trim())
      return nested.text;
    if (typeof nested.transcript === "string" && nested.transcript.trim())
      return nested.transcript;
    if (Array.isArray(raw?.segments)) {
      const joined = raw.segments
        .map((s) => s.text || s.transcript || "")
        .filter(Boolean)
        .join(" ")
        .trim();
      if (joined) return joined;
    }
    if (typeof raw === "string" && raw.trim()) return raw;
    return "";
  }

  const sendInterimSnapshot = useCallback(async () => {
    if (!recorderRef.current || snapshotInFlightRef.current) return;
    snapshotInFlightRef.current = true;
    try {
      const snapshotFile = await recorderRef.current.getSnapshotFile(
        "recording-interim"
      );
      if (!snapshotFile || snapshotFile.size < 2000) return;
      const data = await sttService.convertSpeechToText(snapshotFile, language);
      const text = extractTextFromSttResponse(data);
      if (text) {
        setRecognized(text);
        if (typeof onRecognized === "function") {
          try {
            onRecognized(text);
          } catch {
            /* no-op */
          }
        }
      }
    } catch {
      // ignore interim errors
    } finally {
      snapshotInFlightRef.current = false;
    }
  }, [language, onRecognized]);

  async function toggleRecording() {
    setError("");
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
        console.log("🛑 녹음 중지 시작...");
        const audioFile = await recorderRef.current.stopRecording();
        setIsRecording(false);

        console.log("📁 오디오 파일 생성 결과:", audioFile);

        if (!audioFile) {
          console.error("❌ 오디오 파일이 null 또는 undefined입니다.");
          setError("오디오 파일 생성 실패: 녹음 데이터가 없습니다.");
          setLoading(false);
          return;
        }

        if (audioFile.size === 0) {
          console.error("❌ 오디오 파일 크기가 0바이트입니다.");
          setError("오디오 파일 생성 실패: 녹음 데이터가 비어있습니다.");
          setLoading(false);
          return;
        }

        console.log("📁 오디오 파일 정보:");
        console.log(`  - 파일명: ${audioFile.name}`);
        console.log(`  - 크기: ${audioFile.size} bytes`);
        console.log(`  - 타입: ${audioFile.type}`);
        console.log(`  - 언어: ${language}`);

        const duration = await getAudioDuration(audioFile);
        console.log(`  - 계산된 재생시간: ${duration}초`);

        if (Number.isFinite(duration) && duration <= 0) {
          setError("유효한 음성 데이터가 아닙니다.");
          setLoading(false);
          return;
        }

        if (Number.isFinite(duration) && duration < MIN_DURATION_SEC) {
          console.warn(
            `⚠️ 녹음 시간이 짧습니다 (${duration.toFixed(
              2
            )}초). 최소 ${MIN_DURATION_SEC}초 권장됩니다.`
          );
          // 짧은 녹음도 허용하되 경고만 표시
          console.log("📤 짧은 녹음이지만 STT 처리를 계속 진행합니다.");
        }

        console.log("🌐 STT API 호출 시작...");
        const data = await sttService.convertSpeechToText(audioFile, language);
        console.log("📥 STT API 응답:", data);

        const text = extractTextFromSttResponse(data);
        console.log("✅ 추출된 텍스트:", text);

        setRecognized(text);
        if (text && typeof onRecognized === "function") {
          try {
            onRecognized(text);
          } catch {
            /* no-op */
          }
        }
        if (text) {
          addToHistory(
            {
              text,
              confidence: data?.confidence ?? null,
              language: language,
              processingTime: null,
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
        if (!isCancelled && autoStart) {
          recorderRef.current.startRecording();
          setIsRecording(true);
        }
      } catch (e) {
        if (!isCancelled)
          setError(e?.message || "녹음 시작 중 오류가 발생했습니다.");
      }
    }
    startOnMount();
    return () => {
      isCancelled = true;
    };
  }, [autoStart]);

  useEffect(() => {
    // disableInterim이 true면 중간 스냅샷을 비활성화
    if (isRecording && !disableInterim) {
      if (interimTimerRef.current) clearInterval(interimTimerRef.current);
      interimTimerRef.current = setInterval(() => {
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
  }, [isRecording, sendInterimSnapshot, disableInterim]);

  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        try {
          recorderRef.current.cancelRecording();
          recorderRef.current.cleanup();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const stream = recorderRef.current?.getStream?.();

  return children({
    isRecording,
    loading,
    error,
    stream,
    recognized,
    toggleRecording,
  });
}

export default VoiceRecorder;

// 음성 녹음 관련 유틸리티
export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.stream = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.recordingStartTime = null;
    this.actualMimeType = null; // 실제 사용된 MIME 타입 저장
  }

  // 마이크 권한 요청 및 스트림 초기화
  async initializeRecording() {
    try {
      // 네이버 STT API 최적화 설정
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 22050, // 22.05kHz (네이버 STT 권장)
          channelCount: 1, // 모노 채널 (필수)
          echoCancellation: true, // 에코 제거
          noiseSuppression: true, // 노이즈 제거
          autoGainControl: true, // 자동 게인 조절
          latency: 0.1, // 낮은 지연시간
        },
      });

      return { success: true };
    } catch (error) {
      console.error("마이크 접근 오류:", error);

      let message = "마이크에 접근할 수 없습니다.";

      if (error.name === "NotAllowedError") {
        message =
          "마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.";
      } else if (error.name === "NotFoundError") {
        message =
          "마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.";
      } else if (error.name === "NotSupportedError") {
        message = "이 브라우저에서는 음성 녹음을 지원하지 않습니다.";
      }

      return { success: false, error: message };
    }
  }

  // 녹음 시작
  startRecording() {
    if (!this.stream) {
      throw new Error("녹음을 초기화해주세요.");
    }

    this.audioChunks = [];
    this.recordingStartTime = Date.now();

    // MIME 타입 확정 및 저장
    this.actualMimeType = this.getSupportedMimeType();

    const options = {
      mimeType: this.actualMimeType,
      audioBitsPerSecond: 128000, // 128kbps 비트레이트 (네이버 STT 권장)
    };

    this.mediaRecorder = new MediaRecorder(this.stream, options);

    // 데이터 수집 핸들러
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
        console.log(
          `📦 데이터 청크 수집: ${event.data.size} bytes, 총 청크 수: ${this.audioChunks.length}`
        );
      }
    };

    // 오류 핸들러
    this.mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder 오류:", event.error);
    };

    // Start without a timeslice. We'll explicitly flush buffered data via requestData()
    // when creating interim snapshots, so recording can continue seamlessly.
    this.mediaRecorder.start();
    this.isRecording = true;

    console.log(
      `🎙️ 녹음 시작 - MIME: ${this.actualMimeType}, 시작 시간: ${new Date(
        this.recordingStartTime
      ).toLocaleTimeString()}`
    );
  }

  // 녹음 중지 및 오디오 파일 반환
  stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        console.warn("⚠️ MediaRecorder가 초기화되지 않았습니다.");
        resolve(null);
        return;
      }

      if (!this.isRecording) {
        console.warn("⚠️ 현재 녹음 중이 아닙니다.");

        // 이미 수집된 청크가 있다면 파일로 생성 시도
        if (this.audioChunks && this.audioChunks.length > 0) {
          console.log("📦 기존 청크로 파일 생성 시도...");
          const mimeType = this.actualMimeType || this.getSupportedMimeType();
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });

          if (audioBlob.size > 0) {
            const fileName = `recording-${Date.now()}.webm`;
            const audioFile = new File([audioBlob], fileName, {
              type: mimeType,
            });
            console.log(`📁 기존 청크로 파일 생성됨: ${audioFile.size} bytes`);
            resolve(audioFile);
            return;
          }
        }

        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const recordingEndTime = Date.now();
        const actualDuration = recordingEndTime - this.recordingStartTime;

        console.log(
          `🎵 녹음 완료 - 실제 녹음 시간: ${actualDuration}ms (${(
            actualDuration / 1000
          ).toFixed(2)}초)`
        );
        console.log(`📦 총 수집된 청크 수: ${this.audioChunks.length}`);

        // 수집된 모든 청크의 총 크기 계산
        const totalChunkSize = this.audioChunks.reduce(
          (total, chunk) => total + chunk.size,
          0
        );
        console.log(`📦 총 청크 크기: ${totalChunkSize} bytes`);

        // 실제 녹음에 사용된 MIME 타입 사용 (일관성 보장)
        const mimeType = this.actualMimeType || this.getSupportedMimeType();

        const audioBlob = new Blob(this.audioChunks, {
          type: mimeType,
        });

        // MIME 타입에 따라 파일 확장자 결정 (WebM 우선)
        let extension = "webm"; // 기본값을 webm으로 변경
        if (mimeType.includes("webm")) {
          extension = "webm";
        } else if (mimeType.includes("wav")) {
          extension = "wav";
        } else if (mimeType.includes("ogg")) {
          extension = "ogg";
        } else if (mimeType.includes("mpeg") || mimeType.includes("mp3")) {
          extension = "mp3";
        } else if (mimeType.includes("mp4")) {
          extension = "mp4";
        } else if (mimeType.includes("flac")) {
          extension = "flac";
        }

        const fileName = `recording-${Date.now()}.${extension}`;
        const audioFile = new File([audioBlob], fileName, {
          type: mimeType,
        });

        console.log(`🎵 오디오 파일 생성됨:`);
        console.log(`  - 파일명: ${fileName}`);
        console.log(`  - MIME 타입: ${mimeType}`);
        console.log(
          `  - 최종 파일 크기: ${audioFile.size} bytes (${(
            audioFile.size / 1024
          ).toFixed(1)} KB)`
        );
        console.log(`  - 확장자: ${extension}`);
        console.log(
          `  - 실제 녹음 시간: ${(actualDuration / 1000).toFixed(2)}초`
        );
        console.log(`  - 청크 수: ${this.audioChunks.length}`);

        // 파일 유효성 추가 검증
        if (audioFile.size < 1000) {
          console.warn("⚠️ 경고: 오디오 파일 크기가 매우 작습니다.");
        }
        if (actualDuration < 500) {
          console.warn("⚠️ 경고: 녹음 시간이 매우 짧습니다.");
        }

        this.isRecording = false;
        resolve(audioFile);
      };

      this.mediaRecorder.stop();
    });
  }

  // 현재까지 수집된 청크를 기반으로 스냅샷 파일 생성 (녹음은 지속)
  // 원본 청크 배열을 건드리지 않으며, MediaRecorder.requestData()로 버퍼를 플러시합니다.
  async getSnapshotFile(prefix = "recording-snapshot") {
    if (!this.isRecording || !this.mediaRecorder) {
      return null;
    }

    try {
      if (typeof this.mediaRecorder.requestData === "function") {
        // Flush pending data into ondataavailable
        this.mediaRecorder.requestData();
      }
    } catch {
      // no-op
    }

    // 잠시 대기하여 requestData()로 밀어넣은 버퍼가 수집되도록 함
    await new Promise((resolve) => setTimeout(resolve, 10));

    if (!this.audioChunks || this.audioChunks.length === 0) {
      return null;
    }

    const mimeType = this.actualMimeType || this.getSupportedMimeType();
    const audioBlob = new Blob(this.audioChunks, { type: mimeType });

    let extension = "webm";
    if (mimeType.includes("webm")) extension = "webm";
    else if (mimeType.includes("wav")) extension = "wav";
    else if (mimeType.includes("ogg")) extension = "ogg";
    else if (mimeType.includes("mpeg") || mimeType.includes("mp3"))
      extension = "mp3";
    else if (mimeType.includes("mp4")) extension = "mp4";
    else if (mimeType.includes("flac")) extension = "flac";

    const fileName = `${prefix}-${Date.now()}.${extension}`;
    const snapshotFile = new File([audioBlob], fileName, { type: mimeType });

    return snapshotFile;
  }

  // 녹음 취소
  cancelRecording() {
    console.log("🛑 녹음 취소 시작");

    if (this.mediaRecorder && this.isRecording) {
      try {
        this.mediaRecorder.stop();
      } catch (error) {
        console.warn("MediaRecorder 중지 중 오류:", error);
      }
      this.isRecording = false;
    }

    // 스트림 정리 (중요!)
    if (this.stream) {
      this.stream.getTracks().forEach(function (track) {
        track.stop();
        console.log(`📻 트랙 중지됨: ${track.kind}`);
      });
    }

    this.audioChunks = [];
    console.log("🛑 녹음 취소 완료");
  }

  // 현재 사용 중인 MediaStream 반환 (시각화 등 용도)
  getStream() {
    return this.stream;
  }

  // 스트림 정리
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(function (track) {
        return track.stop();
      });
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.recordingStartTime = null;
    this.actualMimeType = null;

    console.log("🧹 AudioRecorder 정리 완료");
  }

  // 지원되는 MIME 타입 확인 (네이버 STT API 호환성 우선)
  getSupportedMimeType() {
    const types = [
      "audio/webm;codecs=opus", // WebM Opus 우선 (네이버 STT 최적화)
      "audio/webm", // WebM 기본
      "audio/wav", // WAV (백엔드 지원)
      "audio/ogg", // OGG (백엔드 지원)
      "audio/mpeg", // MP3 (백엔드 지원)
      "audio/mp4", // AAC (백엔드 지원) - 우선순위 낮춤
      "audio/flac", // FLAC (백엔드 지원)
    ];

    console.log("브라우저 MIME 타입 지원 상태:");
    types.forEach(function (type) {
      const supported = MediaRecorder.isTypeSupported(type);
      console.log(`${type}: ${supported ? "✅ 지원" : "❌ 미지원"}`);
    });

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log(`선택된 MIME 타입: ${type}`);
        return type;
      }
    }

    console.log("기본값 사용: audio/wav");
    return "audio/wav"; // 기본값을 WAV로 변경
  }

  // 녹음 지원 여부 확인
  static isRecordingSupported() {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.MediaRecorder
    );
  }
}

// 오디오 파일 재생 시간 계산
export function getAudioDuration(file) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      console.log(`⏱️ 오디오 메타데이터 로드됨:`);
      console.log(`  - 파일 크기: ${file.size} bytes`);
      console.log(`  - 재생 시간: ${audio.duration}초`);
      console.log(`  - MIME 타입: ${file.type}`);
      resolve(audio.duration);
    };
    audio.onerror = (error) => {
      console.error("❌ 오디오 메타데이터 로드 실패:", error);
      resolve(0);
    };
    audio.src = URL.createObjectURL(file);
  });
}

// 오디오 블롭 크기 검증
export function validateAudio(audioBlob) {
  const minSize = 10000; // 10KB

  if (audioBlob.size < minSize) {
    throw new Error("음성 데이터가 너무 작습니다. 조금 더 길게 녹음해주세요.");
  }

  return true;
}

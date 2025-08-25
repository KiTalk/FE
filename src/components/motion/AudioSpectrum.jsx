import React, { useEffect, useRef } from "react";

export default function AudioSpectrum({
  stream,
  active = true,
  width = 475,
  height = 165,
  style,
  onVoiceDetected,
  numBars = 48,
  barWidth = 8,
  gap = 10,
  barColor = "#223770",
  minBarHeight = 8,
  smoothing = 0.2, // 0~1, 높을수록 반응 빠름
  threshold = 0.02, // 음성 감지 임계값 (더 민감)
  amplify = 2.1, // 막대 높이 증폭 계수
  curve = 0.5,
}) {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);
  const heightsRef = useRef([]);

  useEffect(
    function () {
      if (!active || !stream) {
        stopSpectrum();
        return;
      }

      try {
        const audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
        audioCtxRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const freqArray = new Uint8Array(bufferLength);
        const timeArray = new Uint8Array(analyser.fftSize);
        const canvas = canvasRef.current;
        const canvasCtx = canvas?.getContext("2d");
        if (!canvas || !canvasCtx)
          return function () {
            return stopSpectrum();
          };

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        const CENTER_Y = Math.floor(HEIGHT / 2);
        const totalBars = Math.max(1, Math.min(numBars, 256));
        const binsPerBar = Math.max(1, Math.floor(bufferLength / totalBars));
        const totalWidth = totalBars * barWidth + (totalBars - 1) * gap;
        const startX = Math.floor((WIDTH - totalWidth) / 2);
        const maxBarHeight = Math.max(minBarHeight, Math.floor(HEIGHT * 0.85));
        heightsRef.current = new Array(totalBars).fill(minBarHeight);

        function drawRoundedRect(ctx, x, y, w, h, r, color) {
          const radius = Math.min(r, Math.floor(Math.min(w, h) / 2));
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + w - radius, y);
          ctx.arcTo(x + w, y, x + w, y + radius, radius);
          ctx.lineTo(x + w, y + h - radius);
          ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
          ctx.lineTo(x + radius, y + h);
          ctx.arcTo(x, y + h, x, y + h - radius, radius);
          ctx.lineTo(x, y + radius);
          ctx.arcTo(x, y, x + radius, y, radius);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        }

        function draw() {
          rafRef.current = requestAnimationFrame(draw);

          analyser.getByteTimeDomainData(timeArray);
          let sumSquares = 0;
          for (let i = 0; i < timeArray.length; i++) {
            const centered = timeArray[i] - 128;
            sumSquares += centered * centered;
          }
          const rms = Math.sqrt(sumSquares / timeArray.length) / 128;
          const isVoice = rms > threshold;
          if (typeof onVoiceDetected === "function") onVoiceDetected(isVoice);

          analyser.getByteFrequencyData(freqArray);

          // 투명 배경 유지: 이전 프레임을 지우기만 함
          canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

          // 막대 값 집계 및 스무딩
          for (let i = 0; i < totalBars; i++) {
            const start = i * binsPerBar;
            const end = Math.min(bufferLength, start + binsPerBar);
            let sum = 0;
            for (let j = start; j < end; j++) sum += freqArray[j];
            const avg = sum / Math.max(1, end - start);
            // 감도 향상: 곡선/증폭 적용으로 작은 소리도 크게 반응
            const norm = avg / 255; // 0~1
            const curved = Math.pow(norm, Math.max(0.05, Math.min(1, curve)));
            const boosted = Math.min(1, curved * Math.max(1, amplify));
            const target = Math.max(minBarHeight, boosted * maxBarHeight);
            const prev = heightsRef.current[i] ?? minBarHeight;
            const next = prev + (target - prev) * smoothing;
            heightsRef.current[i] = next;
          }

          // 막대 그리기 (중앙 기준 상하 대칭 둥근 직사각형)
          let x = startX;
          for (let i = 0; i < totalBars; i++) {
            const h = Math.min(maxBarHeight, heightsRef.current[i]);
            const y = CENTER_Y - h / 2;
            drawRoundedRect(
              canvasCtx,
              x,
              Math.floor(y),
              barWidth,
              Math.floor(h),
              Math.floor(barWidth / 2),
              barColor
            );
            x += barWidth + gap;
          }
        }

        draw();
      } catch {
        // ignore visualization errors
      }

      return () => stopSpectrum();
    },
    [stream, active] // eslint-disable-line react-hooks/exhaustive-deps
  );

  function stopSpectrum() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // ignore
      }
    }
    analyserRef.current = null;
    audioCtxRef.current = null;
    rafRef.current = null;
  }

  return <canvas ref={canvasRef} width={width} height={height} style={style} />;
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkImg from "../assets/images/check.png";
import {
  Page,
  Frame,
  Title,
  Subtitle,
  CheckImage,
} from "./OrderComplete.styles";

export default function OrderCompletePage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // localStorage 스냅샷 수집
    function collectLocalStorageSnapshot() {
      const snapshot = {};
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (!key) continue;
        const rawValue = localStorage.getItem(key);
        try {
          snapshot[key] = JSON.parse(rawValue);
        } catch {
          snapshot[key] = rawValue;
        }
      }
      return snapshot;
    }

    // localStorage 초기화 (안전 처리)
    function clearLocalStorageSafe() {
      try {
        localStorage.clear();
      } catch (error) {
        console.error("localStorage 초기화 실패", error);
      }
    }

    // 현재 localStorage의 모든 키-값을 객체로 정리
    const storageSnapshot = collectLocalStorageSnapshot();
    console.log(storageSnapshot); /* 추후 삭제 */

    // 전송 여부와 관계 없이 localStorage 초기화
    clearLocalStorageSafe();

    // 카운트다운 타이머 시작
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [navigate]);

  return (
    <Page>
      <CheckImage src={checkImg} alt="" aria-hidden="true" />
      <Frame>
        <Title>주문이 완료되었습니다</Title>
        <Subtitle>{countdown}초 뒤에 처음 화면으로 돌아갑니다</Subtitle>
      </Frame>
    </Page>
  );
}

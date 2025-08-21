import React, { useEffect } from "react";
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

    // 지연 후 홈으로 이동 예약하고 타이머 id 반환
    function scheduleNavigateHome(delayMs) {
      const timerId = setTimeout(() => {
        navigate("/", { replace: true });
      }, delayMs);
      return timerId;
    }

    // 현재 localStorage의 모든 키-값을 객체로 정리
    const storageSnapshot = collectLocalStorageSnapshot();
    console.log(storageSnapshot); /* 추후 삭제 */

    // 임시: 백엔드 전송 코드 예시 (주석처리)
    // import apiClient from "../services/api";
    // import { API_ENDPOINTS } from "../config/api";
    // (async () => {
    //   try {
    //     await apiClient.post(API_ENDPOINTS.ORDER_COMPLETE, storageSnapshot);
    //   } catch (error) {
    //     console.error("주문 완료 데이터 전송 실패", error);
    //   }
    // })();

    // 전송 여부와 관계 없이 localStorage 초기화
    clearLocalStorageSafe();

    // 4초 후 홈으로 이동
    const timerId = scheduleNavigateHome(4000);

    return () => clearTimeout(timerId);
  }, [navigate]);

  return (
    <Page>
      <CheckImage src={checkImg} alt="" aria-hidden="true" />
      <Frame>
        <Title>주문이 완료되었습니다</Title>
        <Subtitle>결제는 직원에게 직접 해주세요</Subtitle>
      </Frame>
    </Page>
  );
}

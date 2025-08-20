import { useState, useMemo, useCallback } from "react";
import {
  extractDigits,
  formatKoreanPhone,
  isValidKoreanPhone,
  canAddDigit,
  removeLastDigit,
} from "../utils/phoneUtils";

/**
 * 전화번호 입력을 위한 커스텀 훅
 * @param {object} options - 옵션 설정
 * @param {string} options.initialValue - 초기값 (기본값: "010")
 * @param {number} options.maxLength - 최대 길이 (기본값: 11)
 * @param {number} options.minLength - 최소 길이 (기본값: 3)
 * @returns {object} - 전화번호 입력 관련 상태와 함수들
 */
export function usePhoneInput(options = {}) {
  const { initialValue = "010", maxLength = 11, minLength = 3 } = options;

  const [digits, setDigits] = useState(initialValue);

  // 포맷된 전화번호 (010-1234-5678 형태로 분리)
  const formatted = useMemo(() => {
    return formatKoreanPhone(digits);
  }, [digits]);

  // 원본 숫자 문자열 (하이픈 등 제거)
  const cleanDigits = useMemo(() => {
    return extractDigits(digits);
  }, [digits]);

  // 유효성 검사
  const isValid = useMemo(() => {
    return isValidKoreanPhone(digits);
  }, [digits]);

  // 저장 가능 여부 (11자리 완성 여부)
  const canSave = useMemo(() => {
    return cleanDigits.length === maxLength;
  }, [cleanDigits.length, maxLength]);

  // 숫자 추가
  const addDigit = useCallback(
    (digit) => {
      setDigits((prev) => {
        const cleaned = extractDigits(prev);
        if (!canAddDigit(cleaned, maxLength)) return prev;
        return cleaned + String(digit);
      });
    },
    [maxLength]
  );

  // 마지막 숫자 제거 (백스페이스)
  const backspace = useCallback(() => {
    setDigits((prev) => {
      return removeLastDigit(prev, minLength);
    });
  }, [minLength]);

  // 전체 초기화
  const reset = useCallback(() => {
    setDigits(initialValue);
  }, [initialValue]);

  // 특정 값으로 설정
  const setValue = useCallback((value) => {
    setDigits(value);
  }, []);

  // 키패드 클릭 핸들러 (통합)
  const handleKeypadClick = useCallback(
    (event) => {
      const btn = event.currentTarget;
      const action = btn.getAttribute("data-action");
      const numAttr = btn.getAttribute("data-num");

      if (action === "backspace") {
        backspace();
        return;
      }

      if (numAttr != null) {
        const digit = Number(numAttr);
        if (!isNaN(digit)) {
          addDigit(digit);
        }
      }
    },
    [addDigit, backspace]
  );

  return {
    // 상태
    digits,
    cleanDigits,
    formatted,
    isValid,
    canSave,

    // 액션
    addDigit,
    backspace,
    reset,
    setValue,
    handleKeypadClick,

    // 유틸리티
    length: cleanDigits.length,
    isEmpty: cleanDigits.length === 0,
    isFull: cleanDigits.length >= maxLength,
  };
}

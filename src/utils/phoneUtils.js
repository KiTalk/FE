/**
 * 전화번호 관련 유틸리티 함수들
 */

/**
 * 전화번호 문자열을 숫자만 추출
 * @param {string} phone - 전화번호 문자열
 * @returns {string} - 숫자만 포함된 문자열
 */
export function extractDigits(phone) {
  if (typeof phone !== "string") return "";
  return phone.replace(/\D/g, "");
}

/**
 * 전화번호를 한국 형식으로 포맷팅 (010-1234-5678)
 * @param {string} digits - 숫자만 포함된 전화번호
 * @returns {object} - { head, mid, tail } 형태의 포맷된 전화번호
 */
export function formatKoreanPhone(digits) {
  const cleanDigits = extractDigits(digits);
  const head = "010";
  const rest = cleanDigits.startsWith("010")
    ? cleanDigits.slice(3)
    : cleanDigits;
  const mid = rest.slice(0, 4);
  const tail = rest.slice(4, 8);

  return { head, mid, tail };
}

/**
 * 전화번호가 유효한지 검증
 * @param {string} digits - 숫자만 포함된 전화번호
 * @returns {boolean} - 유효성 여부
 */
export function isValidKoreanPhone(digits) {
  const cleanDigits = extractDigits(digits);
  return cleanDigits.length === 11 && cleanDigits.startsWith("010");
}

/**
 * 전화번호를 하이픈이 포함된 문자열로 변환
 * @param {string} digits - 숫자만 포함된 전화번호
 * @returns {string} - 하이픈이 포함된 전화번호 (예: 010-1234-5678)
 */
export function formatPhoneWithHyphens(digits) {
  const { head, mid, tail } = formatKoreanPhone(digits);
  if (!mid && !tail) return head;
  if (!tail) return `${head}-${mid}`;
  return `${head}-${mid}-${tail}`;
}

/**
 * 전화번호 입력 길이 제한 검증
 * @param {string} currentDigits - 현재 입력된 숫자
 * @param {number} maxLength - 최대 길이 (기본값: 11)
 * @returns {boolean} - 추가 입력 가능 여부
 */
export function canAddDigit(currentDigits, maxLength = 11) {
  const cleanDigits = extractDigits(currentDigits);
  return cleanDigits.length < maxLength;
}

/**
 * 전화번호에서 마지막 숫자 제거 (단, 010은 유지)
 * @param {string} currentDigits - 현재 입력된 숫자
 * @param {number} minLength - 최소 길이 (기본값: 3 - '010' 유지)
 * @returns {string} - 숫자가 제거된 전화번호
 */
export function removeLastDigit(currentDigits, minLength = 3) {
  const cleanDigits = extractDigits(currentDigits);
  if (cleanDigits.length <= minLength) return currentDigits;
  return cleanDigits.slice(0, -1);
}

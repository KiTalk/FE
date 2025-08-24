// 클립보드 관련 유틸리티

// 클립보드에 텍스트 복사
export async function copyToClipboard(text) {
  if (!text) {
    throw new Error("복사할 텍스트가 없습니다.");
  }

  try {
    // 모던 브라우저의 Clipboard API 사용
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // 구형 브라우저를 위한 fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch {
      document.body.removeChild(textArea);
      throw new Error("클립보드 복사에 실패했습니다.");
    }
  } catch (error) {
    console.error("클립보드 복사 오류:", error);
    throw error;
  }
}

// 클립보드 지원 여부 확인
export function isClipboardSupported() {
  return !!(
    navigator.clipboard ||
    (document.queryCommandSupported && document.queryCommandSupported("copy"))
  );
}

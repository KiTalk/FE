// 클립보드 관련 유틸리티

// 텍스트를 클립보드에 복사
export const copyToClipboard = async (text) => {
  try {
    // 최신 Clipboard API 사용 (HTTPS 필요)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    }

    // 폴백: document.execCommand 사용
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (successful) {
      return { success: true };
    } else {
      throw new Error("복사 실패");
    }
  } catch (error) {
    console.error("클립보드 복사 오류:", error);
    return {
      success: false,
      error:
        "클립보드에 복사할 수 없습니다. 브라우저가 지원하지 않거나 권한이 없습니다.",
    };
  }
};

// 클립보드 지원 여부 확인
export const isClipboardSupported = () => {
  return !!(navigator.clipboard || document.execCommand);
};

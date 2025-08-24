// 설정 관리 유틸리티

const SETTINGS_KEY = "stt_settings";

// 기본 설정
const DEFAULT_SETTINGS = {
  defaultLanguage: "ko",
  autoCopy: false,
  theme: "light",
  saveHistory: true,
  maxHistorySize: 50,
  showConfidence: true,
  showProcessingTime: true,
  autoDownload: false,
  notificationSound: true,
  compactMode: false,
};

// 설정 조회
export function getSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error("설정 로드 실패:", error);
  }
  return DEFAULT_SETTINGS;
}

// 설정 저장
export function saveSettings(newSettings) {
  try {
    const currentSettings = getSettings();
    const mergedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(mergedSettings));
    return true;
  } catch (error) {
    console.error("설정 저장 실패:", error);
    return false;
  }
}

// 개별 설정 업데이트
export function updateSetting(key, value) {
  try {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, [key]: value };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    return true;
  } catch (error) {
    console.error("설정 업데이트 실패:", error);
    return false;
  }
}

// 설정 초기화
export function resetSettings() {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    return true;
  } catch (error) {
    console.error("설정 초기화 실패:", error);
    return false;
  }
}

// 설정 내보내기
export function exportSettings() {
  try {
    const settings = getSettings();
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kitalk-settings-${
      new Date().toISOString().split("T")[0]
    }.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("설정 내보내기 실패:", error);
    return false;
  }
}

// 설정 가져오기
export function importSettings(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = function (event) {
        try {
          const importedSettings = JSON.parse(event.target.result);

          // 기본 설정과 병합
          const currentSettings = getSettings();
          const mergedSettings = { ...currentSettings, ...importedSettings };

          // 유효성 검사
          if (validateSettings(mergedSettings)) {
            saveSettings(mergedSettings);
            resolve(true);
          } else {
            reject(new Error("잘못된 설정 파일입니다."));
          }
        } catch (parseError) {
          reject(new Error("설정 파일 파싱에 실패했습니다."));
        }
      };

      reader.onerror = function () {
        reject(new Error("파일 읽기에 실패했습니다."));
      };

      reader.readAsText(file);
    } catch (error) {
      reject(new Error("파일 처리 중 오류가 발생했습니다."));
    }
  });
}

// 테마 적용
export function applyTheme(theme) {
  try {
    const root = document.documentElement;

    // 기존 테마 클래스 제거
    root.classList.remove("theme-light", "theme-dark", "theme-auto");

    // 새 테마 클래스 추가
    root.classList.add(`theme-${theme}`);

    // CSS 변수 설정
    if (theme === "dark") {
      root.style.setProperty("--bg-primary", "#1a1a1a");
      root.style.setProperty("--text-primary", "#ffffff");
    } else if (theme === "light") {
      root.style.setProperty("--bg-primary", "#ffffff");
      root.style.setProperty("--text-primary", "#000000");
    }

    return true;
  } catch (error) {
    console.error("테마 적용 실패:", error);
    return false;
  }
}

// 설정 유효성 검사
export function validateSettings(settings) {
  try {
    // 필수 필드 확인
    const requiredFields = ["defaultLanguage", "theme", "autoSave"];
    for (const field of requiredFields) {
      if (!(field in settings)) {
        return false;
      }
    }

    // 언어 설정 유효성
    if (!["ko", "en", "ja", "zh"].includes(settings.defaultLanguage)) {
      return false;
    }

    // 테마 설정 유효성
    if (!["light", "dark", "auto"].includes(settings.theme)) {
      return false;
    }

    // 자동 저장 설정 유효성
    if (typeof settings.autoSave !== "boolean") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

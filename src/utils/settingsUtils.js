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
export const getSettings = () => {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    const parsed = settings ? JSON.parse(settings) : {};

    // 기본 설정과 병합
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    console.error("설정 조회 오류:", error);
    return DEFAULT_SETTINGS;
  }
};

// 설정 저장
export const saveSettings = (newSettings) => {
  try {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));

    return updatedSettings;
  } catch (error) {
    console.error("설정 저장 오류:", error);
    return null;
  }
};

// 개별 설정 업데이트
export const updateSetting = (key, value) => {
  try {
    const settings = getSettings();
    settings[key] = value;

    return saveSettings(settings);
  } catch (error) {
    console.error("설정 업데이트 오류:", error);
    return null;
  }
};

// 설정 초기화
export const resetSettings = () => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("설정 초기화 오류:", error);
    return DEFAULT_SETTINGS;
  }
};

// 설정 내보내기
export const exportSettings = () => {
  try {
    const settings = getSettings();
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `stt-settings-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("설정 내보내기 오류:", error);
    return false;
  }
};

// 설정 가져오기
export const importSettings = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);

          // 유효성 검증
          if (
            typeof importedSettings !== "object" ||
            importedSettings === null
          ) {
            throw new Error("잘못된 설정 파일 형식입니다.");
          }

          // 알려진 설정 키만 추출
          const validSettings = {};
          Object.keys(DEFAULT_SETTINGS).forEach((key) => {
            // eslint-disable-next-line no-prototype-builtins
            if (importedSettings.hasOwnProperty(key)) {
              validSettings[key] = importedSettings[key];
            }
          });

          const updatedSettings = saveSettings(validSettings);
          resolve(updatedSettings);
        } catch (parseError) {
          reject(
            new Error("설정 파일을 파싱할 수 없습니다: " + parseError.message)
          );
        }
      };

      reader.onerror = () => {
        reject(new Error("파일을 읽을 수 없습니다."));
      };

      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
};

// 테마 적용
export const applyTheme = (theme) => {
  try {
    document.documentElement.setAttribute("data-theme", theme);
    updateSetting("theme", theme);
    return true;
  } catch (error) {
    console.error("테마 적용 오류:", error);
    return false;
  }
};

// 설정 검증
export const validateSettings = (settings) => {
  const errors = [];

  // 기본 언어 검증
  const validLanguages = ["ko", "en", "ja", "zh"];
  if (!validLanguages.includes(settings.defaultLanguage)) {
    errors.push("유효하지 않은 기본 언어입니다.");
  }

  // 테마 검증
  const validThemes = ["light", "dark"];
  if (!validThemes.includes(settings.theme)) {
    errors.push("유효하지 않은 테마입니다.");
  }

  // 히스토리 크기 검증
  if (settings.maxHistorySize < 1 || settings.maxHistorySize > 1000) {
    errors.push("히스토리 크기는 1-1000 사이여야 합니다.");
  }

  // 불린 값 검증
  const booleanKeys = [
    "autoCopy",
    "saveHistory",
    "showConfidence",
    "showProcessingTime",
    "autoDownload",
    "notificationSound",
    "compactMode",
  ];
  booleanKeys.forEach((key) => {
    if (typeof settings[key] !== "boolean") {
      errors.push(`${key}는 불린 값이어야 합니다.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

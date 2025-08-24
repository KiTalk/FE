// 히스토리 관리 유틸리티

const HISTORY_KEY = "stt_history";
const MAX_HISTORY_SIZE = 50;

// 히스토리 항목 구조
// {
//   id: string,
//   timestamp: number,
//   text: string,
//   confidence: number,
//   language: string,
//   processingTime: number,
//   fileName?: string,
//   fileSize?: number
// }

// 히스토리 조회
export function getHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 히스토리에 항목 추가
export function addToHistory(result, fileName = null, fileSize = null) {
  try {
    const history = getHistory();
    const newEntry = {
      id: generateId(),
      timestamp: Date.now(),
      text: result.text || result.transcript || result.recognized_text || "",
      confidence: result.confidence || null,
      language: result.language || "ko",
      processingTime: result.processingTime || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
    };

    // 최신 항목을 맨 앞에 추가
    const updatedHistory = [newEntry, ...history];

    // 최대 100개 항목만 유지
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_SIZE);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    return newEntry;
  } catch (error) {
    console.error("히스토리 저장 실패:", error);
    return null;
  }
}

// 히스토리 항목 삭제
export function removeFromHistory(itemId) {
  try {
    const history = getHistory();
    const updatedHistory = history.filter((item) => item.id !== itemId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch {
    return false;
  }
}

// 히스토리 전체 삭제
export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch {
    return false;
  }
}

// 히스토리 검색
export function searchHistory(query) {
  try {
    const history = getHistory();
    if (!query || query.trim() === "") return history;

    const searchTerm = query.toLowerCase().trim();
    return history.filter((item) => {
      const text = (item.text || "").toLowerCase();
      return text.includes(searchTerm);
    });
  } catch {
    return [];
  }
}

// 날짜별 히스토리 그룹화
export function groupHistoryByDate(history = null) {
  try {
    const items = history || getHistory();
    const groups = {};

    items.forEach((item) => {
      const date = new Date(item.timestamp);
      const dateKey = date.toDateString();
      const timeKey = date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          timestamp: item.timestamp,
          items: [],
        };
      }

      groups[dateKey].items.push({
        ...item,
        timeKey,
      });
    });

    // 날짜별로 정렬 (최신순)
    return Object.values(groups).sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

// 히스토리 통계
export function getHistoryStats() {
  try {
    const history = getHistory();
    const totalItems = history.length;

    if (totalItems === 0) {
      return {
        totalItems: 0,
        totalText: 0,
        averageConfidence: 0,
        languageDistribution: {},
        averageProcessingTime: 0,
      };
    }

    const totalText = history.reduce(
      (sum, item) => sum + (item.text?.length || 0),
      0
    );
    const confidenceValues = history
      .map((item) => item.confidence)
      .filter((c) => c !== null && !isNaN(c));
    const averageConfidence =
      confidenceValues.length > 0
        ? confidenceValues.reduce((sum, c) => sum + c, 0) /
          confidenceValues.length
        : 0;

    const languageDistribution = history.reduce((acc, item) => {
      const lang = item.language || "unknown";
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

    const processingTimes = history
      .map((item) => item.processingTime)
      .filter((t) => t !== null && !isNaN(t));
    const averageProcessingTime =
      processingTimes.length > 0
        ? processingTimes.reduce((sum, t) => sum + t, 0) /
          processingTimes.length
        : 0;

    return {
      totalItems,
      totalText,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      languageDistribution,
      averageProcessingTime: Math.round(averageProcessingTime * 100) / 100,
    };
  } catch {
    return {
      totalItems: 0,
      totalText: 0,
      averageConfidence: 0,
      languageDistribution: {},
      averageProcessingTime: 0,
    };
  }
}

// ID 생성
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 날짜 포맷팅
export function formatDate(timestamp) {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "오늘";
    } else if (diffInDays === 1) {
      return "어제";
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
    }
  } catch {
    return "알 수 없음";
  }
}

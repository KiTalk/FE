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
export const getHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("히스토리 조회 오류:", error);
    return [];
  }
};

// 히스토리에 항목 추가
export const addToHistory = (result, fileName = null, fileSize = null) => {
  try {
    const history = getHistory();

    const historyItem = {
      id: generateId(),
      timestamp: Date.now(),
      text: result.text,
      confidence: result.confidence,
      language: result.language,
      processingTime: result.processingTime,
      fileName: fileName,
      fileSize: fileSize,
    };

    // 새 항목을 맨 앞에 추가
    history.unshift(historyItem);

    // 최대 크기 제한
    if (history.length > MAX_HISTORY_SIZE) {
      history.splice(MAX_HISTORY_SIZE);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    return historyItem;
  } catch (error) {
    console.error("히스토리 추가 오류:", error);
    return null;
  }
};

// 히스토리 항목 삭제
export const removeFromHistory = (itemId) => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter((item) => item.id !== itemId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error("히스토리 삭제 오류:", error);
    return false;
  }
};

// 히스토리 전체 삭제
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error("히스토리 초기화 오류:", error);
    return false;
  }
};

// 히스토리 검색
export const searchHistory = (query) => {
  try {
    const history = getHistory();
    const lowerQuery = query.toLowerCase();

    return history.filter(
      (item) =>
        item.text.toLowerCase().includes(lowerQuery) ||
        (item.fileName && item.fileName.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error("히스토리 검색 오류:", error);
    return [];
  }
};

// 날짜별 히스토리 그룹화
export const groupHistoryByDate = (history = null) => {
  try {
    const items = history || getHistory();
    const groups = {};

    items.forEach((item) => {
      const date = new Date(item.timestamp);
      const dateKey = date.toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(item);
    });

    return groups;
  } catch (error) {
    console.error("히스토리 그룹화 오류:", error);
    return {};
  }
};

// 히스토리 통계
export const getHistoryStats = () => {
  try {
    const history = getHistory();

    if (history.length === 0) {
      return {
        totalCount: 0,
        totalProcessingTime: 0,
        averageConfidence: 0,
        languageDistribution: {},
        recentActivity: [],
      };
    }

    const stats = {
      totalCount: history.length,
      totalProcessingTime: history.reduce(
        (sum, item) => sum + (item.processingTime || 0),
        0
      ),
      averageConfidence:
        history.reduce((sum, item) => sum + (item.confidence || 0), 0) /
        history.length,
      languageDistribution: {},
      recentActivity: history.slice(0, 10), // 최근 10개
    };

    // 언어별 분포
    history.forEach((item) => {
      const lang = item.language || "unknown";
      stats.languageDistribution[lang] =
        (stats.languageDistribution[lang] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error("히스토리 통계 오류:", error);
    return {
      totalCount: 0,
      totalProcessingTime: 0,
      averageConfidence: 0,
      languageDistribution: {},
      recentActivity: [],
    };
  }
};

// ID 생성
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 날짜 포맷팅
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // 1분 미만
  if (diff < 60000) {
    return "방금 전";
  }

  // 1시간 미만
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}분 전`;
  }

  // 1일 미만
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}시간 전`;
  }

  // 1주일 미만
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}일 전`;
  }

  // 그 외
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

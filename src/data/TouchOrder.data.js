// ./src/data/TouchOrder.data.js

export const TABS = [
  { id: "all", label: "모든 메뉴" },
  { id: "coffee", label: "커피" },
  { id: "tea", label: "차" },
  { id: "drink", label: "음료" },
  { id: "dessert", label: "디저트" },
];

export const SECTIONS = [
  { id: "americano", title: "아메리카노" },
  { id: "latte", title: "라떼" },
  { id: "sweet", title: "달달한 커피" },
];

// 섹션별 상품
export const SECTION_PRODUCTS = {
  americano: [
    { id: "americano-ice", name: "아이스 아메리카노", price: 4000, popular: true, temperature: "cold" },
    { id: "americano-hot", name: "핫 아메리카노",   price: 4000, popular: true, temperature: "hot"  },
  ],
  latte: [
    { id: "latte-ice", name: "아이스 카페라떼", price: 4000, popular: true, temperature: "cold" },
    { id: "latte-hot", name: "핫 카페라떼",   price: 4000, popular: true, temperature: "hot"  },
  ],
  sweet: [
    // 온도 표시가 굳이 필요 없으면 temperature 필드 생략 가능
    { id: "vanilla-latte",       name: "바닐라 라떼",    price: 5000, popular: true },
    { id: "caramel-macchiato",   name: "카라멜 마끼아또", price: 5500, popular: true },
  ],
};

/**
 * 탭별로 어떤 섹션을 보여줄지 매핑
 */
export const TAB_SECTIONS = {
  coffee: ["americano", "latte", "sweet"],
  tea: [],
  drink: [],
  dessert: [],
};

// 빠른 조회용 섹션 인덱스
const SECTION_INDEX = SECTIONS.reduce((acc, cur) => {
  acc[cur.id] = cur.title;
  return acc;
}, {});

/**
 * 모든 메뉴(평면 리스트)가 필요할 때 사용
 */
export function getAllProducts() {
  return Object.entries(SECTION_PRODUCTS).flatMap(([sectionId, items]) =>
    items.map(item => ({ ...item, sectionId, sectionTitle: SECTION_INDEX[sectionId] || sectionId }))
  );
}

/**
 * 탭이 'all'이 아니면 섹션별로 그룹화해서 반환
 */
export function getGroupedMenuByTab(tabId) {
  if (tabId === "all") return [];
  const sectionIds = TAB_SECTIONS[tabId] || [];
  return sectionIds.map((id) => ({
    id,
    title: SECTION_INDEX[id] || id,
    products: SECTION_PRODUCTS[id] || [],
  }));
}

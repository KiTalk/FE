export const TABS = [
  { id: "all", label: "모든 메뉴" },
  { id: "coffee", label: "간편 커피" },
  { id: "tea", label: "간편 차" },
  { id: "drink", label: "간편 음료" },
  { id: "dessert", label: "간편 디저트" },
];

export const SECTIONS = [
  { id: "americano", title: "아메리카노" },
  { id: "latte", title: "라떼" },
  { id: "sweet", title: "달달한 커피" },
];

export const SECTION_PRODUCTS = {
  americano: [
    {
      id: "americano-ice",
      name: "아이스 아메리카노",
      price: 4000,
      popular: true,
    },
    { id: "americano-hot", name: "핫 아메리카노", price: 4000, popular: true },
  ],
  latte: [
    { id: "latte-ice", name: "아이스 카페라떼", price: 4000, popular: true },
    { id: "latte-hot", name: "핫 카페라떼", price: 4000, popular: true },
  ],
  sweet: [
    { id: "vanilla-latte", name: "바닐라 라떼", price: 5000, popular: true },
    {
      id: "caramel-macchiato",
      name: "카라멜 마끼아또",
      price: 5500,
      popular: true,
    },
  ],
};
//
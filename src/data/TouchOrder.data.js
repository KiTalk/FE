// src/data/TouchOrderGrouped.data.js

export const MENU_DATA = [
  {
    id: "all",
    label: "모든 메뉴",
    sections: [
      {
        id: "americano",
        title: "아메리카노",
        products: [
          { id: "americano-ice", name: "아이스 아메리카노", price: 4000, popular: true },
          { id: "americano-hot", name: "핫 아메리카노", price: 4000, popular: true },
        ],
      },
      {
        id: "latte",
        title: "라떼",
        products: [
          { id: "latte-ice", name: "아이스 카페라떼", price: 4000, popular: true },
          { id: "latte-hot", name: "핫 카페라떼", price: 4000, popular: true },
        ],
      },
      {
        id: "sweet",
        title: "달달한 커피",
        products: [
          { id: "vanilla-latte-ice", name: "바닐라 라떼", price: 5000, popular: true },
          { id: "caramel-macchiato-ice", name: "카라멜 마끼아또", price: 5500, popular: true },
        ],
      },
    ],
  },
  {
    id: "coffee",
    label: "커피",
    sections: [
      {
        id: "americano",
        title: "아메리카노",
        products: [
          { id: "americano-ice", name: "아이스 아메리카노", price: 4000, popular: true },
          { id: "americano-hot", name: "핫 아메리카노", price: 4000, popular: true },
        ],
      },
      {
        id: "latte",
        title: "라떼",
        products: [
          { id: "latte-ice", name: "아이스 카페라떼", price: 4000, popular: true },
          { id: "latte-hot", name: "핫 카페라떼", price: 4000, popular: true },
        ],
      },
      {
        id: "sweet",
        title: "달달한 커피",
        products: [
          { id: "vanilla-latte-ice", name: "바닐라 라떼", price: 5000, popular: true },
          { id: "caramel-macchiato-ice", name: "카라멜 마끼아또", price: 5500, popular: true },
        ],
      },
    ],
  },
  {
    id: "tea",
    label: "차",
    sections: [
      {
        id: "black-tea",
        title: "홍차",
        products: [
          // all에 없으므로 상품 비움
        ],
      },
    ],
  },
  {
    id: "drink",
    label: "음료",
    sections: [
      {
        id: "ade",
        title: "에이드",
        products: [
          // all에 없으므로 상품 비움
        ],
      },
    ],
  },
  {
    id: "dessert",
    label: "디저트",
    sections: [
      {
        id: "cake",
        title: "케이크",
        products: [
          // all에 없으므로 상품 비움
        ],
      },
    ],
  },
];

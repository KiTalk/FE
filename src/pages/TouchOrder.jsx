import React, { useState, useEffect } from "react"; // ✅ useEffect 추가
import { useNavigate } from "react-router-dom";
import {
  Page,
  Hero,
  HeroInner,
  HeroTitle,
  CartWidget,
  CartIcon,
  CartText,
  CartBadge,
  CartBadgeWrap,
  CartBadgeCount,
  CartArrow,
  CartTextWrap,
  Section,
  SectionTitle,
  ProductRow,
} from "./TouchOrder.styles";
import marketImage from "../assets/images/market.png";
import arrowImage from "../assets/images/arrow.png";
import badgeImage from "../assets/images/badge.png";
import { MENU_DATA } from "../data/TouchOrder.data.js";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";

/* Context */
import CartProvider from "../components/CartProvider.jsx";
import { useCart } from "../components/CartContext";

/* ✅ 최소 유틸: added_total_* 키 전체 삭제 */
function clearAllAddedTotals() {
  if (typeof window === "undefined" || !window.localStorage) return;
  const ls = window.localStorage;
  // 역순 반복: 삭제 중 length 변동 대응
  for (let i = ls.length - 1; i >= 0; i--) {
    const key = ls.key(i);
    if (key && key.startsWith("added_total_")) {
      ls.removeItem(key);
    }
  }
}

export default function TouchOrderPage() {
  return (
    <CartProvider>
      <TouchOrderContent />
    </CartProvider>
  );
}

function TouchOrderContent() {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState("all");
  const { addItem, totalQty } = useCart();

  /* ✅ 중앙 정리: 카트가 비어 있으면 과거 added_total_*를 싹 지움 */
  useEffect(() => {
    if (Number(totalQty ?? 0) === 0) {
      clearAllAddedTotals();
    }
  }, [totalQty]);

  /* 내부 동작 함수 선언식 */
  function handleCartClick() {
    navigate("/order/cart");
  }

  function handleAddToCart(product, quantity) {
    const qty = Number(quantity ?? 1);
    if (!product?.id || qty <= 0) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        popular: !!product.popular,
        temp: product.temp,
      },
      qty
    );
  }

  function makeOnAddHandler(product) {
    return function onAdd({ quantity }) {
      handleAddToCart(product, quantity);
    };
  }

  const activeMenu = MENU_DATA.find(function (menu) {
    return menu.id === activeTabId;
  });

  return (
    <Page>
      <Hero>
        <HeroInner>
          <HeroTitle>무엇을 드시겠어요?</HeroTitle>
          <CartWidget onClick={handleCartClick}>
            <CartTextWrap>
              <CartText>장바구니</CartText>
            </CartTextWrap>
            <CartIcon src={marketImage} alt="장바구니" />
            <CartBadgeWrap>
              <CartBadge src={badgeImage} alt="배지" />
              <CartBadgeCount>{totalQty}</CartBadgeCount>
            </CartBadgeWrap>
            <CartArrow src={arrowImage} alt="열기" />
          </CartWidget>
        </HeroInner>
      </Hero>

      <CategoryTabs
        tabs={MENU_DATA.map(function ({ id, label }) {
          return { id, label };
        })}
        activeId={activeTabId}
        onChange={setActiveTabId}
      />

      {activeMenu?.sections.map(function (section) {
        return (
          <Section key={section.id}>
            <SectionTitle>{section.title}</SectionTitle>
            <ProductRow>
              {section.products.map(function (item) {
                return (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onAdd={makeOnAddHandler(item)}
                  />
                );
              })}
            </ProductRow>
          </Section>
        );
      })}
    </Page>
  );
}

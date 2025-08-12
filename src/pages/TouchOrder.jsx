// ./src/pages/TouchOrder.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Page, Hero, HeroInner, HeroTitle, CartWidget, CartIcon, CartText,
  CartBadge, CartBadgeWrap, CartBadgeCount, CartArrow, CartTextWrap,
  Section, SectionTitle, ProductRow, ScrollArea,
} from "./TouchOrder.styles.js";
import { AddedOverlay } from "../components/Product.styles.js"

import marketImage from "../assets/images/market.png";
import arrowImage from "../assets/images/arrow.png";
import badgeImage from "../assets/images/badge.png";

import { TABS, getAllProducts, getGroupedMenuByTab } from "../data/TouchOrder.data.js";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";

function buildAllProducts() {
  return getAllProducts();
}

export default function TouchOrder() {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  const allProducts = useMemo(buildAllProducts, []);

  // ✅ 상품명과 수량을 받아 알림 + 카운트 증가 (함수 선언식)
  function handleAddToCart(name, quantity) {
    const q = Number(quantity) || 0;
    if (q <= 0) return;
    setCartCount((prev) => prev + q);
    alert(`${name} ${q}개가 장바구니에 추가되었습니다!`);
  }

  function handleCartClick() {
    navigate("/cart");
  }

  const groups = getGroupedMenuByTab(activeTabId);

  // ✅ onAdd에 클로저로 상품명 바인딩
  function renderFlatProduct(p) {
    return (
      <ProductCard
        key={p.id}
        name={p.name}
        price={p.price}
        imageSrc={p.imageSrc}
        isPopular={p.popular}
        temp={p.temperature}
        onAdd={(qty) => handleAddToCart(p.name, qty)}
      />
    );
  }

  function renderGroupProduct(p) {
    return (
      <ProductCard
        key={p.id}
        name={p.name}
        price={p.price}
        imageSrc={p.imageSrc}
        isPopular={p.popular}
        temp={p.temperature}
        onAdd={(qty) => handleAddToCart(p.name, qty)}
      />
    );
  }

  function renderGroup(group) {
    return (
      <Section key={group.id}>
        <SectionTitle>{group.title}</SectionTitle>
        <ProductRow>{group.products.map(renderGroupProduct)}</ProductRow>
      </Section>
    );
  }

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
              <CartBadgeCount>{cartCount}</CartBadgeCount>
            </CartBadgeWrap>
            <CartArrow src={arrowImage} alt="열기" />
          </CartWidget>
        </HeroInner>
      </Hero>

      <CategoryTabs tabs={TABS} activeId={activeTabId} onChange={setActiveTabId} />

      <ScrollArea>
        {activeTabId === "all" ? (
          <Section>
            <SectionTitle>모든 메뉴</SectionTitle>
            <ProductRow>{allProducts.map(renderFlatProduct)}</ProductRow>
          </Section>
        ) : (
          groups.map(renderGroup)
        )}
      </ScrollArea>
    </Page>
  );
}

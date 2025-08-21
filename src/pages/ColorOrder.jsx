import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setMode } from "../utils/orderSpec";
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
} from "./ColorOrder.styles";

import marketImage from "../assets/images/market.png";
import arrowImage from "../assets/images/arrow.png";
import badgeImage from "../assets/images/badge.png";

import { MENU_DATA } from "../data/TouchOrder.data.js";
import CategoryTabs from "../components/CategoryTabs";

import ProductCard from "../components/ProductCard";

import CartProvider from "../components/CartProvider.jsx";
import { useCart } from "../components/CartContext";
import { clearAllAddedTotals } from "../utils/storage";

export default function ColorOrderPage() {
  return (
    <CartProvider>
      <ColorOrderContent />
    </CartProvider>
  );
}

function ColorOrderContent() {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState("all");
  const { addItem, totalQty } = useCart();

  const currentMode = "color";

  useEffect(() => {
    setMode("color");
    if (Number(totalQty ?? 0) === 0) {
      clearAllAddedTotals();
    }
  }, [totalQty]);

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

  const activeMenu = MENU_DATA.find((menu) => menu.id === activeTabId);

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
        tabs={MENU_DATA.map(({ id, label }) => ({ id, label }))}
        activeId={activeTabId}
        onChange={setActiveTabId}
      />

      {activeMenu?.sections.map((section) => (
        <Section key={section.id}>
          <SectionTitle>{section.title}</SectionTitle>

          <ProductRow>
            {section.products.map((item) => (
              <ProductCard
                currentMode={currentMode}
                productId={item.id}
                key={item.id}
                product={item}
                onAdd={makeOnAddHandler(item)}
              />
            ))}
          </ProductRow>
        </Section>
      ))}
    </Page>
  );
}

import React, { useState } from "react";
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

function TouchOrder() {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  function handleAddToCart({ quantity }) {
    setCartCount((prev) => prev + (quantity ?? 1));
  }

  function handleCartClick() {
    navigate("/cart");
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
              <CartBadgeCount>{cartCount}</CartBadgeCount>
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
                key={item.id}
                product={item}
                onAdd={handleAddToCart}
              />
            ))}
          </ProductRow>
        </Section>
      ))}
    </Page>
  );
}

export default TouchOrder;

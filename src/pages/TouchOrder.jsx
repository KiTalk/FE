import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  Hero,
  HeroInner,
  HeroTitle,
  HeroSubtitle,
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
import { TABS, SECTIONS, SECTION_PRODUCTS } from "../data/TouchOrder.data";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";

function TouchOrder() {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  const sectionProducts = useMemo(() => SECTION_PRODUCTS, []);

  function handleAddToCart({ quantity }) {
    // 향후 장바구니 상세 상태로 확장 가능
    setCartCount((prev) => prev + (quantity ?? 1));
  }

  function handleCartClick() {
    navigate("/cart");
  }

  return (
    <Page>
      <Hero>
        <HeroInner>
          <HeroTitle>최고의 선택</HeroTitle>
          <HeroSubtitle>
            모든 메뉴 중 가장 인기있는 상품을 AI가 모아두었어요
          </HeroSubtitle>

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
        tabs={TABS}
        activeId={activeTabId}
        onChange={setActiveTabId}
      />

      {SECTIONS.map((section) => (
        <Section key={section.id}>
          <SectionTitle>{section.title}</SectionTitle>
          <ProductRow>
            {sectionProducts[section.id].map((item) => (
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

///
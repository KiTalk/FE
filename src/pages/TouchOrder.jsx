import React, { useState, useEffect } from "react";
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
import { menuService } from "../services/api.js";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";

import CartProvider from "../components/CartProvider.jsx";
import { useCart } from "../components/CartContext";

function clearAllAddedTotals() {
  if (typeof window === "undefined" || !window.localStorage) return;
  const ls = window.localStorage;
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
  const [menuData, setMenuData] = useState([]); // 빈 배열로 초기화
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem, totalQty } = useCart();

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiMenuData = await menuService.getTransformedMenuData();

        if (apiMenuData && apiMenuData.length > 0) {
          setMenuData(apiMenuData);
          console.log("API에서 메뉴 데이터 로드 성공:", apiMenuData);
        } else {
          console.warn("API에서 메뉴 데이터를 가져오지 못했습니다.");
          setMenuData([]);
        }
      } catch (err) {
        console.error("메뉴 데이터 로드 실패:", err);
        setError(err.message);
        // API 실패 시 빈 배열 사용
        setMenuData([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  useEffect(() => {
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

  const activeMenu = menuData.find(function (menu) {
    return menu.id === activeTabId;
  });

  // 로딩 상태 처리
  if (loading) {
    return (
      <Page>
        <Hero>
          <HeroInner>
            <HeroTitle>메뉴를 불러오는 중...</HeroTitle>
          </HeroInner>
        </Hero>
      </Page>
    );
  }

  // 에러 상태 처리
  if (error && menuData.length === 0) {
    return (
      <Page>
        <Hero>
          <HeroInner>
            <HeroTitle>메뉴를 불러올 수 없습니다</HeroTitle>
            <div
              style={{ textAlign: "center", marginTop: "20px", color: "#666" }}
            >
              서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.
            </div>
          </HeroInner>
        </Hero>
      </Page>
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
              <CartBadgeCount>{totalQty}</CartBadgeCount>
            </CartBadgeWrap>
            <CartArrow src={arrowImage} alt="열기" />
          </CartWidget>
        </HeroInner>
      </Hero>

      <CategoryTabs
        tabs={menuData.map(function ({ id, label }) {
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

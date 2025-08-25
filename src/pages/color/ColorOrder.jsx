import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setMode } from "../../utils/orderSpec";
import {
  Page,
  PageViewport,
  ContentWrapper,
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

import marketImage from "../../assets/images/market.png";
import arrowImage from "../../assets/images/arrow.png";
import badgeImage from "../../assets/images/badge.png";

import { menuService, touchOrderService } from "../../services/api.js";
import CategoryTabs from "../../components/category/CategoryTabs";

import ProductCard from "../../components/card/ProductCard";
import CustomScrollbar from "../../components/motion/CustomScrollbar";
import { clearAllAddedTotals } from "../../utils/storage";

export default function ColorOrderPage() {
  return <ColorOrderContent />;
}

function ColorOrderContent() {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState("all");
  const [menuData, setMenuData] = useState([]); // 빈 배열로 초기화
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [localCart, setLocalCart] = useState({}); // localStorage 기반 장바구니

  const currentMode = "color";

  // ColorIntro에서 선택한 메뉴 타입 확인
  const selectedMenuType = localStorage.getItem("selectedMenuType");

  // 메뉴 데이터 로드
  useEffect(function () {
    async function loadMenuData() {
      try {
        setLoading(true);
        setError(null);
        const apiMenuData = await menuService.getTransformedMenuData();

        if (apiMenuData && apiMenuData.length > 0) {
          // 커피 메뉴를 세분화하는 함수
          function subdivideCoffeeSection(sections) {
            // 커피 섹션을 찾기
            const coffeeSection = sections.find(function (section) {
              return section.title === "커피";
            });
            if (!coffeeSection) return sections;

            // 커피 제품들을 분류
            const americanoProducts = coffeeSection.products.filter(function (
              product
            ) {
              return product.name.includes("아메리카노");
            });
            const latteProducts = coffeeSection.products.filter(function (
              product
            ) {
              return (
                product.name.includes("라떼") &&
                !product.name.includes("아메리카노")
              );
            });
            const otherProducts = coffeeSection.products.filter(function (
              product
            ) {
              return (
                !product.name.includes("아메리카노") &&
                !product.name.includes("라떼")
              );
            });

            // 커피 섹션을 제거하고 세분화된 섹션들로 교체
            const otherSections = sections.filter(function (section) {
              return section.title !== "커피";
            });
            const newCoffeeSections = [];

            if (americanoProducts.length > 0) {
              newCoffeeSections.push({
                id: "americano",
                title: "아메리카노",
                products: americanoProducts,
              });
            }

            if (latteProducts.length > 0) {
              newCoffeeSections.push({
                id: "latte",
                title: "라떼",
                products: latteProducts,
              });
            }

            if (otherProducts.length > 0) {
              newCoffeeSections.push({
                id: "other-coffee",
                title: "달달한 음료",
                products: otherProducts,
              });
            }

            return [...newCoffeeSections, ...otherSections];
          }

          // 모든 카테고리에서 커피 메뉴를 세분화
          const transformedMenuData = apiMenuData.map(function (category) {
            if (category.id === "coffee") {
              // 커피 카테고리의 모든 제품을 수집
              const allCoffeeProducts = category.sections.flatMap(function (
                section
              ) {
                return section.products;
              });

              // 제품을 분류
              const americanoProducts = allCoffeeProducts.filter(function (
                product
              ) {
                return product.name.includes("아메리카노");
              });
              const latteProducts = allCoffeeProducts.filter(function (
                product
              ) {
                return (
                  product.name.includes("라떼") &&
                  !product.name.includes("아메리카노")
                );
              });
              const otherProducts = allCoffeeProducts.filter(function (
                product
              ) {
                return (
                  !product.name.includes("아메리카노") &&
                  !product.name.includes("라떼")
                );
              });

              // 새로운 섹션 구조로 재구성
              const newSections = [];

              if (americanoProducts.length > 0) {
                newSections.push({
                  id: "americano",
                  title: "아메리카노",
                  products: americanoProducts,
                });
              }

              if (latteProducts.length > 0) {
                newSections.push({
                  id: "latte",
                  title: "라떼",
                  products: latteProducts,
                });
              }

              if (otherProducts.length > 0) {
                newSections.push({
                  id: "other-coffee",
                  title: "달달한 음료",
                  products: otherProducts,
                });
              }

              return {
                ...category,
                sections: newSections,
              };
            } else if (category.id === "all") {
              // 모든 메뉴 카테고리에서도 커피 섹션을 세분화
              return {
                ...category,
                sections: subdivideCoffeeSection(category.sections),
              };
            }
            return category;
          });

          setMenuData(transformedMenuData);
          console.log(
            "ColorOrder - API에서 메뉴 데이터 로드 성공:",
            transformedMenuData
          );
        } else {
          console.warn(
            "ColorOrder - API에서 메뉴 데이터를 가져오지 못했습니다."
          );
          setMenuData([]);
        }
      } catch (err) {
        console.error("ColorOrder - 메뉴 데이터 로드 실패:", err);
        setError(err.message);
        // API 실패 시 빈 배열 사용
        setMenuData([]);
      } finally {
        setLoading(false);
      }
    }

    loadMenuData();
  }, []);

  // localStorage에서 장바구니 데이터 로드
  function loadLocalCart() {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) {
      setLocalCart({});
      setCartCount(0);
      return;
    }

    try {
      const cartKey = `touchCart_${sessionId}`;
      const stored = localStorage.getItem(cartKey);
      const cart = stored ? JSON.parse(stored) : {};

      // 총 개수 계산
      const totalQuantity = Object.values(cart).reduce(
        (sum, quantity) => sum + quantity,
        0
      );

      setLocalCart(cart);
      setCartCount(totalQuantity);
    } catch {
      setLocalCart({});
      setCartCount(0);
    }
  }

  // localStorage에 장바구니 데이터 저장
  function saveLocalCart(cart) {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) return;

    try {
      const cartKey = `touchCart_${sessionId}`;
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch {
      // 장바구니 저장 실패 시 무시
    }
  }

  // 컴포넌트 마운트 시 로컬 장바구니 데이터 로드
  useEffect(function () {
    loadLocalCart();
  }, []);

  useEffect(
    function () {
      setMode("color");
      if (Number(cartCount ?? 0) === 0) {
        clearAllAddedTotals();
      }
    },
    [cartCount]
  );

  // 장바구니 버튼 클릭 시 서버에 동기화 후 이동
  async function handleCartClick() {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) {
      navigate("/order-method");
      return;
    }

    try {
      // localStorage의 장바구니 데이터를 서버에 동기화
      await syncCartToServer();
      navigate("/order/cart");
    } catch {
      navigate("/order-method");
    }
  }

  // localStorage 장바구니를 서버에 동기화 (원자성 보장)
  async function syncCartToServer() {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) return;

    // 일괄 업데이트로 원자성 보장
    await touchOrderService.bulkUpdateTouchCart(sessionId, localCart);
  }

  // 특정 제품의 장바구니 수량 조회 (localStorage 기반)
  function getCartQuantity(product) {
    if (!product?.originalId) return 0;
    return localCart[product.originalId] || 0;
  }

  function handleAddToCart(product, quantity) {
    const qty = Number(quantity ?? 1);
    if (!product?.id || qty <= 0) return;

    const sessionId = sessionStorage.getItem("currentSessionId");

    // 세션 ID가 없으면 주문 방법 선택 페이지로 이동
    if (!sessionId) {
      navigate("/order-method");
      return;
    }

    // originalId가 없으면 주문 방법 선택 페이지로 이동
    if (!product.originalId) {
      navigate("/order-method");
      return;
    }

    // localStorage에 장바구니 정보 저장
    const menuId = product.originalId;
    const currentQuantity = localCart[menuId] || 0;
    const newQuantity = currentQuantity + qty;

    const updatedCart = {
      ...localCart,
      [menuId]: newQuantity,
    };

    // 상태 업데이트
    setLocalCart(updatedCart);

    // localStorage에 저장
    saveLocalCart(updatedCart);

    // 총 개수 업데이트
    const totalQuantity = Object.values(updatedCart).reduce(function (sum, q) {
      return sum + q;
    }, 0);
    setCartCount(totalQuantity);
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

  // 커스텀 스크롤바를 위한 고정 요소들 반환
  function getFixedElements() {
    return {
      hero: document.querySelector("[data-hero='color']"),
      tabs: document.querySelector("[data-tabs='color']"),
    };
  }

  return (
    <Page>
      <PageViewport data-viewport="color" style={{ paddingRight: 24 }}>
        <ContentWrapper data-content="color">
          <Hero data-hero="color">
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

          <div data-tabs="color">
            <CategoryTabs
              tabs={menuData.map(function ({ id, label }) {
                return { id, label };
              })}
              activeId={activeTabId}
              onChange={setActiveTabId}
            />
          </div>

          {activeMenu?.sections.map(function (section) {
            return (
              <Section key={section.id}>
                <SectionTitle>{section.title}</SectionTitle>

                <ProductRow>
                  {section.products.map(function (item) {
                    return (
                      <ProductCard
                        currentMode={currentMode}
                        selectedMenuType={selectedMenuType}
                        key={item.id}
                        product={item}
                        cartQty={getCartQuantity(item)}
                        onAdd={makeOnAddHandler(item)}
                      />
                    );
                  })}
                </ProductRow>
              </Section>
            );
          })}
        </ContentWrapper>
      </PageViewport>
      <CustomScrollbar
        viewportSelector="[data-viewport='color']"
        contentSelector="[data-content='color']"
        getFixedElements={getFixedElements}
        positioning={{
          topExtraOffset: 40,
          bottomOffset: 70,
          rightOffset: 65,
        }}
        minThumbHeight={40}
      />
    </Page>
  );
}

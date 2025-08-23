import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "./TouchOrder.styles";
import marketImage from "../assets/images/market.png";
import arrowImage from "../assets/images/arrow.png";
import badgeImage from "../assets/images/badge.png";
import { menuService, touchOrderService } from "../services/api.js";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import CustomScrollbar from "../components/CustomScrollbar";

export default function TouchOrderPage() {
  return <TouchOrderContent />;
}

function TouchOrderContent() {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState("all");
  const [menuData, setMenuData] = useState([]); // 빈 배열로 초기화
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [localCart, setLocalCart] = useState({}); // localStorage 기반 장바구니

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiMenuData = await menuService.getTransformedMenuData();

        if (apiMenuData && apiMenuData.length > 0) {
          setMenuData(apiMenuData);
        } else {
          setMenuData([]);
        }
      } catch (err) {
        setError(err.message);
        // API 실패 시 빈 배열 사용
        setMenuData([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  // localStorage에서 장바구니 데이터 로드
  const loadLocalCart = () => {
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
  };

  // localStorage에 장바구니 데이터 저장
  const saveLocalCart = (cart) => {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) return;

    try {
      const cartKey = `touchCart_${sessionId}`;
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch {
      // 장바구니 저장 실패 시 무시
    }
  };

  // 컴포넌트 마운트 시 로컬 장바구니 데이터 로드
  useEffect(() => {
    loadLocalCart();
  }, []);

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
  const syncCartToServer = async () => {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) return;

    // 일괄 업데이트로 원자성 보장
    await touchOrderService.bulkUpdateTouchCart(sessionId, localCart);
  };

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
    const totalQuantity = Object.values(updatedCart).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
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

  // 커스텀 스크롤바를 위한 고정 요소들 반환
  const getFixedElements = () => {
    return {
      hero: document.querySelector("[data-hero='touch']"),
      tabs: document.querySelector("[data-tabs='touch']"),
    };
  };

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
      <PageViewport data-viewport="touch" style={{ paddingRight: 24 }}>
        <ContentWrapper data-content="touch">
          <Hero data-hero="touch">
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

          <div data-tabs="touch">
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
                    const cartQuantity = getCartQuantity(item);
                    return (
                      <ProductCard
                        key={item.id}
                        product={item}
                        cartQty={cartQuantity}
                        onAdd={makeOnAddHandler(item)}
                        currentMode="touch"
                        selectedMenuType={activeTabId}
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
        viewportSelector="[data-viewport='touch']"
        contentSelector="[data-content='touch']"
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

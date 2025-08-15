// PhoneOrder.jsx
// 화면 구성/디자인 전담. OrderHistory(Headless)에서 받은 데이터를 사용해 렌더링.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Page, Hero, HeroSubtitle, HeroInner, HeroTitle, CartWidget, CartIcon, CartText,
  CartBadge, CartBadgeWrap, CartBadgeCount, CartArrow, CartTextWrap,
  Section, SectionTitle, ProductRow,
  // 주문 내역 섹션 UI
  SubSectionTitle, HistoryDivider,
  HistoryNav, HistoryNavButton, HistoryNavIcon, 
  // '자주 시킨 메뉴' 세로 스크롤용
  FavWrap, FavViewport, FavScrollArea, FavScrollbar, FavTrack, FavThumb,
  // 체크리스트용
  PastListWrap, DateHeader, DateCheck, DateLabel,
  MenuList, MenuRow, MenuCheck, MenuName,
  Stepper, StepBtn, StepValue, Price,
  FooterBar, GhostButton, PrimaryButton,
} from "./PhoneOrder.styles";
import marketImage from "../assets/images/market.png";
import arrowImage from "../assets/images/arrow.png";
import badgeImage from "../assets/images/badge.png";
import backIcon from "../assets/images/button-back.png";
import nextIcon from "../assets/images/button-next.png";
import { MENU_DATA } from "../data/TouchOrder.data.js";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";

/* Context */
import CartProvider from "../components/CartProvider.jsx";
import { useCart } from "../components/CartContext";

/* 컴포넌트 */
import LastFourDigits from "../components/LastFourDigits";
import OrderHistory from "../components/OrderHistory.jsx"; // ← Headless(데이터 전용)

export default function TouchOrderPage() {
  return (
    <CartProvider>
      <TouchOrderContent />
    </CartProvider>
  );
}

/* 컴포넌트 함수 선언식 */
function TouchOrderContent() {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState("orders"); // 주문 내역을 기본 탭으로 시작
  const { addItem, totalQty: _totalQty } = useCart();
  const totalQty = Number.isFinite(_totalQty) ? _totalQty : 0;

  /* 이 페이지에서만 '커피' 탭 숨김 */
  const HIDDEN_TAB_IDS = React.useMemo(function () {
    return new Set(
      MENU_DATA
        .filter(function ({ label }) { return label === "커피"; })
        .map(function ({ id }) { return id; })
    );
  }, []);

  /* 숨김 탭이 활성화되면 기본 탭으로 */
  React.useEffect(function ensureVisibleTab() {
    if (HIDDEN_TAB_IDS.has(activeTabId)) {
      setActiveTabId("all");
    }
  }, [activeTabId, HIDDEN_TAB_IDS]);

  /* 내부 동작 함수 선언식 */
  function handleCartClick() {
    navigate("/order/touch/cart");
  }

  function handleAddToCart(product, quantity) {
    const qty = Number(quantity ?? 1);
    if (!product?.id || qty <= 0) return;
    addItem(
      { id: product.id, name: product.name, price: product.price, popular: !!product.popular, temp: product.temp },
      qty
    );
  }

  function makeOnAddHandler(product) {
    return function onAdd({ quantity }) {
      handleAddToCart(product, quantity);
    };
  }

  // 예시용 번호 (실서비스에서는 API/Context에서 주입)
  function getPhoneNumber() {
    return "01012345678";
  }
  const phoneNumber = getPhoneNumber();

  // 유틸: 현재 transform에서 translateY(px) 안전 추출
  function getCurrentTranslateY(elem) {
    if (!elem) return 0;

    // 1) 인라인 transform 우선, 없으면 computedStyle로
    let transform = (elem.style && elem.style.transform) || "";
    if (!transform && typeof window !== "undefined") {
      const cs = window.getComputedStyle(elem);
      transform = cs.transform || cs.webkitTransform || "";
    }

    // 2) matrix3d(a1..a16) → translateY는 14번째(0-based 13)
    if (transform.startsWith("matrix3d(")) {
      const v = transform.slice(9, -1).split(",");
      return parseFloat(v[13]) || 0;
    }

    // 3) matrix(a,b,c,d,tx,ty) → translateY는 6번째(0-based 5)
    if (transform.startsWith("matrix(")) {
      const v = transform.slice(7, -1).split(",");
      return parseFloat(v[5]) || 0;
    }

    // 4) translateY(...) 또는 translate(x, y)
    const m =
      /translateY\(([-\d.]+)px\)/.exec(transform) ||
      /translate\([^,]+,\s*([-\d.]+)px\)/.exec(transform);
    return m ? parseFloat(m[1]) : 0;
  }

  // '자주 시킨 메뉴' 커스텀 스크롤바(세로) 동기화
  useEffect(function syncFavScrollbar() {
    const viewport = document.getElementById("fav-viewport");
    const thumb = document.getElementById("fav-thumb");
    if (!viewport || !thumb) return;

    let pointerMoveHandler = null;
    let pointerUpHandler = null;

    function updateThumb() {
      const { scrollHeight, clientHeight, scrollTop } = viewport;
      const track = thumb.parentElement;
      const trackHeight = track ? track.offsetHeight : clientHeight || 420;
      const visibleRatio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(40, Math.round(trackHeight * visibleRatio));
      const maxThumbOffset = trackHeight - thumbHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      const top =
        maxScrollTop > 0
          ? Math.round((scrollTop / maxScrollTop) * maxThumbOffset)
          : 0;
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${top}px)`;
    }

    updateThumb();
    viewport.addEventListener("scroll", updateThumb, { passive: true });

    // 드래그로 썸을 움직여 세로 스크롤 조작
    let isDragging = false;
    let startY = 0;
    let startTop = 0;

    function onPointerDown(e) {
      isDragging = true;
      e.preventDefault();
      startY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      startTop = getCurrentTranslateY(thumb);
      pointerMoveHandler = onPointerMove;
      pointerUpHandler = onPointerUp;
      document.addEventListener("pointermove", pointerMoveHandler);
      document.addEventListener("pointerup", pointerUpHandler);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const track = thumb.parentElement;
      const trackHeight = track ? track.offsetHeight : viewport.clientHeight || 420;
      const { scrollHeight, clientHeight } = viewport;
      const visibleRatio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(40, Math.round(trackHeight * visibleRatio));
      const maxThumbOffset = trackHeight - thumbHeight;
      const currentY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      const delta = currentY - startY;
      const nextTop = Math.max(0, Math.min(maxThumbOffset, startTop + delta));
      const maxScrollTop = scrollHeight - clientHeight;
      const scrollTop = (nextTop / (maxThumbOffset || 1)) * maxScrollTop;
      viewport.scrollTop = Number.isFinite(scrollTop) ? scrollTop : 0;
      thumb.style.transform = `translateY(${nextTop}px)`;
    }

    function onPointerUp() {
      isDragging = false;
      if (pointerMoveHandler) document.removeEventListener("pointermove", pointerMoveHandler);
      if (pointerUpHandler) document.removeEventListener("pointerup", pointerUpHandler);
      pointerMoveHandler = null;
      pointerUpHandler = null;
    }

    thumb.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", updateThumb);

    return function cleanup() {
      viewport.removeEventListener("scroll", updateThumb);
      thumb.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", updateThumb);
      if (pointerMoveHandler) document.removeEventListener("pointermove", pointerMoveHandler);
      if (pointerUpHandler) document.removeEventListener("pointerup", pointerUpHandler);
    };
  }, []);

  const activeMenu = MENU_DATA.find(function (menu) { return menu.id === activeTabId; });

  return (
    <Page>
      <Hero>
        <HeroInner>
          <HeroTitle>
            <LastFourDigits phoneNumber={phoneNumber} />님 안녕하세요
          </HeroTitle>
          <HeroSubtitle>과거 주문하신 내역을 확인할 수 있어요.</HeroSubtitle>
          <CartWidget onClick={handleCartClick}>
            <CartTextWrap><CartText>장바구니</CartText></CartTextWrap>
            <CartIcon src={marketImage} alt="장바구니" />
            <CartBadgeWrap>
              <CartBadge src={badgeImage} alt="배지" />
              <CartBadgeCount>{totalQty}</CartBadgeCount>
            </CartBadgeWrap>
            <CartArrow src={arrowImage} alt="열기" />
          </CartWidget>
        </HeroInner>
      </Hero>

      {/* 탭 렌더 */}
      {function renderTabs() {
        const baseTabs = MENU_DATA
          .filter(function ({ label }) { return label !== "커피"; })
          .map(function ({ id, label }) { return { id, label }; });
        const tabs = [{ id: "orders", label: "주문 내역" }].concat(baseTabs);
        return (
          <CategoryTabs
            tabs={tabs}
            activeId={activeTabId}
            onChange={setActiveTabId}
          />
        );
      }()}

      {/* 주문 내역 탭 */}
      {activeTabId === "orders" ? (
        <Section className="orderHistorySection">
          <OrderHistory>
            {function render({
              favorites,
              currentDay,
              canPrev, canNext, handlePrev, handleNext,
              selected, toggleDate, toggleItem, qtyMinus, qtyPlus, getSelectedList,
            }) {
              /* 내부 동작 함수 선언식: 날짜의 전체 선택 여부 */
              function isAllChecked(date) {
                const bucket = selected?.[date] || {};
                const values = Object.values(bucket);
                return values.length > 0 && values.every(function (v) { return !!v.checked; });
              }
              /* 내부 동작 함수 선언식: YYYY-MM-DD → M월 D일 */
              function formatDate(dateStr) {
                const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || "");
                if (!m) return dateStr;
                const mm = parseInt(m[2], 10);
                const dd = parseInt(m[3], 10);
                return `${mm}월 ${dd}일`;
              }

              const favList = Array.isArray(favorites) ? favorites : [];

              return (
                <>
                  {/* 자주 시킨 메뉴: 세로 스크롤 */}
                  <SubSectionTitle>자주 시킨 메뉴</SubSectionTitle>
                  <FavWrap>
                    <FavViewport id="fav-viewport" aria-label="자주 시킨 메뉴 목록">
                      <FavScrollArea>
                        {favList.map(function (item, idx) {
                          const rankLabel = idx < 3 ? `${idx + 1}위` : undefined;
                          return (
                            <ProductCard
                              key={`fav-${item.id}`}
                              product={item}
                              onAdd={makeOnAddHandler(item)}
                              tagLabel={rankLabel}
                            />
                          );
                        })}
                      </FavScrollArea>
                    </FavViewport>
                    <FavScrollbar
                      role="scrollbar"
                      aria-controls="fav-viewport"
                      aria-orientation="vertical"
                    >
                      <FavTrack />
                      <FavThumb id="fav-thumb" tabIndex="0" aria-label="자주 시킨 메뉴 스크롤" />
                    </FavScrollbar>
                  </FavWrap>

                  <HistoryDivider />

                  {/* 과거 주문 내역: 화살표로 날짜 전환 */}
                  <SubSectionTitle>과거 주문 내역</SubSectionTitle>
                  <PastListWrap className="pastListWrap">
                    {!!currentDay && (
                      <>
                        {/* 날짜 전체 선택 */}
                        <DateHeader className="dateHeader">
                          <DateCheck
                            className="dateCheck"
                            checked={isAllChecked(currentDay.date)}
                            onChange={function onToggleDate() { toggleDate(currentDay.date); }}
                          />
                          <DateLabel className="dateLabel">{formatDate(currentDay.date)}</DateLabel>
                          <div />
                        </DateHeader>

                        {/* 메뉴 목록 */}
                        <MenuList className="menuList">
                          {currentDay.items.map(function (it) {
                            const st = (selected?.[currentDay.date]?.[it.id]) || { checked: false, qty: 0 };
                            return (
                              <MenuRow className="menuRow" key={`${currentDay.date}${it.id}`}>
                                <MenuCheck
                                  className="menuCheck"
                                  checked={!!st.checked}
                                  onChange={function onToggleItem() { toggleItem(currentDay.date, it.id); }}
                                />
                                <MenuName className="menuName">{it.name}</MenuName>

                                <Stepper className="menuStepper">
                                  <StepBtn
                                    className="menuMinus"
                                    $type="minus"
                                    aria-label="minus"
                                    onClick={function onQtyMinus() { qtyMinus(currentDay.date, it.id); }}
                                  />
                                  <StepValue className="menuQty">{st.qty ?? 0}</StepValue>
                                  <StepBtn
                                    className="menuPlus"
                                    $type="plus"
                                    aria-label="plus"
                                    onClick={function onQtyPlus() { qtyPlus(currentDay.date, it.id); }}
                                  />
                                </Stepper>

                                <Price className="menuPrice">{it.price.toLocaleString()}원</Price>
                              </MenuRow>
                            );
                          })}
                        </MenuList>
                      </>
                    )}
                  </PastListWrap>

                  {/* 날짜 네비게이션 */}
                  <HistoryNav style={{ justifyContent: "center", marginTop: 24 }}>
                    <HistoryNavButton onClick={handlePrev} disabled={!canPrev()} aria-label="이전 날짜">
                      <HistoryNavIcon src={backIcon} alt="이전" />
                    </HistoryNavButton>
                    <HistoryNavButton onClick={handleNext} disabled={!canNext()} aria-label="다음 날짜">
                      <HistoryNavIcon src={nextIcon} alt="다음" />
                    </HistoryNavButton>
                  </HistoryNav>

                  {/* 하단 버튼 - 섹션 맨 아래(가운데 정렬은 스타일에서 처리) */}
                  <FooterBar className="historyFooter">
                    <GhostButton type="button">처음으로</GhostButton>
                    <PrimaryButton
                      type="button"
                      onClick={function onAddSelectedToCart() {
                        getSelectedList().forEach(function ({ product, quantity }) {
                          const onAdd = makeOnAddHandler(product);
                          onAdd({ product, quantity });
                        });
                      }}
                    >
                      선택한 메뉴 담기
                    </PrimaryButton>
                  </FooterBar>
                </>
              );
            }}
          </OrderHistory>
        </Section>
      ) : (
        (Array.isArray(activeMenu?.sections) ? activeMenu.sections : []).map(function (section) {
          return (
            <Section key={section.id}>
              <SectionTitle>{section.title}</SectionTitle>
              <ProductRow>
                {section.products.map(function (item) {
                  return <ProductCard key={item.id} product={item} onAdd={makeOnAddHandler(item)} />;
                })}
              </ProductRow>
            </Section>
          );
        })
      )}
    </Page>
  );
}

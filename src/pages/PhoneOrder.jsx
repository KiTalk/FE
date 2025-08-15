import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  Hero,
  HeroSubtitle,
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
  // 주문 내역 섹션 UI
  SubSectionTitle,
  SubSectionContext,
  HistoryDivider,
  HistoryNav,
  PaginationDots,
  PaginationDot,
  NavButtons,
  HistoryNavIcon,
  // 페이지 전체 커스텀 스크롤
  PageViewport,
  PageScrollbar,
  PageTrack,
  PageThumb,
  // '자주 시킨 메뉴' 영역
  FavWrap,
  FavViewport,
  FavScrollArea,
  // 체크리스트용
  PastListWrap,
  DateHeader,
  DateCheck,
  DateLabel,
  MenuList,
  MenuRow,
  MenuCheck,
  MenuImage,
  MenuName,
  Stepper,
  StepBtn,
  StepValue,
  Price,
  FooterBar,
  GhostButton,
  PrimaryButton,
  // 일반 태그 대체용
  ContentWrapper,
  TabsContainer,
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
      MENU_DATA.filter(function ({ label }) {
        return label === "커피";
      }).map(function ({ id }) {
        return id;
      })
    );
  }, []);

  /* 숨김 탭이 활성화되면 기본 탭으로 */
  React.useEffect(
    function ensureVisibleTab() {
      if (HIDDEN_TAB_IDS.has(activeTabId)) {
        setActiveTabId("all");
      }
    },
    [activeTabId, HIDDEN_TAB_IDS]
  );

  /* 내부 동작 함수 선언식 */
  function handleCartClick() {
    navigate("/order/phone/cart");
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

  function handleGoToOrderMethod() {
    navigate("/order-method");
  }

  function handleAddSelectedToCart(getSelectedList, clearSelectedItems) {
    getSelectedList().forEach(function ({ product, quantity }) {
      const onAdd = makeOnAddHandler(product);
      onAdd({ product, quantity });
    });
    // 장바구니에 추가한 후 선택 상태 초기화
    if (clearSelectedItems) {
      clearSelectedItems();
    }
  }

  function makeOnAddHandler(product) {
    return function onAdd({ quantity }) {
      handleAddToCart(product, quantity);
    };
  }

  // localStorage에서 주문 상태 가져오기
  const getOrderSpec = () => {
    try {
      const stored = localStorage.getItem("order_spec");
      return stored ? JSON.parse(stored) : {};
    } catch (err) {
      console.error(err);
      return {};
    }
  };

  const orderSpec = getOrderSpec();
  const phoneNumber = orderSpec?.point?.phone || "";

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

  // 페이지 전체 커스텀 스크롤바 동기화
  useEffect(function syncPageScrollbar() {
    const viewport = document.querySelector("[data-viewport='page']");
    const content = document.querySelector("[data-content='page']");
    const hero = document.querySelector("[data-hero='page']");
    const tabsBar = document.querySelector("[data-tabs='page']");
    const scrollbar = document.querySelector("[data-scrollbar='page']");
    const thumb = document.querySelector("[data-thumb='page']");
    if (!viewport || !thumb) return;

    let pointerMoveHandler = null;
    let pointerUpHandler = null;
    let resizeObserver = null;

    function updateThumb() {
      const { scrollHeight, clientHeight, scrollTop } = viewport;
      const track = thumb.parentElement;
      const trackHeight = track ? track.offsetHeight : clientHeight || 420;
      const visibleRatio = clientHeight / (scrollHeight || 1);
      const thumbHeight = Math.max(
        40,
        Math.round(trackHeight * Math.min(1, visibleRatio))
      );
      const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);
      const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
      const top =
        maxScrollTop > 0
          ? Math.round((scrollTop / maxScrollTop) * maxThumbOffset)
          : 0;
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${top}px)`;
    }

    // 페이지 레이아웃(히어로+탭) 높이에 맞춰 커스텀 스크롤바 위치/높이 보정
    function updateScrollbarGeometry() {
      if (!scrollbar) return;
      const heroH = hero ? hero.offsetHeight : 0;
      const tabsH = tabsBar ? tabsBar.offsetHeight : 0;
      const topExtraOffset = 40;
      const topOffset = heroH + tabsH + 16 + topExtraOffset; // 상단 여백
      const bottomOffset = 70; // 하단 여백
      const height = Math.max(0, window.innerHeight - topOffset - bottomOffset);
      scrollbar.style.top = `${topOffset}px`;
      scrollbar.style.height = `${height}px`;
    }

    // 초기 설정 - 약간의 지연으로 DOM 완전 렌더 후 계산
    setTimeout(() => {
      updateScrollbarGeometry();
      updateThumb();
    }, 50);

    updateScrollbarGeometry();
    updateThumb();
    viewport.addEventListener("scroll", updateThumb, { passive: true });

    // 드래그로 썸을 움직여 페이지 스크롤 조작
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
      const trackHeight = track
        ? track.offsetHeight
        : viewport.clientHeight || 420;
      const { scrollHeight, clientHeight } = viewport;
      const visibleRatio = clientHeight / (scrollHeight || 1);
      const thumbHeight = Math.max(
        40,
        Math.round(trackHeight * Math.min(1, visibleRatio))
      );
      const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);
      const currentY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      const delta = currentY - startY;
      const nextTop = Math.max(0, Math.min(maxThumbOffset, startTop + delta));
      const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
      const scrollTop = (nextTop / (maxThumbOffset || 1)) * maxScrollTop;
      viewport.scrollTop = Number.isFinite(scrollTop) ? scrollTop : 0;
      thumb.style.transform = `translateY(${nextTop}px)`;
    }

    function onPointerUp() {
      isDragging = false;
      if (pointerMoveHandler)
        document.removeEventListener("pointermove", pointerMoveHandler);
      if (pointerUpHandler)
        document.removeEventListener("pointerup", pointerUpHandler);
      pointerMoveHandler = null;
      pointerUpHandler = null;
    }

    thumb.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", updateThumb);
    window.addEventListener("resize", updateScrollbarGeometry);
    // 콘텐츠 높이 변화에 반응 (세로 커스텀바 전용)
    try {
      resizeObserver = new ResizeObserver(function () {
        updateScrollbarGeometry();
        updateThumb();
      });
      if (content) resizeObserver.observe(content);
      window.addEventListener("load", updateThumb);
    } catch (e) {
      void e;
    }

    return function cleanup() {
      viewport.removeEventListener("scroll", updateThumb);
      thumb.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", updateThumb);
      window.removeEventListener("resize", updateScrollbarGeometry);
      window.removeEventListener("load", updateThumb);
      if (resizeObserver) resizeObserver.disconnect();
      if (pointerMoveHandler)
        document.removeEventListener("pointermove", pointerMoveHandler);
      if (pointerUpHandler)
        document.removeEventListener("pointerup", pointerUpHandler);
    };
  }, []);

  const activeMenu = MENU_DATA.find(function (menu) {
    return menu.id === activeTabId;
  });

  return (
    <Page>
      <PageViewport data-viewport="page" style={{ paddingRight: 24 }}>
        <ContentWrapper data-content="page">
          <Hero data-hero="page">
            <HeroInner>
              <HeroTitle>
                <LastFourDigits phoneNumber={phoneNumber} />님 안녕하세요
              </HeroTitle>
              <HeroSubtitle>
                과거 주문하신 내역을 확인할 수 있어요.
              </HeroSubtitle>
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

          <TabsContainer data-tabs="page">
            {(function renderTabs() {
              const baseTabs = MENU_DATA.filter(function ({ label }) {
                return label !== "커피";
              }).map(function ({ id, label }) {
                return { id, label };
              });
              const tabs = [{ id: "orders", label: "주문 내역" }].concat(
                baseTabs
              );
              return (
                <CategoryTabs
                  tabs={tabs}
                  activeId={activeTabId}
                  onChange={setActiveTabId}
                />
              );
            })()}
          </TabsContainer>

          {/* 주문 내역 탭 */}
          {activeTabId === "orders" ? (
            <Section className="orderHistorySection">
              <OrderHistory>
                {function render({
                  favorites,
                  currentDay,
                  windowDays,
                  index,
                  canPrev,
                  canNext,
                  handlePrev,
                  handleNext,
                  selected,
                  toggleDate,
                  toggleItem,
                  qtyMinus,
                  qtyPlus,
                  getSelectedList,
                  clearSelectedItems,
                }) {
                  /* 내부 동작 함수 선언식: 날짜의 전체 선택 여부 */
                  function isAllChecked(date) {
                    const bucket = selected?.[date] || {};
                    const values = Object.values(bucket);
                    return (
                      values.length > 0 &&
                      values.every(function (v) {
                        return !!v.checked;
                      })
                    );
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
                        <FavViewport aria-label="자주 시킨 메뉴 목록">
                          <FavScrollArea>
                            {favList.map(function (item, idx) {
                              const rankLabel =
                                idx < 3 ? `${idx + 1}위` : undefined;
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
                      </FavWrap>

                      {/* 과거 주문 내역: 화살표로 날짜 전환 */}
                      <SubSectionTitle>과거 주문 내역</SubSectionTitle>
                      <SubSectionContext>
                        주문했던 메뉴를 추가할 수 있어요.
                      </SubSectionContext>
                      <PastListWrap className="pastListWrap">
                        {!!currentDay && (
                          <>
                            {/* 날짜 전체 선택 */}
                            <DateHeader className="dateHeader">
                              <DateCheck
                                className="dateCheck"
                                checked={isAllChecked(currentDay.date)}
                                onChange={function onToggleDate() {
                                  toggleDate(currentDay.date);
                                }}
                              />
                              <DateLabel className="dateLabel">
                                {formatDate(currentDay.date)}
                              </DateLabel>
                            </DateHeader>

                            {/* 메뉴 목록 */}
                            <MenuList className="menuList">
                              {currentDay.items.map(function (it) {
                                const st = selected?.[currentDay.date]?.[
                                  it.id
                                ] || { checked: false, qty: 0 };
                                return (
                                  <MenuRow
                                    className="menuRow"
                                    key={`${currentDay.date}${it.id}`}
                                  >
                                    <MenuCheck
                                      className="menuCheck"
                                      checked={!!st.checked}
                                      onChange={function onToggleItem() {
                                        toggleItem(currentDay.date, it.id);
                                      }}
                                    />
                                    <MenuImage>
                                      {/* 이미지는 추후 추가 */}
                                    </MenuImage>
                                    <MenuName className="menuName">
                                      {it.name}
                                    </MenuName>

                                    <Stepper className="menuStepper">
                                      <StepBtn
                                        className="menuMinus"
                                        $type="minus"
                                        disabled={st.qty <= 0}
                                        aria-label="minus"
                                        onClick={function onQtyMinus() {
                                          qtyMinus(currentDay.date, it.id);
                                        }}
                                      />
                                      <StepValue className="menuQty">
                                        {st.qty ?? 0}
                                      </StepValue>
                                      <StepBtn
                                        className="menuPlus"
                                        $type="plus"
                                        aria-label="plus"
                                        onClick={function onQtyPlus() {
                                          qtyPlus(currentDay.date, it.id);
                                        }}
                                      />
                                    </Stepper>

                                    <Price className="menuPrice">
                                      {it.price.toLocaleString()}원
                                    </Price>
                                  </MenuRow>
                                );
                              })}
                            </MenuList>
                          </>
                        )}
                      </PastListWrap>

                      {/* 날짜 네비게이션 */}
                      <HistoryNav>
                        {/* 페이지네이션 점들 */}
                        <PaginationDots>
                          {windowDays.map((_, dotIndex) => (
                            <PaginationDot
                              key={dotIndex}
                              $active={
                                dotIndex === windowDays.length - 1 - index
                              }
                            />
                          ))}
                        </PaginationDots>

                        {/* 네비게이션 버튼들 */}
                        <NavButtons>
                          <HistoryNavIcon
                            src={backIcon}
                            alt="이전"
                            $disabled={!canPrev()}
                            onClick={!canPrev() ? undefined : handlePrev}
                            aria-label="이전 날짜"
                          />
                          <HistoryNavIcon
                            src={nextIcon}
                            alt="다음"
                            $disabled={!canNext()}
                            onClick={!canNext() ? undefined : handleNext}
                            aria-label="다음 날짜"
                          />
                        </NavButtons>
                      </HistoryNav>

                      {/* 하단 버튼 - 섹션 맨 아래(가운데 정렬은 스타일에서 처리) */}
                      <FooterBar className="historyFooter">
                        <GhostButton
                          type="button"
                          onClick={handleGoToOrderMethod}
                        >
                          처음으로
                        </GhostButton>
                        <PrimaryButton
                          type="button"
                          onClick={() =>
                            handleAddSelectedToCart(
                              getSelectedList,
                              clearSelectedItems
                            )
                          }
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
            (Array.isArray(activeMenu?.sections)
              ? activeMenu.sections
              : []
            ).map(function (section) {
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
            })
          )}
        </ContentWrapper>
      </PageViewport>
      <PageScrollbar
        data-scrollbar="page"
        role="scrollbar"
        aria-orientation="vertical"
      >
        <PageTrack />
        <PageThumb data-thumb="page" tabIndex="0" aria-label="페이지 스크롤" />
      </PageScrollbar>
    </Page>
  );
}

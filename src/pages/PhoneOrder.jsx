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
import { menuService } from "../services/api.js";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";

/* Context */
import CartProvider from "../components/CartProvider.jsx";
import { useCart } from "../components/CartContext";

/* 컴포넌트 */
import LastFourDigits from "../components/LastFourDigits";
import OrderHistory from "../components/OrderHistory.jsx";
import CustomScrollbar from "../components/CustomScrollbar";

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
  const [menuData, setMenuData] = useState([]); // 메뉴 데이터 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem, totalQty: _totalQty } = useCart();
  const totalQty = Number.isFinite(_totalQty) ? _totalQty : 0;

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiMenuData = await menuService.getTransformedMenuData();

        if (apiMenuData && apiMenuData.length > 0) {
          setMenuData(apiMenuData);
          console.log(
            "PhoneOrder - API에서 메뉴 데이터 로드 성공:",
            apiMenuData
          );
        } else {
          console.warn(
            "PhoneOrder - API에서 메뉴 데이터를 가져오지 못했습니다."
          );
          setMenuData([]);
        }
      } catch (err) {
        console.error("PhoneOrder - 메뉴 데이터 로드 실패:", err);
        setError(err.message);
        setMenuData([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  /* 이 페이지에서만 '커피' 탭 숨김 */
  const HIDDEN_TAB_IDS = React.useMemo(
    function () {
      return new Set(
        menuData
          .filter(function ({ label }) {
            return label === "커피";
          })
          .map(function ({ id }) {
            return id;
          })
      );
    },
    [menuData]
  );

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

  // 커스텀 스크롤바를 위한 고정 요소들 반환
  const getFixedElements = () => {
    return {
      hero: document.querySelector("[data-hero='page']"),
      tabs: document.querySelector("[data-tabs='page']"),
    };
  };

  const activeMenu = menuData.find(function (menu) {
    return menu.id === activeTabId;
  });

  // 메뉴 탭 활성화 시 로딩/에러 처리
  if (activeTabId !== "orders" && loading) {
    return (
      <Page>
        <PageViewport data-viewport="page" style={{ paddingRight: 24 }}>
          <ContentWrapper data-content="page">
            <Hero>
              <HeroInner>
                <HeroTitle>메뉴를 불러오는 중...</HeroTitle>
              </HeroInner>
            </Hero>
          </ContentWrapper>
        </PageViewport>
      </Page>
    );
  }

  if (activeTabId !== "orders" && error && menuData.length === 0) {
    return (
      <Page>
        <PageViewport data-viewport="page" style={{ paddingRight: 24 }}>
          <ContentWrapper data-content="page">
            <Hero>
              <HeroInner>
                <HeroTitle>메뉴를 불러올 수 없습니다</HeroTitle>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                    color: "#666",
                  }}
                >
                  서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.
                </div>
              </HeroInner>
            </Hero>
          </ContentWrapper>
        </PageViewport>
      </Page>
    );
  }

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
              const baseTabs = menuData
                .filter(function ({ label }) {
                  return label !== "커피";
                })
                .map(function ({ id, label }) {
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
                                  currentMode="phone"
                                  selectedMenuType={activeTabId}
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
                              $active={dotIndex === index}
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
                          currentMode="phone"
                          selectedMenuType={activeTabId}
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
      <CustomScrollbar
        viewportSelector="[data-viewport='page']"
        contentSelector="[data-content='page']"
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

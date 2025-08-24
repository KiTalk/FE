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
import { menuService, touchOrderService } from "../services/api.js";
import { formatPhoneWithHyphens } from "../utils/phoneUtils";
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
  const { addItem } = useCart();

  // 전화번호 관련 상태
  const [phoneOrdersData, setPhoneOrdersData] = useState([]); // 과거 주문 내역
  const [phoneFavoritesData, setPhoneFavoritesData] = useState([]); // 자주 시킨 메뉴
  const [phoneDataLoading, setPhoneDataLoading] = useState(true);
  const [phoneDataError, setPhoneDataError] = useState(null);

  // TouchOrder 방식의 장바구니 상태 추가
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

  // 전화번호 주문 데이터 로드
  useEffect(() => {
    const loadPhoneOrderData = async () => {
      try {
        setPhoneDataLoading(true);
        setPhoneDataError(null);

        // localStorage에서 전화번호 가져오기
        const orderSpec = getOrderSpec();
        const phoneNumber = orderSpec?.point?.phone;

        if (!phoneNumber) {
          console.warn("전화번호가 없습니다. 주문 내역을 불러올 수 없습니다.");
          setPhoneOrdersData([]);
          setPhoneFavoritesData([]);
          setPhoneDataLoading(false);
          return;
        }

        const formattedPhone = formatPhoneWithHyphens(phoneNumber);
        console.log("📞 전화번호로 데이터 조회:", formattedPhone);

        // 병렬로 API 호출
        const [favoritesResponse, ordersResponse] = await Promise.all([
          touchOrderService.getPhoneTopMenus(formattedPhone),
          touchOrderService.getPhoneOrders(formattedPhone),
        ]);

        // 자주 시킨 메뉴 데이터 처리
        if (favoritesResponse?.data) {
          console.log("✅ 자주 시킨 메뉴 데이터:", favoritesResponse.data);
          setPhoneFavoritesData(favoritesResponse.data);
        }

        // 과거 주문 내역 데이터 처리
        if (ordersResponse?.data?.results) {
          console.log("✅ 과거 주문 내역 데이터:", ordersResponse.data.results);
          // API 응답을 OrderHistory 컴포넌트가 기대하는 형태로 변환
          const transformedOrders = transformOrdersData(
            ordersResponse.data.results
          );
          setPhoneOrdersData(transformedOrders);
        }
      } catch (err) {
        console.error("❌ 전화번호 주문 데이터 로드 실패:", err);
        setPhoneDataError(err.message);
        setPhoneOrdersData([]);
        setPhoneFavoritesData([]);
      } finally {
        setPhoneDataLoading(false);
      }
    };

    loadPhoneOrderData();
  }, []);

  // localStorage에서 장바구니 데이터 로드 (TouchOrder 방식)
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

  // localStorage에 장바구니 데이터 저장 (TouchOrder 방식)
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
  // 장바구니 버튼 클릭 시 서버에 동기화 후 이동 (TouchOrder 방식)
  async function handleCartClick() {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) {
      navigate("/order-method");
      return;
    }

    try {
      // PhoneOrder 모드를 order_spec에 설정
      const orderSpec = getOrderSpec();
      orderSpec.mode = "phone";
      localStorage.setItem("order_spec", JSON.stringify(orderSpec));

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

  // TouchOrder 방식으로 개별 메뉴를 서버에 추가
  async function handleAddToCart(product, quantity) {
    const qty = Number(quantity ?? 1);
    if (!product?.id || qty <= 0) return;

    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) {
      navigate("/order-method");
      return;
    }

    try {
      // menu_id 추출 - originalId 우선, 없으면 id 사용
      let menuId = product.originalId || product.id;
      if (typeof menuId === "string" && menuId.startsWith("menu-")) {
        menuId = parseInt(menuId.replace("menu-", ""), 10);
      }

      // 기존 수량에 추가
      const currentQuantity = localCart[menuId] || 0;
      const newQuantity = currentQuantity + qty;

      // 일괄 업데이트로 서버에 동기화
      await touchOrderService.bulkUpdateTouchCart(sessionId, {
        [menuId]: newQuantity,
      });

      // localStorage 업데이트
      setLocalCart((prevCart) => {
        const updatedCart = { ...prevCart, [menuId]: newQuantity };
        saveLocalCart(updatedCart);
        return updatedCart;
      });

      // 장바구니 카운트 업데이트
      setCartCount(() => {
        const totalQuantity = Object.values({
          ...localCart,
          [menuId]: newQuantity,
        }).reduce((sum, quantity) => sum + quantity, 0);
        return totalQuantity;
      });

      // 기존 CartContext에도 추가 (호환성 유지)
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

      console.log("✅ 메뉴가 장바구니에 추가되었습니다:", product.name);
    } catch (error) {
      console.error("❌ 장바구니 추가 실패:", error);
      alert("장바구니에 추가하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }

  function handleGoToOrderMethod() {
    navigate("/order-method");
  }

  // TouchOrder 방식으로 선택된 메뉴를 서버에 추가
  async function handleAddSelectedToCart(getSelectedList, clearSelectedItems) {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) {
      navigate("/order-method");
      return;
    }

    const selectedItems = getSelectedList();
    if (selectedItems.length === 0) return;

    try {
      // 선택된 항목들을 bulkUpdateTouchCart용 형태로 변환
      const cartUpdates = {};

      for (const { product, quantity } of selectedItems) {
        if (!product || quantity <= 0) continue;

        // menu_id 추출 (API 응답에서 온 경우 id가 "menu-6" 형태일 수 있음)
        let menuId = product.id;
        if (typeof menuId === "string" && menuId.startsWith("menu-")) {
          menuId = parseInt(menuId.replace("menu-", ""), 10);
        }

        // 기존 수량에 추가
        const currentQuantity = localCart[menuId] || 0;
        cartUpdates[menuId] = currentQuantity + quantity;

        // 기존 CartContext에도 추가 (호환성 유지)
        addItem(
          {
            id: product.id,
            name: product.name,
            price: product.price,
            popular: !!product.popular,
            temp: product.temp,
          },
          quantity
        );
      }

      // 일괄 업데이트로 서버에 동기화
      await touchOrderService.bulkUpdateTouchCart(sessionId, cartUpdates);

      // localStorage 업데이트
      setLocalCart((prevCart) => {
        const updatedCart = { ...prevCart, ...cartUpdates };
        saveLocalCart(updatedCart);
        return updatedCart;
      });

      // 장바구니 카운트 업데이트
      setCartCount(() => {
        const totalQuantity = Object.values({
          ...localCart,
          ...cartUpdates,
        }).reduce((sum, quantity) => sum + quantity, 0);
        return totalQuantity;
      });

      // 장바구니에 추가한 후 선택 상태 초기화
      if (clearSelectedItems) {
        clearSelectedItems();
      }

      console.log("✅ 선택된 메뉴가 장바구니에 추가되었습니다");
    } catch (error) {
      console.error("❌ 장바구니 추가 실패:", error);
      alert("장바구니에 추가하는 중 오류가 발생했습니다. 다시 시도해주세요.");
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

  // API 응답 데이터를 OrderHistory 컴포넌트 형태로 변환
  const transformOrdersData = (apiResults) => {
    if (!Array.isArray(apiResults)) return [];

    // order_id별로 그룹화하여 날짜별 주문으로 변환
    const ordersByDate = {};

    apiResults.forEach((orderGroup) => {
      if (!orderGroup.orders || !Array.isArray(orderGroup.orders)) return;

      // 현재는 날짜 정보가 없으므로 order_id를 기준으로 가상의 날짜 생성
      // 실제 API에 날짜 정보가 있다면 그것을 사용
      const fakeDate = `2025-08-${String(
        15 - (orderGroup.order_id % 10)
      ).padStart(2, "0")}`;

      if (!ordersByDate[fakeDate]) {
        ordersByDate[fakeDate] = [];
      }

      orderGroup.orders.forEach((item) => {
        ordersByDate[fakeDate].push({
          id: item.menu_id ? `menu-${item.menu_id}` : item.menu_item,
          name: item.menu_item,
          price: item.price || 0,
          popular: false, // API에서 정보가 없으므로 기본값
          temp: item.temp || "ice",
          qty: 1, // 기본 수량
        });
      });
    });

    // 날짜별로 정렬하여 반환
    return Object.entries(ordersByDate)
      .map(([date, items]) => ({ date, items }))
      .sort((a, b) => b.date.localeCompare(a.date)); // 최신 날짜 우선
  };

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
                  <CartBadgeCount>{cartCount}</CartBadgeCount>
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
              <OrderHistory
                customOrders={phoneOrdersData}
                customFavorites={phoneFavoritesData}
                loading={phoneDataLoading}
                error={phoneDataError}
              >
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

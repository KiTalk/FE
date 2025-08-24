import React, { useEffect, useState, useCallback } from "react";
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
  const [_phoneDataLoading, setPhoneDataLoading] = useState(true);
  const [_phoneDataError, setPhoneDataError] = useState(null);

  // TouchOrder 방식의 장바구니 상태 추가
  const [cartCount, setCartCount] = useState(0);
  const [localCart, setLocalCart] = useState({}); // localStorage 기반 장바구니

  // 과거 주문 선택 상태 (localStorage 기반)
  const [pastOrderSelections, setPastOrderSelections] = useState({}); // {order_id: {menu_id: quantity}}

  // 현재 페이지 인덱스 상태
  const [currentIndex, setCurrentIndex] = useState(0);

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiMenuData = await menuService.getTransformedMenuData();

        if (apiMenuData && apiMenuData.length > 0) {
          // 커피 메뉴를 세분화하는 함수
          const subdivideCoffeeSection = (sections) => {
            // 커피 섹션을 찾기
            const coffeeSection = sections.find(
              (section) => section.title === "커피"
            );
            if (!coffeeSection) return sections;

            // 커피 제품들을 분류
            const americanoProducts = coffeeSection.products.filter((product) =>
              product.name.includes("아메리카노")
            );
            const latteProducts = coffeeSection.products.filter(
              (product) =>
                product.name.includes("라떼") &&
                !product.name.includes("아메리카노")
            );
            const otherProducts = coffeeSection.products.filter(
              (product) =>
                !product.name.includes("아메리카노") &&
                !product.name.includes("라떼")
            );

            // 커피 섹션을 제거하고 세분화된 섹션들로 교체
            const otherSections = sections.filter(
              (section) => section.title !== "커피"
            );
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
          };

          // 모든 카테고리에서 커피 메뉴를 세분화
          const transformedMenuData = apiMenuData.map((category) => {
            if (category.id === "coffee") {
              // 커피 카테고리의 모든 제품을 수집
              const allCoffeeProducts = category.sections.flatMap(
                (section) => section.products
              );

              // 제품을 분류
              const americanoProducts = allCoffeeProducts.filter((product) =>
                product.name.includes("아메리카노")
              );
              const latteProducts = allCoffeeProducts.filter(
                (product) =>
                  product.name.includes("라떼") &&
                  !product.name.includes("아메리카노")
              );
              const otherProducts = allCoffeeProducts.filter(
                (product) =>
                  !product.name.includes("아메리카노") &&
                  !product.name.includes("라떼")
              );

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
            "PhoneOrder - API에서 메뉴 데이터 로드 성공:",
            transformedMenuData
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

        // 병렬로 API 호출
        const [favoritesResponse, ordersResponse] = await Promise.all([
          touchOrderService.getPhoneTopMenus(formattedPhone),
          touchOrderService.getPhoneOrders(formattedPhone),
        ]);

        // 자주 시킨 메뉴 데이터 처리
        if (favoritesResponse?.data?.top_menus) {
          console.log("✅ 자주 시킨 메뉴 데이터:", favoritesResponse.data);

          // 메뉴 데이터와 매칭하여 가격 정보 가져오기
          const transformedFavorites = await Promise.all(
            favoritesResponse.data.top_menus.map(async (item, index) => {
              // 기본 메뉴 정보
              let menuInfo = {
                id: `fav-${item.menu_id}`,
                name: item.menu_item,
                price: 4000, // 기본값
                popular: true,
                temp: "ice", // 기본값
                originalId: item.menu_id,
                count: item.count,
                rank: index + 1,
              };

              // API 응답에서 직접 profile 이미지와 temp 사용
              menuInfo.profileImage = item.profile;
              menuInfo.temp = item.temp || "ice"; // API 응답의 temp 우선 사용

              // 메뉴 API에서 정확한 가격과 정보 찾기
              try {
                const menuResponse = await menuService.getMenuList();
                if (menuResponse?.success && Array.isArray(menuResponse.data)) {
                  const matchedMenu = menuResponse.data.find(
                    (menu) =>
                      menu.id === item.menu_id ||
                      menu.name
                        .toLowerCase()
                        .includes(item.menu_item.toLowerCase())
                  );

                  if (matchedMenu) {
                    menuInfo.price = matchedMenu.price;
                    // API 응답의 temp가 없을 경우에만 메뉴 API의 temperature 사용
                    if (!item.temp && matchedMenu.temperature) {
                      menuInfo.temp = matchedMenu.temperature.toLowerCase();
                    }
                    // API 응답의 profile이 있으면 우선 사용, 없으면 메뉴 API의 profile 사용
                    if (!menuInfo.profileImage && matchedMenu.profile) {
                      menuInfo.profileImage = matchedMenu.profile;
                    }
                  }
                }
              } catch (error) {
                console.warn("메뉴 정보 매칭 실패:", error);
              }

              return menuInfo;
            })
          );

          setPhoneFavoritesData(transformedFavorites);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // localStorage에서 과거 주문 선택 상태 로드
  const loadPastOrderSelections = () => {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) {
      setPastOrderSelections({});
      return;
    }

    try {
      const selectionsKey = `pastOrderSelections_${sessionId}`;
      const stored = localStorage.getItem(selectionsKey);
      const selections = stored ? JSON.parse(stored) : {};
      setPastOrderSelections(selections);
    } catch {
      setPastOrderSelections({});
    }
  };

  // localStorage에 과거 주문 선택 상태 저장
  const savePastOrderSelections = (selections) => {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) return;

    try {
      const selectionsKey = `pastOrderSelections_${sessionId}`;
      localStorage.setItem(selectionsKey, JSON.stringify(selections));
    } catch {
      // 저장 실패 시 무시
    }
  };

  // 컴포넌트 마운트 시 로컬 데이터 로드
  useEffect(() => {
    loadLocalCart();
    loadPastOrderSelections();
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

      // localStorage 업데이트
      setLocalCart((prevCart) => {
        const updatedCart = { ...prevCart, [menuId]: newQuantity };
        saveLocalCart(updatedCart);
        return updatedCart;
      });

      // 전체 장바구니 스냅샷으로 서버에 동기화
      const updatedCart = { ...localCart, [menuId]: newQuantity };
      await touchOrderService.bulkUpdateTouchCart(sessionId, updatedCart);

      // 장바구니 카운트 업데이트
      setCartCount(() => {
        const totalQuantity = Object.values(updatedCart).reduce(
          (sum, quantity) => sum + quantity,
          0
        );
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

  // 과거 주문 메뉴 선택 상태 변경 (localStorage에 저장)
  function handlePastOrderToggle(orderId, menuId, currentQty = 0) {
    const newSelections = { ...pastOrderSelections };

    if (!newSelections[orderId]) {
      newSelections[orderId] = {};
    }

    // 현재 수량이 0이면 1로, 0이 아니면 0으로 토글
    const newQty = currentQty > 0 ? 0 : 1;

    if (newQty > 0) {
      newSelections[orderId][menuId] = newQty;
    } else {
      delete newSelections[orderId][menuId];

      // 해당 주문에 선택된 메뉴가 없으면 주문 자체를 삭제
      if (Object.keys(newSelections[orderId]).length === 0) {
        delete newSelections[orderId];
      }
    }

    setPastOrderSelections(newSelections);
    savePastOrderSelections(newSelections);
  }

  // 과거 주문 메뉴 수량 증가
  function handlePastOrderIncrease(orderId, menuId) {
    const newSelections = { ...pastOrderSelections };

    if (!newSelections[orderId]) {
      newSelections[orderId] = {};
    }

    const currentQty = newSelections[orderId][menuId] || 0;
    newSelections[orderId][menuId] = currentQty + 1;

    setPastOrderSelections(newSelections);
    savePastOrderSelections(newSelections);
  }

  // 과거 주문 메뉴 수량 감소
  function handlePastOrderDecrease(orderId, menuId) {
    const newSelections = { ...pastOrderSelections };

    if (!newSelections[orderId] || !newSelections[orderId][menuId]) {
      return;
    }

    const currentQty = newSelections[orderId][menuId];
    const newQty = Math.max(0, currentQty - 1);

    if (newQty > 0) {
      newSelections[orderId][menuId] = newQty;
    } else {
      delete newSelections[orderId][menuId];

      // 해당 주문에 선택된 메뉴가 없으면 주문 자체를 삭제
      if (Object.keys(newSelections[orderId]).length === 0) {
        delete newSelections[orderId];
      }
    }

    setPastOrderSelections(newSelections);
    savePastOrderSelections(newSelections);
  }

  // 과거 주문에서 선택된 메뉴를 장바구니에 추가 (localStorage 기반)
  async function handleAddSelectedPastOrdersToCart() {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) {
      navigate("/order-method");
      return;
    }

    // pastOrderSelections에서 선택된 항목들이 없으면 조기 반환
    if (Object.keys(pastOrderSelections).length === 0) {
      console.log("선택된 과거 주문 메뉴가 없습니다.");
      return;
    }

    try {
      // 선택된 항목들을 bulkUpdateTouchCart용 형태로 변환
      const cartUpdates = {};

      for (const [_orderId, menuSelections] of Object.entries(
        pastOrderSelections
      )) {
        for (const [menuId, quantity] of Object.entries(menuSelections)) {
          if (quantity <= 0) continue;

          const numericMenuId = Number(menuId);
          if (!Number.isInteger(numericMenuId) || numericMenuId <= 0) {
            console.warn(`잘못된 메뉴 ID로 인해 건너뜀: ${menuId}`);
            continue;
          }

          // 기존 수량에 추가
          const currentQuantity = localCart[numericMenuId] || 0;
          cartUpdates[numericMenuId] =
            (cartUpdates[numericMenuId] || currentQuantity) + quantity;
        }
      }

      // 유효한 항목이 없으면 조기 반환
      if (Object.keys(cartUpdates).length === 0) {
        console.warn("유효한 메뉴 ID가 없어 장바구니 업데이트를 건너뜀");
        return;
      }

      // localStorage 업데이트
      setLocalCart((prevCart) => {
        const updatedCart = { ...prevCart, ...cartUpdates };
        saveLocalCart(updatedCart);
        return updatedCart;
      });

      // 전체 장바구니 스냅샷으로 서버에 동기화
      const updatedCart = { ...localCart, ...cartUpdates };
      await touchOrderService.bulkUpdateTouchCart(sessionId, updatedCart);

      // 장바구니 카운트 업데이트
      setCartCount(() => {
        const totalQuantity = Object.values(updatedCart).reduce(
          (sum, quantity) => sum + quantity,
          0
        );
        return totalQuantity;
      });

      // 장바구니에 추가한 후 선택 상태 초기화
      setPastOrderSelections({});
      savePastOrderSelections({});

      console.log("✅ 선택된 과거 주문 메뉴가 장바구니에 추가되었습니다");
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

  // created_at 배열에서 월과 일 정보만 사용하여 날짜 포맷팅
  function formatMonthDay(createdAtArray) {
    if (!Array.isArray(createdAtArray) || createdAtArray.length < 3) {
      return "날짜 정보 없음";
    }

    const [, month, day] = createdAtArray;
    return `${month.toString().padStart(2, "0")}.${day
      .toString()
      .padStart(2, "0")}`;
  }

  // API 응답 데이터를 OrderHistory 컴포넌트 형태로 변환 (개별 주문별로)
  const transformOrdersData = useCallback((apiResults) => {
    if (!Array.isArray(apiResults)) return [];

    // 각 주문을 개별 페이지로 변환
    const individualOrders = [];

    apiResults.forEach((orderGroup) => {
      if (!orderGroup.orders || !Array.isArray(orderGroup.orders)) return;

      // created_at 배열에서 월.일 형식으로 날짜 키 생성
      const dateKey = orderGroup.created_at
        ? formatMonthDay(orderGroup.created_at)
        : `08.${String(15 - (orderGroup.order_id % 10)).padStart(2, "0")}`;

      // 각 주문 그룹을 개별 페이지로 처리
      const items = orderGroup.orders.map((item) => ({
        id: item.menu_id
          ? `menu-${item.menu_id}-${item.temp || "ice"}`
          : `${item.menu_item}-${item.temp || "ice"}`,
        name: item.menu_item,
        price: item.price || 0,
        popular: false, // API에서 정보가 없으므로 기본값
        temp: item.temp || "ice",
        qty: 0, // 체크되지 않은 상태로 시작
        profileImage: item.profile, // API 응답의 profile 이미지 추가
      }));

      individualOrders.push({
        date: dateKey,
        items: items,
        order_id: orderGroup.order_id, // 정렬을 위해 order_id 보존
      });
    });

    // order_id 기준으로 최신 주문 우선 정렬 (각 주문이 개별 페이지가 됨)
    return individualOrders.sort(
      (a, b) => (b.order_id || 0) - (a.order_id || 0)
    );
  }, []);

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
              {/* 직접 주문 내역 UI 구현 (OrderHistory 컴포넌트 대신) */}
              {(function renderPastOrdersDirectly() {
                const windowDays = phoneOrdersData || [];
                const currentDay = windowDays[currentIndex] || null;

                const canPrev = () => currentIndex > 0;
                const canNext = () => currentIndex < windowDays.length - 1;
                const handlePrev = () => {
                  if (canPrev()) setCurrentIndex(currentIndex - 1);
                };
                const handleNext = () => {
                  if (canNext()) setCurrentIndex(currentIndex + 1);
                };

                // 날짜 포맷팅 함수
                function formatDate(dateStr) {
                  // 월.일 형식 (08.24) 처리
                  const monthDayMatch = /^(\d{2})\.(\d{2})$/.exec(
                    dateStr || ""
                  );
                  if (monthDayMatch) {
                    const month = parseInt(monthDayMatch[1], 10);
                    const day = parseInt(monthDayMatch[2], 10);
                    return `${month}월 ${day}일`;
                  }
                  return dateStr;
                }

                return (
                  <>
                    <SubSectionTitle>자주 시킨 메뉴</SubSectionTitle>
                    <FavWrap>
                      <FavViewport aria-label="자주 시킨 메뉴 목록">
                        <FavScrollArea>
                          {Array.isArray(phoneFavoritesData) &&
                          phoneFavoritesData.length > 0 ? (
                            phoneFavoritesData.map(function (item, idx) {
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
                            })
                          ) : (
                            <div
                              style={{
                                padding: "20px",
                                textAlign: "center",
                                color: "#666",
                                fontSize: "14px",
                              }}
                            >
                              {_phoneDataLoading
                                ? "자주 시킨 메뉴를 불러오는 중..."
                                : "자주 시킨 메뉴가 없습니다."}
                            </div>
                          )}
                        </FavScrollArea>
                      </FavViewport>
                    </FavWrap>

                    {/* 과거 주문 내역 */}
                    <SubSectionTitle>과거 주문 내역</SubSectionTitle>
                    <SubSectionContext>
                      주문했던 메뉴를 추가할 수 있어요.
                    </SubSectionContext>
                    <PastListWrap className="pastListWrap">
                      {currentDay ? (
                        <>
                          {/* 날짜 헤더 */}
                          <DateHeader className="dateHeader">
                            <DateCheck
                              className="dateCheck"
                              checked={
                                Array.isArray(currentDay?.items) &&
                                currentDay.items.every((item) => {
                                  const menuId = item.id.split("-")[1];
                                  const qty =
                                    pastOrderSelections[currentDay.order_id]?.[
                                      menuId
                                    ] || 0;
                                  return qty > 0;
                                })
                              }
                              onChange={() => {
                                // 날짜 전체 선택/해제
                                const allChecked =
                                  Array.isArray(currentDay?.items) &&
                                  currentDay.items.every((item) => {
                                    const menuId = item.id.split("-")[1];
                                    const qty =
                                      pastOrderSelections[
                                        currentDay.order_id
                                      ]?.[menuId] || 0;
                                    return qty > 0;
                                  });

                                if (allChecked) {
                                  // 모두 체크되어 있으면 모두 해제
                                  const newSelections = {
                                    ...pastOrderSelections,
                                  };
                                  if (newSelections[currentDay.order_id]) {
                                    delete newSelections[currentDay.order_id];
                                  }
                                  setPastOrderSelections(newSelections);
                                  savePastOrderSelections(newSelections);
                                } else {
                                  // 모두 체크되어 있지 않으면 모두 체크
                                  const newSelections = {
                                    ...pastOrderSelections,
                                  };
                                  if (!newSelections[currentDay.order_id]) {
                                    newSelections[currentDay.order_id] = {};
                                  }
                                  currentDay.items.forEach((item) => {
                                    const menuId = item.id.split("-")[1];
                                    newSelections[currentDay.order_id][
                                      menuId
                                    ] = 1;
                                  });
                                  setPastOrderSelections(newSelections);
                                  savePastOrderSelections(newSelections);
                                }
                              }}
                            />
                            <DateLabel className="dateLabel">
                              {formatDate(currentDay.date)}
                            </DateLabel>
                          </DateHeader>

                          {/* 메뉴 목록 */}
                          <MenuList className="menuList">
                            {Array.isArray(currentDay?.items) &&
                            currentDay.items.length > 0 ? (
                              currentDay.items.map(function (item) {
                                const currentQty =
                                  pastOrderSelections[currentDay.order_id]?.[
                                    item.id.split("-")[1]
                                  ] || 0;
                                const isChecked = currentQty > 0;

                                return (
                                  <MenuRow
                                    className="menuRow"
                                    key={`${currentDay.order_id}-${item.id}`}
                                  >
                                    <MenuCheck
                                      className="menuCheck"
                                      checked={isChecked}
                                      onChange={() => {
                                        const menuId = item.id.split("-")[1];
                                        handlePastOrderToggle(
                                          currentDay.order_id,
                                          menuId,
                                          currentQty
                                        );
                                      }}
                                    />
                                    <MenuImage>
                                      {item.profileImage && (
                                        <img
                                          src={item.profileImage}
                                          alt={item.name}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "1.25rem",
                                          }}
                                        />
                                      )}
                                    </MenuImage>
                                    <MenuName className="menuName">
                                      {item.name}
                                    </MenuName>

                                    <Stepper className="menuStepper">
                                      <StepBtn
                                        className="menuMinus"
                                        $type="minus"
                                        disabled={currentQty <= 0}
                                        aria-label="minus"
                                        onClick={() => {
                                          const menuId = item.id.split("-")[1];
                                          handlePastOrderDecrease(
                                            currentDay.order_id,
                                            menuId
                                          );
                                        }}
                                      />
                                      <StepValue className="menuQty">
                                        {currentQty}
                                      </StepValue>
                                      <StepBtn
                                        className="menuPlus"
                                        $type="plus"
                                        aria-label="plus"
                                        onClick={() => {
                                          const menuId = item.id.split("-")[1];
                                          handlePastOrderIncrease(
                                            currentDay.order_id,
                                            menuId
                                          );
                                        }}
                                      />
                                    </Stepper>

                                    <Price className="menuPrice">
                                      {item.price.toLocaleString()}원
                                    </Price>
                                  </MenuRow>
                                );
                              })
                            ) : (
                              <div
                                style={{
                                  padding: "20px",
                                  textAlign: "center",
                                  color: "#666",
                                  fontSize: "14px",
                                }}
                              >
                                이 주문에 메뉴가 없습니다.
                              </div>
                            )}
                          </MenuList>
                        </>
                      ) : (
                        <div
                          style={{
                            padding: "40px",
                            textAlign: "center",
                            color: "#666",
                            fontSize: "14px",
                          }}
                        >
                          {_phoneDataLoading
                            ? "과거 주문 내역을 불러오는 중..."
                            : "과거 주문 내역이 없습니다."}
                        </div>
                      )}
                    </PastListWrap>

                    {/* 날짜 네비게이션 */}
                    <HistoryNav>
                      {/* 페이지네이션 점들 */}
                      <PaginationDots>
                        {Array.isArray(windowDays)
                          ? windowDays.map((_, dotIndex) => (
                              <PaginationDot
                                key={dotIndex}
                                $active={dotIndex === currentIndex}
                              />
                            ))
                          : []}
                      </PaginationDots>

                      {/* 네비게이션 버튼들 */}
                      <NavButtons>
                        <HistoryNavIcon
                          src={backIcon}
                          alt="이전"
                          $disabled={!canPrev()}
                          onClick={!canPrev() ? undefined : handlePrev}
                          aria-label="이전 주문"
                        />
                        <HistoryNavIcon
                          src={nextIcon}
                          alt="다음"
                          $disabled={!canNext()}
                          onClick={!canNext() ? undefined : handleNext}
                          aria-label="다음 주문"
                        />
                      </NavButtons>
                    </HistoryNav>

                    {/* 하단 버튼 */}
                    <FooterBar className="historyFooter">
                      <GhostButton
                        type="button"
                        onClick={handleGoToOrderMethod}
                      >
                        처음으로
                      </GhostButton>
                      <PrimaryButton
                        type="button"
                        onClick={handleAddSelectedPastOrdersToCart}
                      >
                        선택한 메뉴 담기
                      </PrimaryButton>
                    </FooterBar>
                  </>
                );
              })()}
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
                    {Array.isArray(section?.products)
                      ? section.products.map(function (item) {
                          return (
                            <ProductCard
                              key={item.id}
                              product={item}
                              onAdd={makeOnAddHandler(item)}
                              currentMode="phone"
                              selectedMenuType={activeTabId}
                            />
                          );
                        })
                      : []}
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

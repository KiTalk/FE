import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Page,
  CartPageContainer,
  HeaderContainer,
  HeaderTitle,
  HeaderSubtitle,
  CancelButton,
  CancelIcon,
  CardsViewport,
  CardsScrollArea,
  CustomScrollbar,
  CustomTrack,
  CustomThumb,
  FooterBar,
  FooterLeft,
  FooterTotal,
  FooterRight,
  SecondaryButton,
  PlusIcon,
  PrimaryButton,
  FooterMetaRow,
  FooterDivider,
  FooterMetaLabel,
  FooterMetaValue,
} from "./Cart.styles";
import CartProductCard from "../../components/card/CartProductCard";
import CancelImage from "../../assets/images/cancel.png";
import { useNavigate } from "react-router-dom";
import { touchOrderService } from "../../services/api.js";

export default function CartPage(props) {
  return (
    <Page>
      <CartContent {...props} />
    </Page>
  );
}

function CartContent(props) {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate; // 최신 navigate 참조 유지

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localCart, setLocalCart] = useState({}); // localStorage 기반 장바구니
  const loadedRef = useRef(false); // 중복 호출 방지

  // localStorage에 장바구니 데이터 저장
  function saveLocalCart(cart) {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) return;

    try {
      const cartKey = `touchCart_${sessionId}`;
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (error) {
      console.error("장바구니 저장 실패:", error);
    }
  }

  // 서버에서 장바구니 데이터 로드 (최초 마운트 시에만)
  const loadServerCartData = useCallback(async function () {
    // 이미 로드된 경우 중복 호출 방지
    if (loadedRef.current) {
      setLoading(false);
      return;
    }

    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) {
      navigateRef.current("/order-method");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await touchOrderService.getTouchCart(sessionId);
      setCartData(data);

      // 서버 데이터를 localStorage에도 동기화
      const cart = {};
      data.orders?.forEach(function (order) {
        cart[order.menu_id] = order.quantity;
      });
      setLocalCart(cart);
      saveLocalCart(cart);

      loadedRef.current = true; // 로드 완료 표시
    } catch (err) {
      setError(err.message);
      navigateRef.current("/order-method");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(
    function () {
      loadServerCartData();
    },
    [loadServerCartData]
  );

  function formatCurrency(value) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : "0";
  }

  // 전체 취소: localStorage와 서버 장바구니 모두 삭제 후 이전 페이지로 이동
  async function handleCancel() {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) {
      navigate("/order-method");
      return;
    }

    try {
      // localStorage 장바구니 초기화
      setLocalCart({});
      saveLocalCart({});

      // 서버 장바구니도 초기화
      await touchOrderService.clearTouchCart(sessionId);

      // cartData도 초기화
      setCartData({ orders: [], total_items: 0, total_price: 0 });

      // 기존 onCancelClick prop이 있으면 추가로 호출(기능 유지)
      if (typeof props.onCancelClick === "function") {
        props.onCancelClick();
      }

      // 이전 페이지로 이동
      navigate(-1);
    } catch (err) {
      console.error("Cancel error:", err);
      navigate("/order-method");
    }
  }

  // 더 담기: localStorage를 서버에 동기화 후 이동
  async function handleContinue() {
    try {
      // localStorage 데이터를 서버에 동기화
      await syncCartToServer();

      const raw = localStorage.getItem("order_spec");
      if (!raw) {
        return navigate("/order/touch"); // 기본은 터치 주문
      }

      const orderSpec = JSON.parse(raw) ?? {};
      const { point, mode } = orderSpec;

      // ✅ 1순위: mode가 color일 때
      if (mode === "color") {
        return navigate("/order/color");
      }

      // ✅ 2순위: 전화번호 간편주문 조건 충족
      if (point?.enabled && point?.phone) {
        return navigate("/order/phone");
      }

      // ✅ 기본은 터치 주문
      navigate("/order/touch");
    } catch (err) {
      console.error("더 담기 동기화 실패:", err);
      navigate("/order-method");
    }
  }

  // 주문하기: localStorage를 서버에 동기화 후 이동
  async function handleCheckout() {
    // localStorage 기반으로 빈 장바구니 체크
    const hasItems = Object.values(localCart).some(function (quantity) {
      return quantity > 0;
    });
    if (!hasItems) {
      alert("장바구니가 비어있습니다.");
      return;
    }

    try {
      // localStorage 데이터를 서버에 동기화
      await syncCartToServer();

      // 총 가격과 수량 계산 (localStorage 기반)
      let totalPrice = 0;
      let totalQty = 0;

      for (const [menuId, quantity] of Object.entries(localCart)) {
        if (quantity > 0) {
          totalQty += quantity;
          // cartData에서 해당 메뉴의 가격 찾기
          const orderItem = cartData?.orders?.find(
            (order) => order.menu_id === parseInt(menuId)
          );
          if (orderItem) {
            totalPrice += orderItem.price * quantity;
          }
        }
      }

      navigate("/order/package", {
        state: {
          totalPrice: totalPrice,
          totalQty: totalQty,
        },
      });
    } catch (err) {
      console.error("주문하기 동기화 실패:", err);
      navigate("/order-method");
    }
  }

  // localStorage 장바구니를 서버에 동기화 (원자성 보장)
  async function syncCartToServer() {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) return;

    try {
      // 일괄 업데이트로 원자성 보장
      await touchOrderService.bulkUpdateTouchCart(sessionId, localCart);
    } catch (error) {
      console.error("서버 동기화 실패:", error);
      throw error;
    }
  }

  // 수량 증가 (localStorage만 업데이트)
  function handleIncrease(menuId) {
    const currentQuantity = localCart[menuId] || 0;
    const newQuantity = currentQuantity + 1;

    const updatedCart = {
      ...localCart,
      [menuId]: newQuantity,
    };

    setLocalCart(updatedCart);
    saveLocalCart(updatedCart);
  }

  // 수량 감소 (localStorage만 업데이트, 0개가 되면 0으로 저장)
  function handleDecrease(menuId) {
    const currentQuantity = localCart[menuId] || 0;
    if (currentQuantity <= 0) return;

    const newQuantity = currentQuantity - 1;

    const updatedCart = {
      ...localCart,
      [menuId]: newQuantity,
    };

    setLocalCart(updatedCart);
    saveLocalCart(updatedCart);
  }

  // 커스텀 스크롤바 동기화
  useEffect(
    function syncCustomScrollbar() {
      const viewport = document.getElementById("cards-viewport");
      const thumb = document.getElementById("cards-thumb");
      if (!viewport || !thumb) return;

      let pointerMoveHandler = null;
      let pointerUpHandler = null;

      function updateThumb() {
        const { scrollWidth, clientWidth, scrollLeft } = viewport;
        const track = thumb.parentElement;
        if (!track) return;

        const trackWidth = track.offsetWidth;

        // 항상 스크롤바 표시 (UI 일관성을 위해)
        thumb.style.display = "block";

        const visibleRatio = clientWidth / scrollWidth;
        const thumbWidth = Math.max(80, Math.round(trackWidth * visibleRatio));
        const maxThumbOffset = trackWidth - thumbWidth;
        const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);

        // 스크롤이 필요하지 않으면 thumb을 전체 너비로 표시
        const finalThumbWidth = maxScrollLeft <= 0 ? trackWidth : thumbWidth;
        const left =
          maxScrollLeft > 0
            ? Math.round((scrollLeft / maxScrollLeft) * maxThumbOffset)
            : 0;
        thumb.style.width = `${finalThumbWidth}px`;
        thumb.style.transform = `translateX(${left}px)`;
      }

      // 초기 업데이트는 지연 실행 (DOM 렌더링 완료 후)
      const timer = setTimeout(updateThumb, 100);
      viewport.addEventListener("scroll", updateThumb, { passive: true });

      // 드래그로 썸을 움직여 스크롤 조작
      let isDragging = false;
      let startX = 0;
      let startLeft = 0;

      function onPointerDown(e) {
        isDragging = true;
        e.preventDefault();
        startX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;

        // transform 파싱을 안전하게 처리
        try {
          const transform = getComputedStyle(thumb).transform;
          if (transform && transform !== "none") {
            const matrix = new DOMMatrixReadOnly(transform);
            startLeft = matrix.m41 || 0;
          } else {
            startLeft = 0;
          }
        } catch (error) {
          console.warn("Transform 파싱 실패, 기본값 0 사용:", error);
          startLeft = 0;
        }

        pointerMoveHandler = onPointerMove;
        pointerUpHandler = onPointerUp;
        document.addEventListener("pointermove", pointerMoveHandler);
        document.addEventListener("pointerup", pointerUpHandler);
      }

      function onPointerMove(e) {
        if (!isDragging) return;
        const track = thumb.parentElement;
        if (!track) return;

        const trackWidth = track.offsetWidth;
        const { scrollWidth, clientWidth } = viewport;
        const visibleRatio = clientWidth / scrollWidth;
        const thumbWidth = Math.max(80, Math.round(trackWidth * visibleRatio));
        const maxThumbOffset = trackWidth - thumbWidth;
        const currentX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
        const delta = currentX - startX;
        const nextLeft = Math.max(
          0,
          Math.min(maxThumbOffset, startLeft + delta)
        );
        const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);
        const scrollLeft =
          maxThumbOffset > 0 && maxScrollLeft > 0
            ? (nextLeft / maxThumbOffset) * maxScrollLeft
            : 0;
        viewport.scrollLeft = isFinite(scrollLeft) ? scrollLeft : 0;
      }

      function onPointerUp() {
        isDragging = false;
        if (pointerMoveHandler) {
          document.removeEventListener("pointermove", pointerMoveHandler);
          pointerMoveHandler = null;
        }
        if (pointerUpHandler) {
          document.removeEventListener("pointerup", pointerUpHandler);
          pointerUpHandler = null;
        }
      }

      thumb.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("resize", updateThumb);

      return function cleanup() {
        clearTimeout(timer);
        viewport.removeEventListener("scroll", updateThumb);
        thumb.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("resize", updateThumb);
        if (pointerMoveHandler) {
          document.removeEventListener("pointermove", pointerMoveHandler);
        }
        if (pointerUpHandler) {
          document.removeEventListener("pointerup", pointerUpHandler);
        }
      };
    },
    [localCart, cartData]
  ); // 의존성 배열에 localCart와 cartData 추가

  // 로딩 상태
  if (loading) {
    return (
      <CartPageContainer>
        <HeaderContainer>
          <HeaderTitle>장바구니</HeaderTitle>
          <HeaderSubtitle>장바구니를 불러오는 중...</HeaderSubtitle>
        </HeaderContainer>
      </CartPageContainer>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <CartPageContainer>
        <HeaderContainer>
          <HeaderTitle>장바구니</HeaderTitle>
          <HeaderSubtitle>장바구니를 불러올 수 없습니다.</HeaderSubtitle>
        </HeaderContainer>
      </CartPageContainer>
    );
  }

  // localStorage 기반으로 화면 데이터 구성 (0개 상품 제외)
  const orders =
    cartData?.orders?.filter(function (order) {
      return (localCart[order.menu_id] || 0) > 0;
    }) || [];

  // localStorage 기반으로 총 수량과 가격 계산
  let totalQty = 0;
  let totalPrice = 0;

  for (const [menuId, quantity] of Object.entries(localCart)) {
    if (quantity > 0) {
      totalQty += quantity;
      const orderItem = cartData?.orders?.find(
        (order) => order.menu_id === parseInt(menuId)
      );
      if (orderItem) {
        totalPrice += orderItem.price * quantity;
      }
    }
  }

  return (
    <CartPageContainer>
      <HeaderContainer>
        <HeaderTitle>장바구니</HeaderTitle>
        <HeaderSubtitle>주문하신 음료들이 여기에 담겨있습니다.</HeaderSubtitle>
        <CancelButton type="button" onClick={handleCancel}>
          <CancelIcon src={CancelImage} alt="전체취소" />
          전체 취소
        </CancelButton>
      </HeaderContainer>

      <CardsViewport id="cards-viewport" style={{ outline: "none" }}>
        <CardsScrollArea aria-label="장바구니 항목 목록">
          {orders.map(function (order) {
            const product = {
              id: order.menu_id,
              name: order.menu_item,
              price: order.price,
              popular: order.popular,
              temp: order.temp,
              profileImage: order.profile, // profile 이미지 추가
            };
            // localStorage 기반 수량 사용
            const currentQuantity = localCart[order.menu_id] || 0;
            return (
              <CartProductCard
                key={order.menu_id}
                product={product}
                qty={currentQuantity}
                onIncrease={() => handleIncrease(order.menu_id)}
                onDecrease={() => handleDecrease(order.menu_id)}
              />
            );
          })}
        </CardsScrollArea>
      </CardsViewport>

      <CustomScrollbar
        role="scrollbar"
        aria-controls="cards-viewport"
        aria-orientation="horizontal"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="0"
      >
        <CustomTrack />
        <CustomThumb
          id="cards-thumb"
          tabIndex="0"
          aria-label="장바구니 스크롤"
        />
      </CustomScrollbar>

      <FooterBar>
        <FooterLeft>
          <FooterMetaRow>
            <FooterMetaLabel>주문 수량</FooterMetaLabel>
            <FooterDivider />
            <FooterMetaValue>총 {totalQty}개</FooterMetaValue>
          </FooterMetaRow>
          <FooterTotal>{formatCurrency(totalPrice)} 원</FooterTotal>
        </FooterLeft>
        <FooterRight>
          <SecondaryButton type="button" onClick={handleContinue}>
            더 담기 <PlusIcon />
          </SecondaryButton>
          <PrimaryButton type="button" onClick={handleCheckout}>
            주문하기
          </PrimaryButton>
        </FooterRight>
      </FooterBar>
    </CartPageContainer>
  );
}

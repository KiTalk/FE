import React, { useEffect } from "react";
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
import CartProvider from "../components/CartProvider.jsx";
import { useCart } from "../components/CartContext";
import CartProductCard from "../components/CartProductCard";
import CancelImage from "../assets/images/cancel.png";
import { useNavigate } from "react-router-dom";
import { getStorageKey, normalizeId } from "../utils/storage";

export default function CartPage(props) {
  return (
    <CartProvider>
      <Page>
        <CartHydrator initialItems={props.initialCart} />
        <CartContent {...props} />
      </Page>
    </CartProvider>
  );
}

function CartHydrator({ initialItems }) {
  const { addItem } = useCart();
  useEffect(
    function hydrate() {
      if (Array.isArray(initialItems) && initialItems.length > 0) {
        initialItems.forEach(function (it) {
          const qty = Number(it.qty ?? 1);
          if (it?.id && qty > 0) {
            addItem(
              {
                id: it.id,
                name: it.name,
                price: it.price,
                popular: !!it.popular,
                temp: it.temp,
              },
              qty
            );
          }
        });
      }
    },
    [initialItems, addItem]
  );
  return null;
}

function CartContent(props) {
  const navigate = useNavigate();
  const { items, totalQty, totalPrice, increase, decrease } = useCart();

  function formatCurrency(value) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : "0";
  }

  // ✅ 전체 취소: localStorage의 각 상품 수량을 "0"으로, 컨텍스트 수량도 0으로
  function handleCancel() {
    try {
      const LS = window.localStorage;

      // 1) localStorage 'added_total_{id}'를 모두 "0"으로 설정
      items.forEach((it) => {
        const normId = normalizeId(it?.id);
        if (!normId) return;
        const key = getStorageKey(normId);
        LS.setItem(key, "0"); // 요구사항: 삭제가 아니라 0으로 설정
      });

      // 2) 화면상의 장바구니 수량도 0이 되도록 감소 호출
      items.forEach((it) => {
        const count = Number(it?.qty ?? 0);
        for (let i = 0; i < count; i++) {
          decrease(it.id); // 항목 수량만큼 감소
        }
      });

      // 3) 기존 onCancelClick prop이 있으면 추가로 호출(기능 유지)
      if (typeof props.onCancelClick === "function") {
        props.onCancelClick();
      }
    } catch (err) {
      console.error("Cancel error:", err);
    }
  }

  function handleContinue() {
    try {
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
      console.error("Error checking order_spec:", err);
      navigate("/order/touch");
    }
  }

  function handleCheckout() {
    if (items.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
    }
    navigate("/order/package", {
      state: { totalPrice, totalQty },
    });
  }

  // 커스텀 스크롤바 동기화
  useEffect(function syncCustomScrollbar() {
    const viewport = document.getElementById("cards-viewport");
    const thumb = document.getElementById("cards-thumb");
    if (!viewport || !thumb) return;

    let pointerMoveHandler = null;
    let pointerUpHandler = null;

    function updateThumb() {
      const { scrollWidth, clientWidth, scrollLeft } = viewport;
      const track = thumb.parentElement;
      const trackWidth = track ? track.offsetWidth : 1222;
      const visibleRatio = clientWidth / scrollWidth;
      const thumbWidth = Math.max(80, Math.round(trackWidth * visibleRatio));
      const maxThumbOffset = trackWidth - thumbWidth;
      const maxScrollLeft = scrollWidth - clientWidth;
      const left =
        maxScrollLeft > 0
          ? Math.round((scrollLeft / maxScrollLeft) * maxThumbOffset)
          : 0;
      thumb.style.width = `${thumbWidth}px`;
      thumb.style.transform = `translateX(${left}px)`;
    }

    updateThumb();
    viewport.addEventListener("scroll", updateThumb, { passive: true });

    // 드래그로 썸을 움직여 스크롤 조작
    let isDragging = false;
    let startX = 0;
    let startLeft = 0;

    function onPointerDown(e) {
      isDragging = true;
      e.preventDefault();
      startX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const matrix = new DOMMatrixReadOnly(getComputedStyle(thumb).transform);
      startLeft = matrix.m41 || 0;
      pointerMoveHandler = onPointerMove;
      pointerUpHandler = onPointerUp;
      document.addEventListener("pointermove", pointerMoveHandler);
      document.addEventListener("pointerup", pointerUpHandler);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const track = thumb.parentElement;
      const trackWidth = track ? track.offsetWidth : 1222;
      const { scrollWidth, clientWidth } = viewport;
      const visibleRatio = clientWidth / scrollWidth;
      const thumbWidth = Math.max(80, Math.round(trackWidth * visibleRatio));
      const maxThumbOffset = trackWidth - thumbWidth;
      const currentX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const delta = currentX - startX;
      const nextLeft = Math.max(0, Math.min(maxThumbOffset, startLeft + delta));
      const maxScrollLeft = scrollWidth - clientWidth;
      const scrollLeft = (nextLeft / maxThumbOffset) * maxScrollLeft;
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
  }, []);

  return (
    <CartPageContainer>
      <HeaderContainer>
        <HeaderTitle>장바구니</HeaderTitle>
        <HeaderSubtitle>주문하신 음료들이 여기에 담겨있습니다.</HeaderSubtitle>
        <CancelButton type="button" onClick={handleCancel}>
          {/* ✅ 취소 시 수량 0으로 초기화 */}
          <CancelIcon src={CancelImage} alt="전체취소" />
          전체 취소
        </CancelButton>
      </HeaderContainer>

      <CardsViewport id="cards-viewport" style={{ outline: "none" }}>
        <CardsScrollArea aria-label="장바구니 항목 목록">
          {items.map(function (it) {
            return (
              <CartProductCard
                key={it.id}
                product={it}
                qty={it.qty}
                onIncrease={increase}
                onDecrease={decrease}
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
        <CustomThumb id="cards-thumb" tabIndex="0" aria-label="장바구니 스크롤" />
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

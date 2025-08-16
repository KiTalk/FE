import React, { useEffect } from "react";
import {
  Page,
  CartPageContainer,
  HeaderContainer,
  HeaderTitle,
  HeaderSubtitle,
  HelpButton,
  HelpIcon,
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
import helpImage from "../assets/images/help.png";
import { useNavigate } from "react-router-dom";

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

  function handleContinue() {
    navigate("/order/touch");
  }

  function handleCheckout() {
    if (items.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
    }

    // 다음 페이지로 이동 (포장유무, 적립유무 선택 페이지)
    navigate("/order/package", {
      state: { totalPrice, totalQty },
    });
  }

  // 커스텀 스크롤바 동기화
  useEffect(function syncCustomScrollbar() {
    const viewport = document.getElementById("cards-viewport");
    const thumb = document.getElementById("cards-thumb");
    if (!viewport || !thumb) return;

    // 이벤트 리스너를 위한 참조 보관
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
      e.preventDefault(); // 기본 드래그 동작 방지
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
      // 드래그 중 컴포넌트가 언마운트되는 경우를 위한 정리
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
        <HelpButton type="button" onClick={props.onHelpClick}>
          <HelpIcon src={helpImage} alt="도움요청" />
          도움 요청
        </HelpButton>
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

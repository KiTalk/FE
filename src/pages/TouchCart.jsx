import React, { useEffect, useMemo } from "react";
import {
  Page, CartPageContainer, HeaderContainer, HeaderTitle, HeaderSubtitle, HelpButton,
  CardsScrollArea, ProgressBarWrap, ProgressTrack, ProgressFill,
  FooterBar, FooterLeft, FooterMeta, FooterTotal, FooterRight, SecondaryButton, PrimaryButton,
  OptionsBar, OptionGroup, OptionLabel, OptionButton,
} from "./TouchCart.styles";
import CartProvider, { CART_STORAGE_KEY } from "../components/CartProvider.jsx";
import { useCart } from "../components/CartContext";
import ProductCard from "../components/ProductCard";
import helpImage from "../assets/images/help.png";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TouchCartPage(props) {
  return (
    <CartProvider>
      <Page>
        <CartHydrator initialItems={props.initialCart} />
        <TouchCartContent {...props} />
      </Page>
    </CartProvider>
  );
}

function CartHydrator({ initialItems }) {
  const { addItem } = useCart();
  useEffect(function hydrate() {
    if (Array.isArray(initialItems) && initialItems.length > 0) {
      initialItems.forEach(function (it) {
        const qty = Number(it.qty ?? 1);
        if (it?.id && qty > 0) {
          addItem({ id: it.id, name: it.name, price: it.price, popular: !!it.popular, temp: it.temp }, qty);
        }
      });
    }
  }, [initialItems, addItem]);
  return null;
}

function TouchCartContent(props) {
  const navigate = useNavigate();
  const { items, totalQty, totalPrice, increase, decrease, resetCart } = useCart();

  function formatCurrency(value) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : "0";
  }

  function handleContinue() {
    if (typeof props.onContinue === "function") props.onContinue();
  }

  async function handleCheckout() {
    if (!API_BASE_URL) {
      alert("API 서버 URL이 설정되지 않았습니다. (.env의 VITE_API_BASE_URL)");
      return;
    }
    if (items.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
    }

    const payload = {
      items: items.map(function (it) { return { id: it.id, name: it.name, price: it.price, qty: it.qty }; }),
      totalQty,
      totalPrice,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await safeReadText(res);
        throw new Error(msg || `주문 요청 실패 (status: ${res.status})`);
      }
      const data = await res.json().catch(function () { return {}; });

      try {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      } catch {}
      resetCart();

      navigate("/order/complete", {
        replace: true,
        state: { orderId: data?.id, totalPrice, totalQty },
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "주문 처리 중 오류가 발생했습니다.");
    }
  }

  async function safeReadText(res) { try { return await res.text(); } catch { return ""; } }

  const progressPercent = useMemo(function () {
    const capacity = props.capacity ?? 10;
    return Math.min(100, Math.round((totalQty / capacity) * 100));
  }, [totalQty, props.capacity]);

  return (
    <CartPageContainer>
      <HeaderContainer>
        <div className="__headerInner">
          <div>
            <HeaderTitle>장바구니</HeaderTitle>
            <HeaderSubtitle>주문하신 음료들이 여기에 담겨있습니다.</HeaderSubtitle>
          </div>
          <HelpButton type="button" onClick={props.onHelpClick}>
            <img src={helpImage} alt="도움요청" /> 도움 요청
          </HelpButton>
        </div>
      </HeaderContainer>

      <CardsScrollArea aria-label="장바구니 항목 목록">
        {items.map(function (it) {
          return (
            <ProductCard
              key={it.id}
              product={it}
              mode="cart"
              cartQty={it.qty}
              onIncrease={function onIncrease(){ increase(it.id); }}
              onDecrease={function onDecrease(){ decrease(it.id); }}
            />
          );
        })}
      </CardsScrollArea>

      <ProgressBarWrap>
        <ProgressTrack />
        <ProgressFill $percent={progressPercent} />
      </ProgressBarWrap>

      <FooterBar>
        <div className="__footerInner">
          <FooterLeft>
            <FooterMeta>주문 수량 | 총 {totalQty}개</FooterMeta>
            <FooterTotal>{formatCurrency(totalPrice)} 원</FooterTotal>
          </FooterLeft>
          <FooterRight>
            <SecondaryButton type="button" onClick={handleContinue}>더 담기 +</SecondaryButton>
            <PrimaryButton type="button" onClick={handleCheckout}>주문하기</PrimaryButton>
          </FooterRight>
        </div>
      </FooterBar>
    </CartPageContainer>
  );
}

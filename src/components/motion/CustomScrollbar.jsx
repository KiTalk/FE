import React, { useEffect, useRef, useCallback } from "react";
import {
  ScrollbarContainer,
  ScrollbarTrack,
  ScrollbarThumb,
} from "./CustomScrollbar.styles";

/**
 * 커스텀 세로 스크롤바 컴포넌트
 * @param {Object} props
 * @param {string} props.viewportSelector - 스크롤 뷰포트 요소를 찾을 CSS 셀렉터
 * @param {string} props.contentSelector - 스크롤 컨텐츠 요소를 찾을 CSS 셀렉터 (선택사항)
 * @param {Function} props.getFixedElements - 고정 요소들을 반환하는 함수 (hero, tabs 등)
 * @param {Object} props.positioning - 스크롤바 위치 조정 옵션
 * @param {number} props.positioning.topExtraOffset - 추가 상단 오프셋 (기본값: 40)
 * @param {number} props.positioning.bottomOffset - 하단 오프셋 (기본값: 70)
 * @param {number} props.positioning.rightOffset - 우측 오프셋 (기본값: 16)
 * @param {number} props.minThumbHeight - 썸 최소 높이 (기본값: 40)
 */
export default function CustomScrollbar({
  viewportSelector,
  contentSelector,
  getFixedElements,
  positioning = {},
  minThumbHeight = 40,
}) {
  const scrollbarRef = useRef(null);
  const thumbRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startTopRef = useRef(0);

  const {
    topExtraOffset = 40,
    bottomOffset = 70,
    rightOffset = 16,
  } = positioning;

  // 현재 transform에서 translateY(px) 안전 추출
  const getCurrentTranslateY = useCallback(function (elem) {
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
  }, []);

  // 썸 위치 및 크기 업데이트
  const updateThumb = useCallback(
    function () {
      const viewport = document.querySelector(viewportSelector);
      const thumb = thumbRef.current;
      if (!viewport || !thumb) return;

      const { scrollHeight, clientHeight, scrollTop } = viewport;
      const track = thumb.parentElement;
      const trackHeight = track ? track.offsetHeight : clientHeight || 420;
      const visibleRatio = clientHeight / (scrollHeight || 1);
      const thumbHeight = Math.max(
        minThumbHeight,
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
    },
    [viewportSelector, minThumbHeight]
  );

  // 스크롤바 위치 및 높이 업데이트
  const updateScrollbarGeometry = useCallback(
    function () {
      const scrollbar = scrollbarRef.current;
      if (!scrollbar) return;

      const fixedElements = getFixedElements ? getFixedElements() : {};
      const { hero, tabs } = fixedElements;

      const heroH = hero ? hero.offsetHeight : 0;
      const tabsH = tabs ? tabs.offsetHeight : 0;
      const topOffset = heroH + tabsH + 16 + topExtraOffset; // 상단 여백
      const height = Math.max(0, window.innerHeight - topOffset - bottomOffset);

      scrollbar.style.top = `${topOffset}px`;
      scrollbar.style.height = `${height}px`;
      scrollbar.style.right = `${rightOffset}px`;
    },
    [getFixedElements, topExtraOffset, bottomOffset, rightOffset]
  );

  // 포인터 이벤트 핸들러들
  const onPointerDown = useCallback(
    function (e) {
      isDraggingRef.current = true;
      e.preventDefault();
      startYRef.current =
        e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      startTopRef.current = getCurrentTranslateY(thumbRef.current);
    },
    [getCurrentTranslateY]
  );

  const onPointerMove = useCallback(
    function (e) {
      if (!isDraggingRef.current) return;

      const viewport = document.querySelector(viewportSelector);
      const thumb = thumbRef.current;
      if (!viewport || !thumb) return;

      const track = thumb.parentElement;
      const trackHeight = track
        ? track.offsetHeight
        : viewport.clientHeight || 420;
      const { scrollHeight, clientHeight } = viewport;
      const visibleRatio = clientHeight / (scrollHeight || 1);
      const thumbHeight = Math.max(
        minThumbHeight,
        Math.round(trackHeight * Math.min(1, visibleRatio))
      );
      const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);
      const currentY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      const delta = currentY - startYRef.current;
      const nextTop = Math.max(
        0,
        Math.min(maxThumbOffset, startTopRef.current + delta)
      );
      const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
      const scrollTop = (nextTop / (maxThumbOffset || 1)) * maxScrollTop;

      viewport.scrollTop = Number.isFinite(scrollTop) ? scrollTop : 0;
      thumb.style.transform = `translateY(${nextTop}px)`;
    },
    [viewportSelector, minThumbHeight]
  );

  const onPointerUp = useCallback(function () {
    isDraggingRef.current = false;
  }, []);

  useEffect(
    function () {
      const viewport = document.querySelector(viewportSelector);
      const content = contentSelector
        ? document.querySelector(contentSelector)
        : null;
      const thumb = thumbRef.current;
      const scrollbar = scrollbarRef.current;

      if (!viewport || !thumb || !scrollbar) return;

      let resizeObserver = null;

      // 초기 설정 - 약간의 지연으로 DOM 완전 렌더 후 계산
      const initTimeout = setTimeout(function () {
        updateScrollbarGeometry();
        updateThumb();
      }, 50);

      // 초기 설정
      updateScrollbarGeometry();
      updateThumb();

      // 이벤트 리스너 등록
      viewport.addEventListener("scroll", updateThumb, { passive: true });
      thumb.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
      window.addEventListener("resize", updateThumb);
      window.addEventListener("resize", updateScrollbarGeometry);
      window.addEventListener("load", updateThumb);

      // ResizeObserver로 콘텐츠 높이 변화 감지
      try {
        resizeObserver = new ResizeObserver(function () {
          updateScrollbarGeometry();
          updateThumb();
        });
        if (content) resizeObserver.observe(content);
      } catch (e) {
        console.warn("ResizeObserver not supported:", e);
      }

      // 정리 함수
      return function () {
        clearTimeout(initTimeout);
        viewport.removeEventListener("scroll", updateThumb);
        thumb.removeEventListener("pointerdown", onPointerDown);
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("resize", updateThumb);
        window.removeEventListener("resize", updateScrollbarGeometry);
        window.removeEventListener("load", updateThumb);
        if (resizeObserver) resizeObserver.disconnect();
      };
    },
    [
      viewportSelector,
      contentSelector,
      updateThumb,
      updateScrollbarGeometry,
      onPointerDown,
      onPointerMove,
      onPointerUp,
    ]
  );

  return (
    <ScrollbarContainer
      ref={scrollbarRef}
      role="scrollbar"
      aria-orientation="vertical"
    >
      <ScrollbarTrack />
      <ScrollbarThumb ref={thumbRef} tabIndex="0" aria-label="페이지 스크롤" />
    </ScrollbarContainer>
  );
}

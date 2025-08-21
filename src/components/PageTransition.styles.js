export const FADE_TRANSITION = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
};

// 페이드 애니메이션 변형
export const FADE_VARIANTS = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const CONTAINER_STYLE = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  overflow: "visible",
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
};

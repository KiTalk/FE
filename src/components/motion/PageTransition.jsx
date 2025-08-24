import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  FADE_VARIANTS,
  CONTAINER_STYLE,
  FADE_TRANSITION,
} from "./PageTransition.styles";

const MotionDiv = motion.div;

export default function PageTransition({ children, stableKey = true }) {
  const location = useLocation();
  const initialPathRef = useRef(location.pathname);
  const motionKey = stableKey ? initialPathRef.current : location.pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionDiv
        key={motionKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={FADE_VARIANTS}
        transition={FADE_TRANSITION}
        style={CONTAINER_STYLE}
      >
        {children}
      </MotionDiv>
    </AnimatePresence>
  );
}

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  FADE_VARIANTS,
  CONTAINER_STYLE,
  FADE_TRANSITION,
} from "./PageTransition.styles";

const MotionDiv = motion.div;

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionDiv
        key={location.pathname}
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
};

export default PageTransition;

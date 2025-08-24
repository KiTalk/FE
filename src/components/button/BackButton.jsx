import React from "react";
import {
  BackButtonWrapper,
  BackButtonRoot,
  BackIcon,
} from "./BackButton.styles";
import backImage from "../../assets/images/back.png";

export default function BackButton({
  onClick,
  ariaLabel = "뒤로가기",
  top,
  left,
}) {
  return (
    <BackButtonWrapper style={{ top, left }}>
      <BackButtonRoot onClick={onClick} aria-label={ariaLabel}>
        <BackIcon src={backImage} alt={ariaLabel} />
      </BackButtonRoot>
    </BackButtonWrapper>
  );
}

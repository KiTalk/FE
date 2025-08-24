import React from "react";
import {
  HomeButtonWrapper,
  HomeButtonRoot,
  HomeIcon,
} from "./HomeButton.styles";
import homeImage from "../../assets/images/home.png";

export default function HomeButton({
  onClick,
  ariaLabel = "홈으로",
  top,
  left,
}) {
  return (
    <HomeButtonWrapper style={{ top, left }}>
      <HomeButtonRoot onClick={onClick} aria-label={ariaLabel}>
        <HomeIcon src={homeImage} alt={ariaLabel} />
      </HomeButtonRoot>
    </HomeButtonWrapper>
  );
}

import styled from "styled-components";

export const BackButtonWrapper = styled.div`
  position: absolute;
  top: 4.8125rem; /* 77px */
  left: 6.375rem; /* 102px */
  width: 7.875rem; /* 126px */
  height: 7.875rem; /* 126px */
`;

export const BackButtonRoot = styled.button`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: none;

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: none;
  }
  &:active {
    background: transparent;
    transform: none;
    box-shadow: none;
    filter: none;
  }
`;

export const BackIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
`;

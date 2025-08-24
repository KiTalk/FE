import styled from "styled-components";

export const HomeButtonWrapper = styled.div`
  position: absolute;
  top: 4.8125rem;
  left: 6.375rem;
  width: 7.875rem;
  height: 7.875rem;
`;

export const HomeButtonRoot = styled.button`
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

  &:hover {
    background: transparent;
    transform: none;
    box-shadow: none;
    filter: none;
  }

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

export const HomeIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
`;

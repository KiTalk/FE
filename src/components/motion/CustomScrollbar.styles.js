import styled from "styled-components";

export const ScrollbarContainer = styled.div`
  position: fixed;
  z-index: 1000;
  width: 0.875rem;
  background: transparent;
  pointer-events: none;
`;

export const ScrollbarTrack = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #e9f0f9;
  border-radius: 0.75rem;
`;

export const ScrollbarThumb = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 2.5rem;
  height: 4rem;
  background: #ffba59;
  border-radius: 0.75rem;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease;

  &:hover {
    background: #ffb84d;
  }

  &:active {
    background: #ff9900;
  }

  &:focus {
    outline: 2px solid #223770;
    outline-offset: 2px;
  }
`;

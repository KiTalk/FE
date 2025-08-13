import styled, { css } from "styled-components";

export const CategoryBar = styled.div`
  position: relative;
  width: 90rem;
  height: 6.4375rem;
  margin: 0 auto;
  background: #f2f6fb;
  display: flex;
  align-items: center;
`;

export const CategoryInner = styled.div`
  width: 76.375rem;
  height: 5.625rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 18px;
`;

const inactiveTab = css`
  background: #53669d;
  color: #ffffff;
  font-weight: 500;
`;

const activeTab = css`
  background: #ffffff;
  color: #272727;
  font-weight: 700;
  box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.25);
`;

export const CategoryTab = styled.button`
  flex: 0 0 230px;
  width: 230px;
  height: 5.625rem;
  border: none;
  border-radius: 20px 20px 0 0;
  cursor: pointer;
  font-size: 36px;
  letter-spacing: -0.015em;
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  user-select: none;
  ${(p) => (p.$active ? activeTab : inactiveTab)}

  &:hover {
    background: ${(p) => (p.$active ? "#ffffff" : "#53669d")};
    color: ${(p) => (p.$active ? "#272727" : "#ffffff")};
    box-shadow: ${(p) => (p.$active ? "2px 2px 7px rgba(0,0,0,0.25)" : "none")};
  }

  &:active {
    background: ${(p) => (p.$active ? "#ffffff" : "#53669d")};
    color: ${(p) => (p.$active ? "#272727" : "#ffffff")};
    box-shadow: ${(p) => (p.$active ? "2px 2px 7px rgba(0,0,0,0.25)" : "none")};
  }

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: ${(p) => (p.$active ? "2px 2px 7px rgba(0,0,0,0.25)" : "none")};
  }
`;

import styled, { css, keyframes } from "styled-components";

// 토스트 애니메이션
export const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

// 토스트 컨테이너
export const ToastContainer = styled.div`
  position: absolute;
  width: 30.875rem;
  height: 6.75rem;
  left: calc(50% - 494px / 2 + 6px);
  bottom: 6.69rem;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${(props) => (props.$isVisible ? slideIn : slideOut)} 0.3s
    ease-in-out;
`;

// 토스트 텍스트
export const ToastText = styled.span`
  color: #ffffff;
  font-size: 2.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.04313rem;
`;

export const Page = styled.div`
  position: relative;
  width: 1440px;
  height: 1024px;
  margin: 0 auto;
  background: #f2f6fb;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
`;

export const Title = styled.h1`
  position: absolute;
  left: 17.375rem;
  top: 5.75rem;
  margin: 0;
  font-weight: 700;
  font-size: 5rem;
  line-height: 5.9375rem;
  letter-spacing: -0.015em;
  color: #272727;
`;

export const Subtitle = styled.p`
  position: absolute;
  left: 17.75rem;
  top: 12.6875rem;
  margin: 0;
  width: 62.1875rem;
  height: 3.4375rem;
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 2.875rem;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.16rem;
  color: #5d5d5d;
  white-space: nowrap;
`;

export const Panel = styled.div`
  position: absolute;
  left: 6.5rem;
  top: 19.3125rem;
  width: 76.25rem;
  height: 40.6875rem;
  background: #ffffff;
  box-shadow: 0.1875rem 0.4375rem 0.625rem rgba(0, 0, 0, 0.25);
  border-radius: 1.875rem;
`;

export const InputArea = styled.div`
  position: absolute;
  left: 1.625rem;
  top: 2.6875rem;
  width: 35.25rem;
  height: 19.8125rem;
`;

export const InputHeading = styled.div`
  position: absolute;
  left: 1.0625rem;
  top: 0rem;
  height: 3.125rem;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 2.25rem;
  letter-spacing: -0.015em;
  color: #272727;
`;

export const Instruction = styled.div`
  position: absolute;
  left: 1.6875rem;
  top: 13.25rem;
  width: 33.3125rem;
  height: 6.25rem;
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 2.25rem;
  line-height: 3.125rem;
  letter-spacing: -0.015em;
  color: #5d5d5d;
  white-space: nowrap;
`;

export const PhoneRow = styled.div`
  position: absolute;
  left: 0.8125rem;
  top: 6.8125rem;
  height: 4.5625rem;
  width: 35.25rem;
`;

export const BottomAccent = styled.div`
  position: absolute;
  top: 4.5rem;
  width: 36.75rem;
  height: 0.3125rem;
  background: #223770;
`;

export const Segment = styled.span`
  position: absolute;
  left: ${(p) =>
    p.slot === "mid"
      ? "calc(10.45rem + 2.25rem + 0.5rem)"
      : p.slot === "tail"
      ? "calc(23.75rem + 2.25rem + 0.5rem)"
      : "1.5rem"};
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  height: 3.125rem;
  font-weight: 650;
  font-size: 4rem;
  font-style: normal;
  letter-spacing: -0.06rem;
  color: #272727;
  white-space: nowrap;
`;

export const Hyphen = styled.span`
  position: absolute;
  width: 2.25rem;
  height: 2.25rem;
  top: 0.8rem;
  left: ${(p) => (p.index === 2 ? "23.2rem" : "9.7rem")};
  display: block;
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1.5625rem;
    height: 0.1875rem;
    background: #878787;
  }
`;

export const Keypad = styled.div`
  position: absolute;
  left: 45.0625rem;
  top: 2.75rem;
  width: 26.0625rem;
  height: 35.25rem;
  display: grid;
  grid-template-columns: repeat(3, 7.875rem);
  grid-auto-rows: 7.875rem;
  gap: 1.25rem 1.25rem;
`;

export const KeyButton = styled.button`
  width: 7.875rem;
  height: 7.875rem;
  border-radius: 50%;
  border: none;
  background: #f2f2f2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.375rem;
  color: #272727;
  font-weight: 400;
  white-space: nowrap;

  &:focus {
    outline: none;
  }

  ${(p) =>
    p.variant === "action" &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}
  ${(p) =>
    p.disabled &&
    css`
      opacity: 0.9;
      cursor: default;
    `}
`;

export const SaveButton = styled(KeyButton)`
  background: ${(p) => (p.disabled ? "#adadad" : "#223770")};
  color: #ffffff;
  font-weight: 600;
  font-size: 2rem;
`;

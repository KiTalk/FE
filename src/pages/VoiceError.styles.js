import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  width: 1440px;
  height: 1024px;
  margin: 0 auto;
  background: #f2f6fb;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: absolute;
  width: 66.4375rem;
  height: 16.375rem;
  left: calc(50% - 66.4375rem / 2 + 0.03125rem);
  top: 28.3125rem;
`;

export const MainMessage = styled.h1`
  width: 66.5rem;
  height: 10rem;

  text-align: center;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 6.25rem;
  line-height: 160%;
  letter-spacing: -0.09375rem;
  color: #272727;

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0;
  white-space: nowrap;
`;

export const SubMessage = styled.p`
  width: 58.25rem;
  height: 6.375rem;

  text-align: center;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 4rem;
  line-height: 160%;
  letter-spacing: -0.06rem;
  color: #5d5d5d;

  flex: none;
  order: 1;
  flex-grow: 0;
  margin: 0;
  white-space: nowrap;
`;

export const WarningImage = styled.img`
  position: absolute;
  width: 13.0625rem;
  height: 13.0625rem;
  left: 38.4375rem;
  top: 15.25rem;
  object-fit: contain;
`;

export const RetryButton = styled.button`
  position: absolute;
  width: 26rem;
  height: 9.375rem;
  left: calc(50% - 26rem / 2);
  top: 48.6875rem;

  background: linear-gradient(360deg, #223770 0%, #375ab9 100%);
  border-radius: 1.875rem 1.875rem 0rem 1.875rem;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.25rem 1.25rem rgba(34, 55, 112, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const RetryButtonContent = styled.div`
  gap: 1.125rem;
`;

export const MicIcon = styled.img`
  position: absolute;
  top: 2.5rem;
  left: 2.36rem;
  width: 4.375rem;
  height: 4.375rem;
`;

export const RetryButtonText = styled.span`
  position: absolute;
  top: 3.125rem;
  left: 7.16rem;
  width: 13.5rem;
  height: 3rem;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 3rem;
  line-height: 3rem;
  color: #ffffff;
  letter-spacing: -0.015em;
  white-space: nowrap;
  display: flex;
  align-items: center;
  text-align: center;
`;

export const FingerGuide = styled.img`
  position: absolute;
  height: 12.5rem;
  left: 57.5%;
  right: 28.61%;
  top: calc(50% - 12.5rem / 2 + 25.125rem);

  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  &::before {
    content: "";
    position: absolute;
    left: 2.08%;
    right: 2.44%;
    top: 4.38%;
    bottom: 0.13%;
    background: linear-gradient(
      147.02deg,
      #ffffff 5.95%,
      rgba(255, 255, 255, 0.98) 14.17%,
      rgba(255, 255, 255, 0.92) 24.03%,
      rgba(255, 255, 255, 0.82) 35.53%,
      rgba(255, 255, 255, 0.68) 47.86%,
      rgba(255, 255, 255, 0.51) 60.18%,
      rgba(255, 255, 255, 0.29) 73.33%,
      rgba(255, 255, 255, 0.04) 86.47%,
      rgba(255, 255, 255, 0) 88.12%
    );
    pointer-events: none;
  }
`;

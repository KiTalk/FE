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

export const Title = styled.h1`
  position: absolute;
  width: 42.625rem;
  height: 10.75rem;
  left: 23.6875rem;
  top: 35.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #000000;
  font-size: 4rem;
  font-style: normal;
  font-weight: 570;
  line-height: 86px;
  letter-spacing: -0.015em;
  white-space: nowrap;
`;

export const Example = styled.p`
  position: absolute;
  width: ${(props) => (props.wide ? "703px" : "409px")};
  height: 3.125rem;
  left: ${(props) => (props.wide ? "23.0625rem" : "32.25rem")};
  top: ${(props) => props.top || "50.875rem"};
  display: flex;
  justify-content: center;
  text-align: center;
  color: #878787;
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: 3.125rem;
  letter-spacing: -0.03375rem;
  white-space: nowrap;
`;

export const MicButton = styled.button`
  position: absolute;
  width: 296px;
  height: 296px;
  left: calc(50% - 296px / 2);
  top: 238px;
  background: linear-gradient(360deg, #223770 0%, #375ab9 90.88%);
  box-shadow: 3px 7px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

export const MicIcon = styled.img`
  position: absolute;
  width: 12.5rem;
  height: 12.5rem;
  left: 38.8125rem;
  top: 17.875rem;
  object-fit: contain;
  pointer-events: none;
`;

export const FingerGuide = styled.img`
  position: absolute;
  left: 48.4375rem;
  top: 21.4375rem;
  width: 13.0625rem;
  height: auto;
  object-fit: contain;
  pointer-events: none;
`;

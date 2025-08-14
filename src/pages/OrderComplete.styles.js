import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  width: 1440px;
  height: 1024px;
  margin: 0 auto;
  background: #f2f6fb;
  overflow: hidden;
`;

export const Frame = styled.div`
  position: absolute;
  top: 31rem;
  left: 17.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  width: 54.5625rem;
  height: 16.375rem;
`;

export const Title = styled.h1`
  width: 100%;
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 6.25rem;
  line-height: 160%;
  letter-spacing: -0.015em;
  color: #272727;
  white-space: nowrap;
`;

export const Subtitle = styled.p`
  width: 54.5625rem;
  height: 6.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 4rem;
  line-height: 160%;
  letter-spacing: -0.015em;
  color: #5d5d5d;
`;

export const CheckImage = styled.img`
  position: absolute;
  top: 16rem;
  left: 40.1rem;
  width: 10rem;
  height: 10rem;
  object-fit: contain;
`;

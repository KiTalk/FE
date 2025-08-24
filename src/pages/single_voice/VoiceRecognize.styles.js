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
  width: 13.25rem;
  height: 5.375rem;
  left: calc(50% - 13.25rem / 2);
  top: calc(50% - 5.375rem / 2 - 0.875rem);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #272727;
  font-size: 4rem;
  font-style: normal;
  font-weight: 600;
  line-height: 5.375rem;
  letter-spacing: -0.015em;
  white-space: nowrap;
`;

export const RecognizedText = styled.p`
  position: absolute;
  width: 38.0625rem;
  height: 3.125rem;
  left: calc(50% - 38.0625rem / 2 + 0.03125rem);
  top: calc(50% - 3.125rem / 2 + 24.1875rem);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #272727;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 3.125rem;
  letter-spacing: -0.015em;
  white-space: nowrap;
`;

export const ExampleBox = styled.div`
  position: absolute;
  width: 48rem;
  height: 11.875rem;
  left: 20.875rem;
  top: 37.5625rem;
  background: #ffffff;
  border: 0.125rem solid #7889bc;
  border-radius: 1.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ExampleHeading = styled.div`
  color: #272727;
  font-size: 3rem;
  font-style: normal;
  font-weight: 600;
  line-height: 3.75rem;
  letter-spacing: -0.015em;
  margin-bottom: 0.5rem;
`;

export const ExampleGray = styled.div`
  color: #878787;
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: 3.125rem;
  letter-spacing: -0.015em;
`;

export const DoneButton = styled.button`
  position: absolute;
  width: 15.625rem;
  height: 6.25rem;
  left: 68.875rem;
  top: 53.0625rem;
  background: #223770;
  border-radius: 1.25rem;
  border: none;
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 3rem;
  cursor: pointer;
`;

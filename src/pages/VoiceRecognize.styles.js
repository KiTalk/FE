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
  width: 212px;
  height: 86px;
  left: calc(50% - 212px / 2);
  top: calc(50% - 86px / 2 - 14px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #272727;
  font-size: 64px;
  font-style: normal;
  font-weight: 600;
  line-height: 86px;
  letter-spacing: -0.015em;
  white-space: nowrap;
`;

export const RecognizedText = styled.p`
  position: absolute;
  width: 609px;
  height: 50px;
  left: calc(50% - 609px / 2 + 0.5px);
  top: calc(50% - 50px / 2 + 387px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #272727;
  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: 50px;
  letter-spacing: -0.015em;
  white-space: nowrap;
`;

export const ExampleBox = styled.div`
  position: absolute;
  width: 768px;
  height: 190px;
  left: 334px;
  top: 601px;
  background: #ffffff;
  border: 2px solid #7889bc;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ExampleHeading = styled.div`
  color: #272727;
  font-size: 48px;
  font-style: normal;
  font-weight: 600;
  line-height: 60px;
  letter-spacing: -0.015em;
  margin-bottom: 8px;
`;

export const ExampleGray = styled.div`
  color: #878787;
  font-size: 36px;
  font-style: normal;
  font-weight: 500;
  line-height: 50px;
  letter-spacing: -0.015em;
`;

export const DoneButton = styled.button`
  position: absolute;
  width: 250px;
  height: 100px;
  left: 1102px;
  top: 849px;
  background: #223770;
  border-radius: 20px;
  border: none;
  color: #ffffff;
  font-size: 40px;
  font-weight: 600;
  line-height: 48px;
  cursor: pointer;
`;

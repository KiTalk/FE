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

export const BottomBar = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 1440px;
  height: 229px;
  background: #223770;
  border-radius: 30px 30px 0px 0px;
`;

export const Title = styled.h1`
  position: absolute;
  width: max-content;
  left: 21.1875rem;
  top: 6.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 4rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.06rem;
`;

export const Card = styled.button`
  position: absolute;
  width: 514px;
  height: 600px;
  background: #ffffff;
  box-shadow: 3px 7px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  z-index: 1;
  border: none;
  cursor: pointer;
  transition: background-color 0.1s ease;

  &:focus {
    outline: none;
  }
`;

export const CardLeft = styled(Card)`
  left: 184px;
  top: 290px;
`;

export const CardRight = styled(Card)`
  left: 742px;
  top: 290px;
`;

export const CardTitle = styled.div`
  position: absolute;
  height: 5.25rem;
  top: 24.44rem;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 700;
  font-size: 70px;
  line-height: 84px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.015em;
  color: #272727;
`;

export const CardExample = styled.div`
  position: absolute;
  height: 3.125rem;
  top: 30.62rem;
  left: 50%;
  margin-top: 0.94rem;
  transform: translateX(-50%);
  font-weight: 500;
  font-size: 36px;
  line-height: 50px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.015em;
  color: #878787;
  white-space: nowrap;
`;

export const CardImage = styled.img`
  position: absolute;
  inset: 0;
  top: 3.81rem;
  left: 6.69rem;
  width: 18.75rem;
  height: 18.75rem;
  flex-shrink: 0;
  object-fit: contain;
  pointer-events: none;
`;

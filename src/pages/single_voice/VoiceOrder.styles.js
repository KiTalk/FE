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
  font-weight: 570;
  line-height: normal;
  letter-spacing: -0.06rem;
`;

export const Card = styled.button`
  position: absolute;
  width: 32.125rem;
  height: 37.5rem;
  background: #ffffff;
  box-shadow: 0.1875rem 0.4375rem 0.625rem rgba(0, 0, 0, 0.25);
  border-radius: 1.875rem;
  z-index: 1;
  border: none;
  cursor: pointer;
  transition: background-color 0.1s ease;

  &:focus {
    outline: none;
  }
`;

export const CardLeft = styled(Card)`
  left: 11.5rem;
  top: 18.125rem;
`;

export const CardRight = styled(Card)`
  left: 46.375rem;
  top: 18.125rem;
`;

export const CardTitle = styled.div`
  position: absolute;
  height: 5.25rem;
  top: 23.44rem;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 650;
  font-size: 4.375rem;
  line-height: 5.25rem;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.015em;
  color: #272727;
  white-space: nowrap;
`;

export const CardExample = styled.div`
  position: absolute;
  height: 3.125rem;
  top: 29.62rem;
  left: 50%;
  margin-top: 0.94rem;
  transform: translateX(-50%);
  font-weight: 500;
  font-size: 2.25rem;
  line-height: 3.125rem;
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
  left: 6.99rem;
  width: 18.75rem;
  height: 18.75rem;
  flex-shrink: 0;
  object-fit: contain;
  pointer-events: none;
`;

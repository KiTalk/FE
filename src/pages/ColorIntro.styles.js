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
  border-radius: 1.875rem 1.875rem 0 0;
`;

export const Title = styled.h1`
  position: absolute;
  width: 57.125rem;
  height: 4.75rem;
  left: 17.06rem;
  top: 6.25rem;
  text-align: center;
  font-size: 4rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.06rem;
  color: #272727;
  white-space: nowrap;
`;

export const SubTitle = styled.h2`
  position: absolute;
  width: 38.125rem;
  height: 3.4375rem;
  left: 17.06rem;
  top: 11.88rem;
  font-size: 2.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.04313rem;
  color: #5d5d5d;
  white-space: nowrap;
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
  border: 0.5rem solid #4D9E17;
`;

export const CardRight = styled(Card)`
  left: 46.375rem;
  top: 18.125rem;
  border: 0.5rem solid #9F1FDA;
`;

export const CardTitle = styled.div`
  position: absolute;
  width: 15.125rem;
  height: 5.25rem;
  top: 22.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 600;
  font-style: normal;
  font-size: 3.5rem;
  line-height: normal;
  text-align: center;
  color: #272727;
  white-space: nowrap;
`;

export const CardExample = styled.div`
  position: absolute;
  height: 3.125rem;
  top: 27.44rem;
  left: 50%;
  margin-top: 0.75rem;
  transform: translateX(-50%);
  font-weight: 400;
  font-size: 2rem;
  font-style: normal;
  line-height: normal;
  text-align: center;
  color: #272727;
  white-space: nowrap;
`;

export const CardImage = styled.img`
  position: absolute;
  inset: 0;
  top: 6.19rem;
  left: 11.26rem;
  width: 8.9621rem;
  height: 14.6082rem;
  flex-shrink: 0;
  object-fit: contain;
  pointer-events: none;
`;

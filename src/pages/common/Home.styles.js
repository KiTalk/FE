import styled from "styled-components";

export const WaitingScreenContainer = styled.div`
  position: relative;
  width: 1440px;
  height: 1024px;
  background: #f2f6fb;
  margin: 0 auto;
  overflow: hidden;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
`;

export const LogoContainer = styled.div`
  position: absolute;
  top: 3.5rem;
  left: 4rem;
  width: 11.875rem;
  height: 2.5007rem;
`;

export const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const SubtitleText = styled.div`
  position: absolute;
  width: 43.6875rem;
  height: 5.8125rem;
  top: 20.75rem;
  left: calc(50% - 46.6875rem / 2);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 4rem;
  line-height: 145%;
  display: flex;
  align-items: center;
  letter-spacing: -1.5%;
  white-space: nowrap;

  color: #272727;
`;

export const TitleGroup = styled.div`
  position: absolute;
  width: 52rem;
  top: 26.375rem;
  left: calc(50% - 52rem / 2);

  display: flex;
  align-items: center;
  gap: 1.25rem;
  white-space: nowrap;
`;

export const TitleBlue = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 6.25rem;
  line-height: 145%;
  display: flex;
  align-items: center;
  letter-spacing: -2%;
  white-space: nowrap;

  color: #224094;
`;

export const TitleBlack = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 6.25rem;
  line-height: 145%;
  display: flex;
  align-items: center;
  letter-spacing: -1.5%;
  white-space: nowrap;

  color: #272727;
`;

export const OrderButton = styled.button`
  position: absolute;
  width: 55rem;
  height: 9.375rem;
  left: calc(50% - 53.5rem / 2);
  top: 41.625rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #223770;
  border-radius: 1.875rem;

  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.5rem 1.25rem rgba(34, 55, 112, 0.3);
  }

  &:focus {
    outline: none;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const OrderButtonText = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 3rem;
  line-height: 100%;
  letter-spacing: 0%;

  color: #ffffff;
`;

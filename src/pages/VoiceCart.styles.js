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

export const HeadingRow = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 7.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5.375rem;
`;

export const HeadingPrimary = styled.span`
  color: #223770;
  font-weight: 700;
  font-size: 4rem;
  line-height: 5.375rem;
  letter-spacing: -0.015em;
`;

export const HeadingSecondary = styled.span`
  color: #272727;
  font-weight: 500;
  font-size: 4rem;
  line-height: 5.375rem;
  letter-spacing: -0.015em;
`;

export const Subtitle = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 12.25rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #272727;
  font-size: 3rem;
  font-style: normal;
  font-weight: 500;
  line-height: 4.375rem;
  letter-spacing: -0.045rem;
`;

export const PrimaryButton = styled.button`
  position: absolute;
  right: 6.875rem;
  bottom: 3rem;
  width: 15.625rem;
  height: 6.25rem;
  border: none;
  background: #223770;
  color: #ffffff;
  font-weight: 600;
  font-size: 2.5rem;
  border-radius: 1.25rem;
  cursor: pointer;
`;

export const OutlineButton = styled.button`
  position: absolute;
  left: 6.875rem;
  bottom: 3rem;
  width: 15.3125rem;
  height: 6.25rem;
  border: 0.1875rem solid #272727;
  background: transparent;
  color: #272727;
  font-weight: 500;
  font-size: 2.5rem;
  border-radius: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2.5rem;
  letter-spacing: -0.0375em;
  white-space: nowrap;
`;

export const OutlineButtonTop = styled(OutlineButton)`
  bottom: 11.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  white-space: nowrap;
`;

export const PlusIcon = styled.span`
  position: relative;
  display: inline-block;
  width: 2.25rem;
  height: 2.5rem;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 1.4rem;
    left: 1.7rem;
    width: 1.625rem;
    height: 0.1875rem;
    background: #272727;
    transform: translate(-50%, -50%);
  }
  &::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
`;

export const RecognizingText = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 8.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #272727;
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: 3.125rem;
  letter-spacing: -0.03375rem;
`;

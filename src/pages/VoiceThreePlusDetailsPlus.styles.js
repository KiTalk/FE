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

export const GuideSection = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const ProfileIcon = styled.img`
  position: absolute;
  width: 6.0625rem;
  height: 6.0625rem;
  top: 4.375rem;
  left: 6.875rem;
  background: #ffffff;
  border-radius: 50%;
  object-fit: cover;
`;

export const MessageBubble = styled.div`
  position: absolute;
  width: 48rem;
  height: 12.625rem;
  top: 4.375rem;
  left: 15.4375rem;
  background: #ffffff;
  border: 0.125rem solid #dcdcdc;
  border-radius: 0 1.875rem 1.875rem 1.875rem;
  box-sizing: border-box;
`;

export const MainTitle = styled.h1`
  position: absolute;
  width: 33.5rem;
  height: 3.75rem;
  top: 2.5rem;
  left: 4rem;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 3rem;
  line-height: 3.75rem;
  letter-spacing: -0.045em;
  color: #272727;
  white-space: nowrap;
`;

export const ExampleText = styled.p`
  position: absolute;
  width: 15.6875rem;
  height: 3rem;
  top: 7.12rem;
  left: 4rem;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 2.25rem;
  line-height: 3rem;
  letter-spacing: -0.03375rem;
  color: #878787;
  white-space: nowrap;
`;

export const SpeakButton = styled.button`
  position: absolute;
  width: 44rem;
  height: 9.375rem;
  top: 19.5rem;
  left: 39.125rem;
  background: linear-gradient(360deg, #223770 0%, #375ab9 100%);
  border-radius: 1.875rem 1.875rem 0 1.875rem;
  border: none;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
  }
`;

export const SpeakButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.125rem;
`;

export const MicIcon = styled.img`
  position: absolute;
  top: 2.5rem;
  left: 9.5rem;
  width: 4.375rem;
  height: 4.375rem;
`;

export const SpeakButtonText = styled.span`
  position: absolute;
  top: 3.125rem;
  left: 15rem;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 3rem;
  line-height: 3rem;
  color: #ffffff;
  letter-spacing: -0.015em;
  white-space: nowrap;
`;

export const FingerGuide = styled.div`
  position: absolute;
  top: 20.5rem;
  left: 70.625rem;
`;

export const FingerImage = styled.img`
  width: 12.5rem;
  height: 12.5rem;
  object-fit: contain;
`;

export const OrderSection = styled.div`
  position: absolute;
  width: 90rem;
  height: 32rem;
  left: 0;
  top: 32rem;
`;

export const OrderHeader = styled.div`
  position: absolute;
  width: 90.0625rem;
  height: 6.625rem;
  background: #223770;
  box-shadow: 0 0 1.25rem rgba(0, 0, 0, 0.25);
  border-radius: 1.875rem 1.875rem 0 0;
`;

export const OrderTitle = styled.div`
  position: absolute;
  width: 9.125rem;
  height: 3rem;
  top: 1.9rem;
  left: 5.31rem;
  text-align: center;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 2.25rem;
  line-height: 3rem;
  letter-spacing: -0.03375rem;
  color: #ffffff;
  white-space: nowrap;
`;

export const CancelButton = styled.button`
  position: absolute;
  width: 9rem;
  height: 3rem;
  top: 1.81rem;
  left: 76.6875rem;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 2.25rem;
  line-height: 3rem;
  letter-spacing: -0.03375rem;
  color: #dbdbdb;
  background: transparent;
  white-space: nowrap;
  border: none;
  border-bottom: 0.125rem solid #dbdbdb;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const ProductsArea = styled.div`
  position: absolute;
  width: 90rem;
  height: 25.375rem;
  left: 0;
  top: 6.625rem;
  background: #ffffff;
  display: flex;
  align-items: flex-start;
  padding: 2.125rem 5.25rem 0 5.625rem;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
`;

export const ProductCardContainer = styled.div`
  flex-shrink: 0;
  margin-right: -4.0625rem;
  opacity: ${(props) => (props.$animate ? 1 : 0)};
  transform: ${(props) =>
    props.$animate
      ? "translateY(0) scale(0.75)"
      : "translateY(1.25rem) scale(0.68)"};
  transition: opacity 0.4s ease ${(p) => Number(p.$delay) || 0}s,
    transform 0.4s ease ${(p) => Number(p.$delay) || 0}s;
  transform-origin: top left;
`;

export const ScrollSpacer = styled.div`
  flex-shrink: 0;
  width: ${(p) => Number(p.width) || 0}rem;
  height: 0.0625rem;
`;

export const ProductCard = styled.div`
  position: absolute;
  width: 19.224rem;
  height: 21.1925rem;
  border: 0.0505rem solid #adadad;
  border-radius: 1.009rem;
  background: #ffffff;
`;

export const ProductImage = styled.div`
  position: relative;
  width: 100%;
  height: 10.09375rem;
  background: ${(props) => props.bgColor || "#f2f6fb"};
  border-radius: 1.009rem 1.009rem 0 0;
`;

export const PopularTag = styled.div`
  position: absolute;
  width: 4.6925rem;
  height: 3.0781rem;
  left: 0;
  top: 0;
  background: #223770;
  border-radius: 0 0 1.009rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PopularTagText = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 1.413rem;
  line-height: 1.5rem;
  text-align: center;
  letter-spacing: -0.015em;
  color: #ffffff;
`;

export const ProductInfo = styled.div`
  position: relative;
  width: 100%;
  height: 11.09875rem;
  padding: 1.766rem 1.463rem;
  box-sizing: border-box;
`;

export const ProductName = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 1.615rem;
  line-height: 1.5rem;
  letter-spacing: -0.015em;
  color: #272727;
  margin-bottom: 1.25rem;
`;

export const ProductPrice = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 2.018rem;
  line-height: 1.5rem;
  letter-spacing: -0.015em;
  color: #223770;
  margin-bottom: 2rem;
`;

export const QuantityControls = styled.div`
  position: relative;
  width: 16.045rem;
  height: 1.816rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const QuantityButton = styled.button`
  width: 1.816rem;
  height: 1.816rem;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MinusIcon = styled.div`
  width: 1.261rem;
  height: 0.15125rem;
  background: #272727;
`;

export const PlusIcon = styled.div`
  position: relative;
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    background: #272727;
  }
  &::before {
    width: 1.261rem;
    height: 0.15125rem;
    transform: translate(-50%, -50%);
  }
  &::after {
    width: 0.15125rem;
    height: 1.261rem;
    transform: translate(-50%, -50%);
  }
`;

export const QuantityText = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 2.422rem;
  line-height: 1.5rem;
  text-align: center;
  letter-spacing: -0.015em;
  color: #272727;
`;

export const TagButton = styled.button`
  position: absolute;
  width: 4.844rem;
  height: 2.119rem;
  border: 0.101rem solid ${(props) => props.color || "#3191ff"};
  border-radius: 2.523rem;
  background: transparent;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 1.211rem;
  line-height: 1.5rem;
  letter-spacing: -0.015em;
  color: ${(props) => props.color || "#3191ff"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RemoveButton = styled.button`
  position: absolute;
  width: 2.354rem;
  height: 2.354rem;
  background: transparent;
  border: none;
  cursor: pointer;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 1.868rem;
    height: 0.168rem;
    background: #5d5d5d;
    border-radius: 1.766rem;
    left: 50%;
    top: 50%;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

export const OrderSummary = styled.div`
  position: absolute;
  width: 35.1875rem;
  height: 25.375rem;
  top: 6.625rem;
  left: 54.87rem;
  background: linear-gradient(
    270deg,
    #ffffff 82.95%,
    rgba(255, 255, 255, 0) 97.51%
  );
`;

export const OrderDetails = styled.div`
  position: absolute;
  width: 19.1875rem;
  height: 8.3125rem;
  left: 11.25rem;
  top: 6.375rem;
`;

export const OrderQuantityRow = styled.div`
  position: absolute;
  width: 18.3125rem;
  height: 3.0625rem;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const OrderQuantityLabel = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 3rem;
  letter-spacing: -0.015em;
  color: #223770;
`;

export const OrderQuantityValue = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 2.5rem;
  line-height: 3rem;
  text-align: right;
  letter-spacing: -0.015em;
  color: #223770;
`;

export const OrderDivider = styled.div`
  position: absolute;
  width: 0.125rem;
  height: 2.625rem;
  left: 11.0625rem;
  top: 0.25rem;
  background: #223770;
`;

export const OrderTotal = styled.div`
  position: absolute;
  width: 19.1875rem;
  height: 5.25rem;
  left: 0;
  top: 3.0625rem;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 4.375rem;
  line-height: 5.25rem;
  display: flex;
  align-items: center;
  letter-spacing: -0.015em;
  color: #223770;
`;

export const OrderButton = styled.button`
  position: absolute;
  width: 19.375rem;
  height: 6.25rem;
  left: 11.0625rem;
  top: 16.25rem;
  background: #223770;
  border-radius: 1.25rem;
  border: none;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 2.5rem;
  line-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.015em;
  color: #ffffff;
  cursor: pointer;
`;

export const RecognizedVoiceArea = styled.div`
  position: absolute;
  width: 44rem;
  height: 9.375rem;
  top: 19.5rem;
  left: 39.125rem;
  background: #ffffff;
  border: 0.125rem solid #223770;
  border-radius: 1.875rem 1.875rem 0 1.875rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RecognizedTextContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RecognizedText = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 2.5rem;
  line-height: 3rem;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.015em;
  color: #223770;
  justify-content: center;
`;

export const VoiceRecognitionArea = styled.div`
  position: absolute;
  width: 44rem;
  height: 9.375rem;
  top: 19.5rem;
  left: 39.125rem;
  background: #ffffff;
  border: 0.125rem solid #223770;
  border-radius: 1.875rem 1.875rem 0 1.875rem;
  box-sizing: border-box;
`;

export const AudioSpectrumContainer = styled.div`
  position: absolute;
  width: 17.6875rem;
  height: 6.144rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

import styled from "styled-components";

export const Container = styled.div`
  --ButtonHeight: 260px; /* 공통 변수: 버튼 높이를 한 곳에서 관리 */

  position: relative;
  width: 100%;
  max-width: 1440px;
  height: 1024px;
  margin: 0 auto;
  background: #f6f8fa;
  border-radius: 32px;
  box-shadow: 0 4px 24px rgba(23, 78, 149, 0.09);
  padding: 112px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* 모바일 대응 */
  @media (max-width: 900px) {
    max-width: 100vw;
    height: auto;
    padding: 36.4px 2vw;
  }
`;

export const BottomAccentBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 168px;
  background: #223770;
  border-top-left-radius: 39px;
  border-top-right-radius: 39px;
  z-index: 0; /* 뒤로 */

  @media (max-width: 900px) {
    height: 134.4px;
  }
`;

export const Title = styled.h1`
  font-size: 4.5rem;
  font-weight: 700;
  color: #252830;
  margin-bottom: 19.5px;
  letter-spacing: -1px;
  position: relative;
  z-index: 1; /* 바 위로 */
`;

export const Subtitle = styled.p`
  font-size: 2.7rem;
  color: #607185;
  margin-bottom: 49px;
  position: relative;
  z-index: 1;
`;

export const LargeButton = styled.button`
  display: flex;
  flex-direction: row; /* 텍스트 왼쪽, 이미지 오른쪽 */
  align-items: center;
  justify-content: center;
  gap: 24px; /* 텍스트와 아이콘 간격 */
  background: #fff;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: box-shadow 0.18s;
  position: relative;
  z-index: 1; /* 바(AccentBar)보다 위에 보이도록 */
  min-height: var(--ButtonHeight);

  width: 91%;
  min-width: 756px;
  max-width: 1148px;
  padding: 78px 67px;
  border-radius: 36px;
  box-shadow: 0 4px 20px rgba(23, 78, 149, 0.11);
  margin-bottom: 39px;

  &:hover {
    box-shadow: 0 12px 48px rgba(23, 78, 149, 0.18);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 900px) {
    width: 100%;
    min-width: 0;
    max-width: 100vw;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 28px;
  width: 91%;
  min-width: 756px;
  max-width: 1148px;
  justify-content: center;
  margin-bottom: 21px;
  position: relative;
  z-index: 1; /* 바 위로 */

  @media (max-width: 900px) {
    width: 100%;
    min-width: 0;
    max-width: 100vw;
  }
`;

export const SmallButton = styled.button`
  display: flex;
  flex-direction: row; /* 텍스트 왼쪽, 이미지 오른쪽 */
  align-items: center;
  justify-content: center;
  gap: 24px; /* 텍스트와 아이콘 간격 */
  background: #fff;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: box-shadow 0.18s;
  position: relative;
  z-index: 1; /* 바(AccentBar)보다 위에 보이도록 */
  min-height: var(--ButtonHeight);

  flex: 1 1 0;
  min-width: 350px;
  padding: 50.4px 39.2px;
  border-radius: 28px;
  box-shadow: 0 2px 12px rgba(23, 78, 149, 0.07);

  &:hover {
    box-shadow: 0 8px 32px rgba(23, 78, 149, 0.16);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 900px) {
    padding: 30.8px 14px;
    min-width: 168px;
  }
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  order: 1;
`;

export const ItemName = styled.div`
  font-size: ${(props) => (props.large ? "2.66rem" : "2.1rem")};
  font-weight: 700;
  color: #252830;
  margin-bottom: ${(props) => (props.large ? "8.4px" : "5.6px")};
`;

export const ItemDesc = styled.div`
  font-size: ${(props) => (props.large ? "1.89rem" : "1.61rem")};
  color: #697d8c;
`;

export const Icon = styled.img`
  order: 2; /* 이미지 오른쪽 */
  margin: 0;
  object-fit: contain;
  width: ${(props) => (props.large ? "101px" : "75.6px")};
  height: ${(props) => (props.large ? "101px" : "75.6px")};

  @media (max-width: 900px) {
    width: 53.2px;
    height: 53.2px;
  }
`;

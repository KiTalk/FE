import styled from "styled-components";

export const Container = styled.div`
  --ButtonHeight: 16.25rem; /* 공통 변수: 버튼 높이를 한 곳에서 관리 */

  position: relative;
  width: 100%;
  max-width: 1440px;
  height: 1024px;
  margin: 0 auto;
  background: #f6f8fa;
  border-radius: 2rem;
  box-shadow: 0 0.25rem 1.5rem rgba(23, 78, 149, 0.09);
  padding: 7rem 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* 모바일 대응 */
  @media (max-width: 900px) {
    max-width: 100vw;
    height: auto;
    padding: 2.275rem 2vw;
  }
`;

export const BottomAccentBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 10.5rem;
  background: #223770;
  border-top-left-radius: 2.4375rem;
  border-top-right-radius: 2.4375rem;
  z-index: 0; /* 뒤로 */

  @media (max-width: 900px) {
    height: 8.4rem;
  }
`;

export const Title = styled.h1`
  font-size: 4.5rem;
  font-weight: 700;
  color: #252830;
  margin-bottom: 1.21875rem;
  letter-spacing: -0.0625rem;
  position: relative;
  z-index: 1; /* 바 위로 */
`;

export const Subtitle = styled.p`
  font-size: 2.7rem;
  color: #607185;
  margin-bottom: 3.0625rem;
  position: relative;
  z-index: 1;
`;

export const LargeButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem; /* 텍스트와 아이콘 간격 */
  background: #fff;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: box-shadow 0.18s;
  position: relative;
  z-index: 1;
  min-height: var(--ButtonHeight);

  width: 91%;
  min-width: 756px;
  max-width: 1148px;
  padding: 4.875rem 4.1875rem;
  padding-left: 22rem;
  border-radius: 2.25rem;
  box-shadow: 0 0.25rem 1.25rem rgba(23, 78, 149, 0.11);
  margin-bottom: 2.4375rem;

  &:hover {
    box-shadow: 0 0.75rem 3rem rgba(23, 78, 149, 0.18);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 900px) {
    width: 100%;
    min-width: 0;
    max-width: 100vw;
    padding-left: 2.5rem; /* 모바일에서 왼쪽 여백 조정 */
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1.75rem;
  width: 91%;
  min-width: 756px;
  max-width: 1148px;
  justify-content: center;
  margin-bottom: 1.3125rem;
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
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  background: #fff;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: box-shadow 0.18s;
  position: relative;
  z-index: 1;
  min-height: var(--ButtonHeight);

  flex: 1 1 0;
  min-width: 350px;
  padding: 3.15rem 2.45rem;
  padding-left: 2.5rem;
  border-radius: 1.75rem;
  box-shadow: 0 0.125rem 0.75rem rgba(23, 78, 149, 0.07);

  &:hover {
    box-shadow: 0 0.5rem 2rem rgba(23, 78, 149, 0.16);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 900px) {
    padding: 1.925rem 0.875rem;
    min-width: 168px;
  }
`;

export const Icon = styled.img`
  order: 1;
  margin: 0;
  object-fit: contain;
  width: 7.75rem;
  height: 7.75rem;

  @media (max-width: 900px) {
    width: 3.325rem;
    height: 3.325rem;
  }
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  order: 2;
`;

export const ItemName = styled.div`
  font-size: 2.7rem;
  font-weight: 700;
  color: #272727;
  white-space: nowrap;
  margin-bottom: ${(props) => (props.large ? "0.525rem" : "0.35rem")};
`;

export const ItemDesc = styled.div`
  font-size: 1.9rem;
  font-weight: 400;
  color: #272727;
`;

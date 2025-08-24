import styled from "styled-components";

export const Container = styled.div`
  --ButtonHeight: 16.25rem;

  position: relative;
  width: 1440px;
  height: 1024px;
  margin: 0 auto;
  background: #f6f8fa;
  border-radius: 2rem;
  box-shadow: 0 0.25rem 1.5rem rgba(23, 78, 149, 0.09);
  padding: 7rem 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BottomAccentBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 13.5rem;
  background: #223770;
  border-top-left-radius: 2.4375rem;
  border-top-right-radius: 2.4375rem;
  z-index: 0;
`;

export const Title = styled.h1`
  font-size: 4.5rem;
  font-weight: 700;
  color: #252830;
  margin-bottom: 1.21875rem;
  letter-spacing: -0.0625rem;
  position: relative;
  z-index: 1;
`;

export const Subtitle = styled.p`
  font-size: 2.7rem;
  color: #607185;
  margin-bottom: 3.0625rem;
  position: relative;
  z-index: 1;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1.75rem;
  width: 91%;
  min-width: 47.25rem;
  max-width: 71.75rem;
  justify-content: center;
  margin-bottom: 1.3125rem;
  position: relative;
  z-index: 1;
`;

export const Button = styled.button`
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
  min-width: 21.875rem;
  padding: 3.15rem 2.45rem;
  padding-left: 2.5rem;
  border-radius: 1.75rem;
  box-shadow: 0.1875rem 0.4375rem 0.625rem rgba(0, 0, 0, 0.25);

  &:hover {
    box-shadow: 0 0.5rem 2rem rgba(23, 78, 149, 0.16);
  }

  &:focus {
    outline: none;
  }
`;

export const Icon = styled.img`
  order: 1;
  margin: 0;
  object-fit: contain;
  width: 7.75rem;
  height: 7.75rem;
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

import styled, { keyframes } from "styled-components";

/* Bar grow animation */
const growAnimation = keyframes`
  from {
    height: 0;
  }
  to {
    height: var(--bar-height);
  }
`;

export const Card = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  font-family: "Inter", sans-serif;
  cursor: pointer;

 @media (min-width: 1440px) {
    padding: 25px;
    border-radius: 28px;
  }

  @media (min-width: 2540px) {
    padding: 40px;
    border-radius: 28px;
  }

  @media (min-width: 3840px) {
    padding: 60px;
    border-radius: 32px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;

  @media (min-width: 2540px) {
    font-size: 2rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.6rem;
  }
`;

export const Hours = styled.div`
  font-size: 28px;
  font-weight: 600;
  margin-top: 4px;

  @media (min-width: 2540px) {
    font-size: 2.6rem;
  }

  @media (min-width: 3840px) {
    font-size: 3.4rem;
  }
`;

export const SubTitle = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;

  @media (min-width: 2540px) {
    font-size: 1.6rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.2rem;
  }
`;

export const BarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 15px;
  height: 140px;
  position: relative;

  @media (min-width: 2540px) {
    height: 190px;
    margin-top: 25px;
  }

  @media (min-width: 3840px) {
    height: 250px;
    margin-top: 35px;
  }
`;

export const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media (min-width: 2540px) {
    gap: 12px;
  }

  @media (min-width: 3840px) {
    gap: 16px;
  }
`;

export const Bar = styled.div`
  width: 15px;
  border-radius: 8px;
  background: ${(props) => (props.highlight ? "#FFD050" : "#333")};
  opacity: ${(props) => (props.highlight ? 1 : 0.8)};
  cursor: pointer;

  --bar-height: ${(props) => props.height || "50px"};
  height: var(--bar-height);
  animation: ${growAnimation} 1.2s ease-out;

  transition: transform 0.25s ease;
  &:hover {
    transform: scale(1.1);
  }

  @media (min-width: 2540px) {
    width: 26px;
    border-radius: 12px;
  }

  @media (min-width: 3840px) {
    width: 35px;
    border-radius: 14px;
  }
`;

export const Day = styled.div`
  font-size: 10px;
  color: #555;
  margin-top: 6px;

  @media (min-width: 2540px) {
    font-size: 1.6rem;
    margin-top: 10px;
  }

  @media (min-width: 3840px) {
    font-size: 2.2rem;
    margin-top: 14px;
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  top: -28px;
  background: #333;
  color: #fff;
  padding: 4px 6px;
  font-size: 10px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 10;

  @media (min-width: 2540px) {
    font-size: 1.6rem;
    padding: 8px 12px;
    top: -48px;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 12px 18px;
    top: -65px;
  }
`;

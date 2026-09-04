import styled,{keyframes} from "styled-components";

const slideAnim = keyframes`
  0%   { transform: translateX(0); opacity: 1; }
  50%  { transform: translateX(6px); opacity: 0.8; }
  100% { transform: translateX(0); opacity: 1; }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;


  @media (min-width: 1920px) {
     margin-bottom: 20px;
  }

  @media (min-width: 2560px) {
    margin-bottom: 20px;
  }
     @media (min-width: 3840px) {
     margin-bottom: 20px;
  }
`;

export const Title = styled.h2`
  font-size: 28px;
  color: #222;
  font-weight: 600;

   @media (max-width: 600px) {
    font-size: 14px;
  }

  @media (min-width: 1920px) {
    font-size: 20px;
  }

  @media (min-width: 2560px) {
    font-size: 2.2rem;
  }
     @media (min-width: 3840px) {
    font-size: 2.2rem;
  }
`;

export const SlideButton = styled.button`
  position: relative; /* ✅ required for dot */

  font-size: 20px;
  padding: 8px 14px;
  background: #3352BA;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${slideAnim} 1.5s ease-in-out infinite;

  transition: transform 0.2s ease, box-shadow 0.2s ease;

  svg {
    color: white;
  }

  &:hover {
    animation: none;
    transform: translateX(4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

export const NotificationDot = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;

  width: 8px;
  height: 8px;

  background: #ff3b30;
  border-radius: 50%;
  border: 2px solid white;

  /* optional animation */
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
`;
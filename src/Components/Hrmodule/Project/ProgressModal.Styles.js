import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const NotiWrapper = styled.div`
  position: fixed;
  /* top: 25px;  */
  /* right: 25px; */
  z-index: 9999;
  animation: ${slideIn} 0.4s ease;
`;

export const NotiBox = styled.div`
  width: 250px;
  background: #fff;
  padding: 15px 18px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  border-left: 4px solid ${({ borderColor }) => borderColor || "#5a66ff"};
`;

export const StepText = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 5px;
`;

export const Title = styled.div`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

export const Sub = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

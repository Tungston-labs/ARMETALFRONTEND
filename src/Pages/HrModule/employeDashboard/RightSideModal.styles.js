import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(3px);
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: 0.3s ease;
  z-index: 90;
`;

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 50%;
  background: #f4f8ff;
  box-shadow: -4px 0 20px rgba(0,0,0,0.15);
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.4s cubic-bezier(0.22, 0.68, 0, 1.12);
  z-index: 100;
  padding: 0;
  display: flex;
  flex-direction: column;

  /* ⭐ When modal opens → play animation */
  ${({ isOpen }) =>
    isOpen &&
    `
    animation: slideIn 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  `}

  @media (max-width: 480px) {
    width: 95%;
  }

  @keyframes slideIn {
    from {
      transform: translateX(120px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;


export const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e2e2e2;

  /* Small screens / Mobile */
  @media (max-width: 480px) {
    padding: 12px 14px;
  }

  /* Ultra large screens (2K/4K) */
  @media (min-width: 2540px) {
    padding: 25px 40px;
  }
`;

export const BackButton = styled.button`
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-weight: 500;

  &:hover {
    color: #0070f3;
  }

  /* Small screens */
  @media (max-width: 480px) {
    font-size: 14px;
  }

  /* Ultra large screens */
  @media (min-width: 2540px) {
    font-size: 22px;
  }
`;

export const EditButton = styled.button`
  font-size: 14px;
  padding: 7px 14px;
  border-radius: 6px;
  background: #3352BA;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;

  &:hover {
    background: #1f3a8b;
  }

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 13px;
    padding: 6px 12px;
    border-radius: 5px;
  }

  /* Ultra large screens */
  @media (min-width: 2540px) {
    font-size: 18px;
    padding: 12px 22px;
    border-radius: 10px;
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
`;

export const TwoColumnWrapper = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: 1359px) {
    flex-direction: column;  
    gap: 15px;             
  }

  @media (min-width: 2540px) {
   min-height:30vh ;
  }
`;

export const LeftSide = styled.div`
  flex: 1;   
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const RightSide = styled.div`
  flex: 1; 
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
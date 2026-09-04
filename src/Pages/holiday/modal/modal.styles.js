import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1000;
  animation: ${fadeIn} 0.15s ease-out;
`;

export const Panel = styled.div`
  background: #fff;
  // border-radius: 14px;
  max-width: ${(props) => props.$maxWidth || "520px"};
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  text-align: ${(props) => (props.$centered ? "center" : "left")};
  animation: ${slideUp} 0.18s ease-out;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #eef0f3;
  flex-shrink: 0;
  background-color: #3352BA;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-family: Satoshi, sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #fff;
`;

export const ModalSubtitle = styled.p`
  margin: 2px 0 0;
  font-size: 0.85rem;
  color: #fff;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: none;
  border: none;
  font-size: 1.35rem;
  line-height: 1;
   color: #fff;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: #f2f4f7;
    color: #1a1f2b;
  }
`;

export const Body = styled.div`
  padding: 24px;
  overflow-y: auto;
`;

export const ModalText = styled.p`
  color: #555;
  margin: 0;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #eef0f3;
  flex-shrink: 0;
`;

export const ButtonRow = styled(Footer)`
  border-top: none;
  padding: 0 24px 24px;
  justify-content: center;
`;

export const PrimaryButton = styled.button`
  background-color: #3352ba;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background-color: #26408b;
  }

  &:disabled {
    background-color: #b7c0dd;
    cursor: not-allowed;
  }
`;

export const DeleteButton = styled(PrimaryButton)`
  background-color: #e11d1d;

  &:hover {
    background-color: #b91414;
  }
`;

export const SecondaryButton = styled.button`
  background: #fff;
  color: #444a58;
  border: 1px solid #d8dce3;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: #f7f8fa;
    border-color: #c3c9d3;
  }
`;

export const CancelButton = SecondaryButton;
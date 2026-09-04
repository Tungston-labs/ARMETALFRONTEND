import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 2000;
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);

  animation: popup 0.25s ease;

  @keyframes popup {
    from {
      opacity: 0;
      transform: translateY(-12px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalTitle = styled.h3`
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
`;

export const Message = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
`;

export const ButtonRow = styled.div`
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

export const ModalButton = styled.button`
  min-width: 110px;
  height: 42px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s ease;

  ${({ variant }) => {
    switch (variant) {
      case "success":
        return `
          background:#22c55e;
          color:#fff;
          border:1px solid #22c55e;

          &:hover{
            background:#16a34a;
          }
        `;

      case "danger":
        return `
          background:#ef4444;
          color:#fff;
          border:1px solid #ef4444;

          &:hover{
            background:#dc2626;
          }
        `;

      case "warning":
        return `
          background:#f59e0b;
          color:#fff;
          border:1px solid #f59e0b;

          &:hover{
            background:#d97706;
          }
        `;

      case "cancel":
        return `
          background:#ffffff;
          color:#374151;
          border:1px solid #d1d5db;

          &:hover{
            background:#f9fafb;
          }
        `;

      default:
        return `
          background:#304EB0;
          color:#fff;
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
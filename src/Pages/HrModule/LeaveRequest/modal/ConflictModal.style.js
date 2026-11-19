import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

export const ModalCard = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #e5e7eb;

  h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: #111827;
  }
`;

export const CloseIcon = styled.button`
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
  padding: 0 4px;

  &:hover {
    color: #111827;
  }
`;

export const RequestInfo = styled.div`
  padding: 12px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;

  span {
    color: #6b7280;
  }
`;

export const ModalBody = styled.div`
  padding: 16px 20px;
  overflow-y: auto;
  flex: 1;
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  margin: 4px 0 8px;
  color: ${({ $variant }) => ($variant === "approved" ? "#dc2626" : "#d97706")};
`;

export const CountBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 999px;
  background: ${({ $variant }) => ($variant === "approved" ? "#fee2e2" : "#fef3c7")};
  color: ${({ $variant }) => ($variant === "approved" ? "#b91c1c" : "#b45309")};
`;

export const LeaveItem = styled.div`
  border: 1px solid #e5e7eb;
  border-left: 4px solid
    ${({ $variant }) => ($variant === "approved" ? "#dc2626" : "#f59e0b")};
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;

  .name {
    font-weight: 600;
    color: #111827;
    font-size: 14px;
  }

  .type {
    text-transform: capitalize;
    color: #6b7280;
    font-size: 13px;
    margin-left: 6px;
  }

  .dates {
    margin-top: 2px;
    color: #6b7280;
    font-size: 13px;
  }
`;

export const EmptyState = styled.p`
  text-align: center;
  color: #6b7280;
  padding: 24px 0;
  margin: 0;
`;

export const ModalFooter = styled.div`
  padding: 12px 20px;
  border-top: 1px solid #e5e7eb;
  text-align: right;
`;

export const CloseButton = styled.button`
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`;
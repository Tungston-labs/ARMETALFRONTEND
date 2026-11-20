import styled from "styled-components";

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ActionIconButton = styled.button`
  width: 28px;
  height: 28px;
  padding: 0;
  margin: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: ${({ $variant }) => ($variant === "delete" ? "#dc2626" : "#374151")};

  cursor: pointer;
  transition: all 0.15s ease-in-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

  &:hover {
    background: ${({ $variant }) => ($variant === "delete" ? "#fef2f2" : "#f9fafb")};
    border-color: ${({ $variant }) => ($variant === "delete" ? "#fca5a5" : "#d1d5db")};
    color: ${({ $variant }) => ($variant === "delete" ? "#b91c1c" : "#111827")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 14px;
    display: block;
  }
`;
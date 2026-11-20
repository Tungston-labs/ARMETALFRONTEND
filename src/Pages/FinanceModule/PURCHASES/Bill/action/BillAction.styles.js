import styled from "styled-components";

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
`;

export const IconButton = styled.button`
  width: 28px;
  height: 28px;
  padding: 0;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background: #fff;
  border: 1px solid #d9dde3;
  border-radius: 4px;
  color: ${({ $variant }) => ($variant === "danger" ? "#dc2626" : "#1f2937")};

  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ $variant }) =>
      $variant === "danger" ? "#fff1f1" : "#f3f4f6"};
    border-color: ${({ $variant }) =>
      $variant === "danger" ? "#dc2626" : "#b8bec8"};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    display: block;
  }
`;
import styled from "styled-components";

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 4px;
  margin-top: 15px;
`;

export const TotalRecords = styled.span`
  margin-right: auto;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
`;

export const PageButton = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid ${({ $active }) => ($active ? "#4f46e5" : "#e5e7eb")};
  background-color: ${({ $active }) => ($active ? "#304eb0" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#374151")};
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? "#4338ca" : "#f9fafb"};
    border-color: ${({ $active }) =>
      $active ? "#4338ca" : "#d1d5db"};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Ellipsis = styled.span`
  padding: 0 6px;
  font-size: 13px;
  color: #9ca3af;
`;
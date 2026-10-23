import styled from "styled-components";

export const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 8px 14px;

  border: 1px solid #e5e7eb;
  border-radius: 10px;

  background: #ffffff;

  color: #6b7280;
  font-size: 13px;
  font-weight: 500;

  cursor: pointer;

  transition: all .25s ease;

  &:hover {
    background: #f8fafc;
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: #4f63d2;
  }
`;

export const Label = styled.span`
  white-space: nowrap;
`;
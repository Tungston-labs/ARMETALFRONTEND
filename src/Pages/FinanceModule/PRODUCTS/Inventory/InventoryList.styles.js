import styled from "styled-components";

export const InventoryInfoButton = styled.button`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #e5e7eb;
  border-radius: 5px;

  background: #ffffff;
  color: #333333;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    border-color: #d1d5db;
  }
`;

export const StockStatus = styled.span`
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;

  &.in-stock {
    color: #16a34a;
  }

  &.low-stock {
    color: #f97316;
  }

  &.out-of-stock {
    color: #ef4444;
  }
`;

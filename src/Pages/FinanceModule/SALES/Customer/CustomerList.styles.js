import styled, { css } from "styled-components";

/* =========================================================
   CUSTOMER NAME LINK
========================================================= */

export const LinkName = styled.button`
  color: #1f2937;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
`;

/* =========================================================
   BALANCE
========================================================= */

export const BalanceAmount = styled.span`
  font-weight: 500;
  color: ${({ $negative }) => ($negative ? "#e53935" : "#1f2937")};
`;

/* =========================================================
   ACTIONS
========================================================= */

export const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;

  padding: 6px 8px;

  font-size: 12px;
  font-weight: 500;
  color: #374151;

  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;

  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #f9fafb;
  }
`;

/* =========================================================
   INFO / ACTIONS (kebab → inline edit + delete circles)
========================================================= */

export const MenuWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const KebabButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;
  flex-shrink: 0;

  color: #6b7280;

  background: #f3f4f6;
  border: none;
  border-radius: 999px;

  cursor: pointer;

  &:hover {
    background: #e5e7eb;
  }
`;

export const CircleIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;
  flex-shrink: 0;

  border: none;
  border-radius: 999px;

  cursor: pointer;

  ${({ $variant }) =>
    $variant === "edit" &&
    css`
      background: #fef3c7;
      color: #b45309;

      &:hover {
        background: #fde68a;
      }
    `}

  ${({ $variant }) =>
    $variant === "delete" &&
    css`
      background: #fee2e2;
      color: #dc2626;

      &:hover {
        background: #fecaca;
      }
    `}
`;
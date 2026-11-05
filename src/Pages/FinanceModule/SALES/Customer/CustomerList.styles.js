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
    flex-wrap: wrap; 
  /* white-space: nowrap; */
  row-gap: 6px;
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
  border-radius: 5px;

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
 width: 25px;
    height: 25px;
    padding: 0;
    margin: 0;

    border: 1px solid #ccc;
    border-radius: 5px;

    background: #fff;
    /* color: #374151; */

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    flex-shrink: 0;

    position: relative;
    z-index: 10;

    transition: all 0.2s ease;

    &:hover {
        background: #e5e7eb;
        transform: scale(1.08);
    }

    svg {
        display: block;
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
export const DateRangeWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const DatePickerContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    width: 280px;
    height: 38px;
    padding: 0 10px;

    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #ffffff;

    box-sizing: border-box;
`;

export const DateInput = styled.input`
    flex: 1;
    min-width: 0;
    width: 100%;
    height: 100%;

    border: none;
    outline: none;
    background: transparent;

    color: #374151;
    font-size: 13px;
    cursor: pointer;

    &::-webkit-calendar-picker-indicator {
        cursor: pointer;
    }
`;

export const DateSeparator = styled.span`
    flex-shrink: 0;

    color: #6b7280;
    font-size: 13px;
    font-weight: 500;
`;

export const ExportButton = styled.button`
    height: 38px;
    min-width: 90px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    padding: 0 14px;

    border: 1px solid #e5e7eb;
    border-radius: 6px;

    background: #ffffff;
    color: #374151;

    font-size: 13px;
    font-weight: 500;

    cursor: pointer;

    transition: all 0.2s ease;

    svg {
        width: 16px;
        height: 16px;
    }

    &:hover {
        border-color: #f78926;
        color: #f78926;
        background: #fff8f2;
    }

    &:active {
        transform: scale(0.98);
    }

    @media (max-width: 900px) {
        min-width: 38px;
        width: 38px;
        padding: 0;

        span {
            display: none;
        }
    }
`;
export const ArchivedBalance = styled.span`
  font-weight: 500;
  color: ${({ $due }) => ($due ? "#dc2626" : "#16a34a")};
`;

export const ArchiveActionButton = styled.button`
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  border-radius: 3px;
  border: 1px solid;
  cursor: pointer;
  white-space: nowrap;

  ${({ $variant }) =>
    $variant === "restore" &&
    css`
      background: #e6f4ea;
      color: #15803d;
      border-color: #86c99a;

      &:hover {
        background: #d3ecda;
      }
    `}

  ${({ $variant }) =>
    $variant === "delete" &&
    css`
      background: #fde8e8;
      color: #dc2626;
      border-color: #f3b4b4;

      &:hover {
        background: #fbd3d3;
      }
    `}
`;
const STATUS_COLORS = {
  active:   {  color: "#15803d", border: "#86c99a" }, // green
  inactive: {  color: "#dc2626", border: "#f3b4b4" }, // red
  archived:    {  color: "#2563eb", border: "#a9c4f5" }, // blue
};

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  border-radius: 999px;
  border: none;
  white-space: nowrap;

  ${({ $status }) => {
    const c = STATUS_COLORS[$status] || STATUS_COLORS.archived;
    return css`
      /* background: ${c.bg}; */
      color: ${c.color};
      border-color: ${c.border};
    `;
  }}
`;